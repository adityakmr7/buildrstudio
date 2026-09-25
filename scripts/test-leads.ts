// Unit-style checks for handoff detection, lead validation, CSV export and
// webhook signing. No network, no DB. Run: bun run test:leads
import { createHmac } from "node:crypto";
import { decideHandoff, detectHumanIntent, extractHandoffToken, whatsappLink } from "../app/lib/handoff";
import { leadsToCsv, parseLeadInput, signWebhook } from "../app/lib/leads";

let failed = 0;
const check = (cond: boolean, msg: string) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

for (const m of ["Can I talk to a human?", "please call me back", "what's the pricing?", "how much does it cost", "I want to speak with someone"]) {
  check(detectHumanIntent(m), `human intent: ${m}`);
}
for (const m of ["What are your opening hours?", "Do you ship to Pune?"]) check(!detectHumanIntent(m), `no intent: ${m}`);

const t = extractHandoffToken("I don't know that. [[HANDOFF]]");
check(t.flagged && t.reply === "I don't know that.", "model token detected + stripped");
check(decideHandoff({ message: "hours?", modelFlagged: false, hasKnowledge: true, topScore: 0.2 }) === "no_answer", "low retrieval score → no_answer");
check(decideHandoff({ message: "hours?", modelFlagged: false, hasKnowledge: false, topScore: null }) === null, "no knowledge, no flag → none");
check(decideHandoff({ message: "call me back", modelFlagged: true, hasKnowledge: true, topScore: 0.9 }) === "asked_human", "asked_human wins");
check(whatsappLink("+91 98765-43210", "hi there") === "https://wa.me/919876543210?text=hi%20there", "wa.me link");
check(whatsappLink("123", "x") === null, "bad WhatsApp number → no link");

check(typeof parseLeadInput({ name: "", email: "a@b.co" }) === "string", "lead: name required");
check(typeof parseLeadInput({ name: "A", email: "nope" }) === "string", "lead: email validated");
const ok = parseLeadInput({ name: " Ravi ", email: "Ravi@X.in", trigger: "bogus", page_url: "javascript:alert(1)" });
check(typeof ok !== "string" && ok.name === "Ravi" && ok.email === "ravi@x.in" && ok.trigger === "manual" && ok.pageUrl === null, "lead: normalised + unsafe page_url dropped");

const csv = leadsToCsv([
  { createdAt: new Date(0), name: '=HYPERLINK("x")', email: "a@b.c", phone: null, message: 'he said "hi"', trigger: "manual", pageUrl: null, chatSessionId: null, agent: { name: "A" } },
]);
check(csv.includes(`"'=HYPERLINK(""x"")"`) && csv.includes(`"he said ""hi"""`), "csv: quoting + formula-injection guard");

const sig = signWebhook("whsec_test", "1700000000", '{"a":1}');
check(sig === `sha256=${createHmac("sha256", "whsec_test").update('1700000000.{"a":1}').digest("hex")}`, "webhook HMAC signature");

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
