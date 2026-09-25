// Lead capture + owner notification. Server-only.
//
// Notification channels, all best-effort (a failed notification never
// loses the lead — it's already saved and visible in the dashboard):
//   - Email to the account owner via Resend, only when RESEND_API_KEY and
//     LEADS_FROM_EMAIL are set (the resend package was already a
//     dependency, unused). Per-install toggle: ApiKey.leadEmailEnabled.
//   - A generic webhook per install (ApiKey.leadWebhookUrl): POST JSON,
//     signed with HMAC-SHA256 (see signWebhook) using ApiKey.leadWebhookSecret.
//     Sent through safePost() so an owner can't point it at our internal network.
//   - WhatsApp: not a server-side send — the visitor gets a wa.me
//     click-to-chat link to the owner's number (app/lib/handoff.ts).

import { createHmac, randomBytes } from "node:crypto";
import { Resend } from "resend";
import { db } from "./db";
import { safePost } from "./safeFetch";

export const LEAD_TRIGGERS = ["no_answer", "asked_human", "manual"] as const;
export type LeadTrigger = (typeof LEAD_TRIGGERS)[number];

export interface LeadInput {
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  trigger: LeadTrigger;
  pageUrl: string | null;
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

/** Validates + trims raw widget input. Returns an error string on failure. */
export function parseLeadInput(body: Record<string, unknown>): LeadInput | string {
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(body.name, 120);
  const email = str(body.email, 200).toLowerCase();
  const phone = str(body.phone, 30);
  const message = str(body.message, 2000);
  const trigger = LEAD_TRIGGERS.includes(body.trigger as LeadTrigger) ? (body.trigger as LeadTrigger) : "manual";
  let pageUrl: string | null = str(body.page_url, 500) || null;
  if (pageUrl && !/^https?:\/\//i.test(pageUrl)) pageUrl = null;

  if (!name) return "Please add your name.";
  if (!EMAIL_RE.test(email)) return "Please add a valid email address.";
  if (phone && !/^[+\d][\d\s().-]{5,29}$/.test(phone)) return "That phone number doesn't look right.";
  return { name, email, phone: phone || null, message: message || null, trigger, pageUrl };
}

export function generateWebhookSecret() {
  return `whsec_${randomBytes(24).toString("hex")}`;
}

/**
 * Signature scheme for lead webhooks (documented in the dashboard):
 *   X-BuildrStudio-Timestamp: <unix seconds>
 *   X-BuildrStudio-Signature: sha256=<hex HMAC-SHA256 of `${timestamp}.${rawBody}` with the secret>
 * Receivers should recompute it over the raw body and reject stale timestamps.
 */
export function signWebhook(secret: string, timestamp: string, body: string) {
  return `sha256=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

export async function sendWebhook(url: string, secret: string, payload: unknown): Promise<{ ok: boolean; status?: number; error?: string }> {
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  try {
    const res = await safePost(url, body, {
      "Content-Type": "application/json",
      "X-BuildrStudio-Event": (payload as { event?: string }).event ?? "lead.created",
      "X-BuildrStudio-Timestamp": timestamp,
      "X-BuildrStudio-Signature": signWebhook(secret, timestamp, body),
    });
    return res.status >= 200 && res.status < 300 ? { ok: true, status: res.status } : { ok: false, status: res.status, error: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function isLeadEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL);
}

let resend: Resend | undefined;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const TRIGGER_LABEL: Record<string, string> = {
  no_answer: "the agent couldn't answer",
  asked_human: "they asked for a person / pricing / a callback",
  manual: "they clicked \u201cTalk to a person\u201d",
};

export function leadPayload(lead: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  trigger: string;
  pageUrl: string | null;
  chatSessionId: string | null;
  createdAt: Date;
}, agent: { slug: string; name: string }) {
  return {
    event: "lead.created",
    lead: {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      trigger: lead.trigger,
      page_url: lead.pageUrl,
      conversation_id: lead.chatSessionId,
      created_at: lead.createdAt.toISOString(),
    },
    agent: { slug: agent.slug, name: agent.name },
    dashboard_url: "https://buildrstudio.in/dashboard/leads",
  };
}

/** Fire the owner notifications for a saved lead and record the outcome. */
export async function notifyLead(leadId: string) {
  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { apiKey: true, agent: true, user: true } });
  if (!lead) return;

  let emailStatus = "skipped";
  if (lead.apiKey.leadEmailEnabled && isLeadEmailConfigured()) {
    try {
      const lines = [
        `New lead from your ${lead.agent.name} on BuildrStudio — ${TRIGGER_LABEL[lead.trigger] ?? lead.trigger}.`,
        "",
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.message ? `Message: ${lead.message}` : null,
        lead.pageUrl ? `Page: ${lead.pageUrl}` : null,
        "",
        "All leads: https://buildrstudio.in/dashboard/leads",
      ].filter((l): l is string => l !== null);
      const { error } = await getResend().emails.send({
        from: process.env.LEADS_FROM_EMAIL!,
        to: lead.user.email,
        replyTo: lead.email,
        subject: `New lead: ${lead.name} (${lead.agent.name})`,
        text: lines.join("\n"),
        html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">${lines
          .map((l) => (l ? escapeHtml(l) : "<br>"))
          .join("<br>")}</div>`,
      });
      emailStatus = error ? "failed" : "sent";
      if (error) console.error("[leads] email failed:", error);
    } catch (err) {
      emailStatus = "failed";
      console.error("[leads] email failed:", err);
    }
  }

  let webhookStatus = "skipped";
  if (lead.apiKey.leadWebhookUrl && lead.apiKey.leadWebhookSecret) {
    const res = await sendWebhook(lead.apiKey.leadWebhookUrl, lead.apiKey.leadWebhookSecret, leadPayload(lead, lead.agent));
    webhookStatus = res.ok ? "sent" : "failed";
    if (!res.ok) console.error("[leads] webhook failed:", res.error);
  }

  await db.lead.update({ where: { id: leadId }, data: { emailStatus, webhookStatus } });
}

/** CSV with formula-injection protection (cells starting = + - @ get a quote). */
export function leadsToCsv(
  leads: {
    createdAt: Date;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    trigger: string;
    pageUrl: string | null;
    chatSessionId: string | null;
    agent: { name: string };
  }[],
) {
  const cell = (v: string | null | undefined) => {
    let s = v ?? "";
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = ["Date (UTC)", "Agent", "Name", "Email", "Phone", "Message", "Trigger", "Page", "Conversation ID"];
  const rows = leads.map((l) =>
    [l.createdAt.toISOString(), l.agent.name, l.name, l.email, l.phone, l.message, l.trigger, l.pageUrl, l.chatSessionId].map(cell).join(","),
  );
  return [header.map(cell).join(","), ...rows].join("\r\n") + "\r\n";
}
