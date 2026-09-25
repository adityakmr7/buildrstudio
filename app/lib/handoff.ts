// When should the widget offer "leave your details and a person will get
// back to you"? Three signals, any one is enough:
//   1. The visitor asks for a human / callback / pricing / a quote
//      (detectHumanIntent — cheap regex on their message).
//   2. The model says it can't answer from what it knows — it's told to end
//      such replies with HANDOFF_TOKEN, which we strip before returning.
//   3. Retrieval found nothing close: the install HAS a knowledge base but
//      the best chunk scored under LOW_CONFIDENCE_SCORE.
// Signal 3's threshold is a conservative starting guess for
// gemini-embedding-001 cosine scores — tune it once real conversations
// exist (the unanswered-questions list makes that easy to eyeball).

export const HANDOFF_TOKEN = "[[HANDOFF]]";
export const LOW_CONFIDENCE_SCORE = 0.5;

export type HandoffReason = "no_answer" | "asked_human";

export const HANDOFF_INSTRUCTION = `

If you can't answer the visitor's question from the information you have, or they ask to talk to a person, request a callback, or want a price or quote you don't have, say so briefly and honestly and offer to have someone from the team get back to them. In that case (and only then) end your reply with the exact token ${HANDOFF_TOKEN}. Never invent facts, prices, or policies.`;

const HUMAN_INTENT_PATTERNS: RegExp[] = [
  /\b(talk|speak|chat)\s+(to|with)\s+(a\s+|an\s+|some|the\s+)?(human|person|someone|somebody|real|agent|representative|rep|team|owner|staff|manager|sales)/i,
  /\b(human|real person|live agent|customer care|customer service)\b/i,
  /\b(call\s*me|call\s*back|callback|ring me|phone call|get in touch|contact (you|someone|sales|the team))\b/i,
  /\b(price|pricing|quote|quotation|cost|how much|rates?|charges?|fees?)\b/i,
  /\b(book|schedule)\s+(a\s+)?(call|demo|meeting|appointment|visit)\b/i,
  /\bwhats\s?app\b/i,
];

export function detectHumanIntent(message: string): boolean {
  return HUMAN_INTENT_PATTERNS.some((re) => re.test(message));
}

/** Removes the model's handoff token; reports whether it was present. */
export function extractHandoffToken(reply: string): { reply: string; flagged: boolean } {
  if (!reply.includes(HANDOFF_TOKEN)) return { reply, flagged: false };
  const cleaned = reply.split(HANDOFF_TOKEN).join("").trim();
  return { reply: cleaned || "I'm not sure about that one. Someone from the team can get back to you.", flagged: true };
}

/** Decides the handoff signal for one exchange. */
export function decideHandoff(opts: {
  message: string;
  modelFlagged: boolean;
  hasKnowledge: boolean;
  topScore: number | null;
}): HandoffReason | null {
  if (detectHumanIntent(opts.message)) return "asked_human";
  if (opts.modelFlagged) return "no_answer";
  if (opts.hasKnowledge && opts.topScore !== null && opts.topScore < LOW_CONFIDENCE_SCORE) return "no_answer";
  return null;
}

/** wa.me click-to-chat link, or null if the number isn't usable. */
export function whatsappLink(number: string | null | undefined, text: string): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function normalizeWhatsappNumber(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length < 8 || digits.length > 15) throw new Error("Enter the full WhatsApp number with country code, e.g. 919876543210.");
  return digits;
}
