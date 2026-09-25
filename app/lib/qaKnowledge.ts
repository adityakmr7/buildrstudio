// "Add answer to knowledge" from the Unanswered questions list. Each answer
// becomes one DocumentChunk ("Q: … / A: …") under a per-install KnowledgeSource
// of kind "qa", so it survives saving the pasted-text box (sourceId null) and
// website re-syncs (other sourceIds).

import { db } from "./db";
import { embedText, MAX_CHUNKS_PER_KEY } from "./knowledge";

const QA_SOURCE_URL = "qa://answered-questions";
export const MAX_ANSWER_CHARS = 2000;

export async function addAnswerToKnowledge(apiKeyId: string, question: string, answer: string) {
  const total = await db.documentChunk.count({ where: { apiKeyId } });
  if (total >= MAX_CHUNKS_PER_KEY) {
    throw new Error(`This agent already has ${MAX_CHUNKS_PER_KEY} knowledge chunks. Remove a source first.`);
  }
  const source = await db.knowledgeSource.upsert({
    where: { apiKeyId_url: { apiKeyId, url: QA_SOURCE_URL } },
    update: {},
    create: { apiKeyId, url: QA_SOURCE_URL, kind: "qa", status: "ok" },
  });
  const content = `Q: ${question.trim()}\nA: ${answer.trim()}`;
  const embedding = await embedText(content);
  await db.$transaction([
    db.documentChunk.create({
      data: { apiKeyId, sourceId: source.id, source: "Answered question", content, embedding },
    }),
    db.knowledgeSource.update({
      where: { id: source.id },
      data: { chunkCount: { increment: 1 }, lastSyncedAt: new Date() },
    }),
  ]);
}
