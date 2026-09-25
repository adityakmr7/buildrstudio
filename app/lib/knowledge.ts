// Retrieval-augmented generation for the paid embed widget — the feature
// that makes an agent actually know something about the customer's
// business, instead of giving every subscriber the identical generic
// system prompt. Deliberately simple for indie/small-business scale:
//   - One knowledge base per ApiKey (upload/replace, not a document CMS)
//   - Plain-text input (paste, or a .txt/.md file read client-side), plus
//     websites crawled from a URL/sitemap (app/lib/websiteKnowledge.ts) —
//     no PDF parsing for now
//   - Embeddings stored as Float[] and compared with in-app cosine
//     similarity — no pgvector extension to manage. Fine up to a few
//     hundred chunks per customer; revisit only if that stops being true.
//
// Not used by the on-site demo (/api/v1/demo) — that route is deliberately
// DB-free and has no per-customer identity to scope a knowledge base to.

import { getGemini } from "./gemini";
import { db } from "./db";

export const EMBEDDING_MODEL = "gemini-embedding-001";

// Bounds chosen for indie-scale usage and to cap embedding API cost per
// upload — not architectural limits, just sane defaults to revisit if a
// real customer actually needs more.
export const MAX_CHARS_PER_UPLOAD = 50_000;
export const MAX_CHUNKS_PER_KEY = 300;
export const RETRIEVAL_TOP_K = 4;

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

export function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    const chunk = clean.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end === clean.length) break;
    start = end - CHUNK_OVERLAP;
  }
  return chunks;
}

export async function embedText(text: string): Promise<number[]> {
  const model = getGemini().getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Batch embedding (one request per EMBED_BATCH_SIZE texts) — used by website
// sync, where a crawl can produce a couple of hundred chunks and one request
// per chunk wouldn't fit in a single serverless invocation.
const EMBED_BATCH_SIZE = 50;

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const model = getGemini().getGenerativeModel({ model: EMBEDDING_MODEL });
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const result = await model.batchEmbedContents({
      requests: batch.map((text) => ({ content: { role: "user", parts: [{ text }] } })),
    });
    if (result.embeddings.length !== batch.length) {
      throw new Error("Embedding batch returned the wrong number of vectors.");
    }
    out.push(...result.embeddings.map((e) => e.values));
  }
  return out;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Returns the most relevant chunks of a customer's knowledge base for a
 * given query, or an empty array if they haven't uploaded one. Caller
 * decides what to do with an empty result (agent just answers generically).
 */
export async function retrieveRelevantChunks(apiKeyId: string, query: string): Promise<string[]> {
  const chunks = await db.documentChunk.findMany({
    where: { apiKeyId },
    select: { content: true, embedding: true },
  });
  if (chunks.length === 0) return [];

  const queryEmbedding = await embedText(query);
  const scored = chunks
    .map((c) => ({ content: c.content, score: cosineSimilarity(queryEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, RETRIEVAL_TOP_K).map((s) => s.content);
}
