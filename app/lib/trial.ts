// Free-trial packaging — client-safe (no DB import), so marketing copy,
// the dashboard, and the chat API all read the same numbers. Change them
// here and every surface follows.
//
// These are packaging limits we set ourselves (like the 20-message fallback
// that existed before), not prices.

export const TRIAL_MESSAGE_LIMIT = 100;
export const TRIAL_DAYS = 14;

/** Short, honest one-liner reused by CTAs and FAQ copy. */
export const TRIAL_SUMMARY = `${TRIAL_DAYS}-day free trial, ${TRIAL_MESSAGE_LIMIT} messages, no card`;

export interface TrialStatus {
  messageLimit: number;
  messagesUsed: number;
  messagesLeft: number;
  endsAt: string; // ISO
  daysLeft: number;
  expired: boolean; // out of time OR out of messages
  reason: "active" | "time" | "messages";
  converted: boolean;
}

export function computeTrialStatus(
  trial: { messageLimit: number; messagesUsed: number; endsAt: Date; convertedAt: Date | null },
  now: Date = new Date(),
): TrialStatus {
  const msLeft = trial.endsAt.getTime() - now.getTime();
  const messagesLeft = Math.max(0, trial.messageLimit - trial.messagesUsed);
  const outOfTime = msLeft <= 0;
  const outOfMessages = messagesLeft <= 0;
  return {
    messageLimit: trial.messageLimit,
    messagesUsed: trial.messagesUsed,
    messagesLeft,
    endsAt: trial.endsAt.toISOString(),
    daysLeft: outOfTime ? 0 : Math.ceil(msLeft / 86_400_000),
    expired: outOfTime || outOfMessages,
    reason: outOfTime ? "time" : outOfMessages ? "messages" : "active",
    converted: trial.convertedAt !== null,
  };
}
