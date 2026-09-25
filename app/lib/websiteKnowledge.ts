// "Train from a website URL": crawls a site (app/lib/crawler.ts) and feeds
// the text into the same chunk → embed → DocumentChunk pipeline the pasted-
// text knowledge base uses (app/lib/knowledge.ts). Each website is a
// KnowledgeSource; its chunks carry sourceId so a re-sync replaces only
// that website's chunks, never the pasted text or another website.

import { db } from "./db";
import { crawlSite, type CrawlResult } from "./crawler";
import { chunkText, embedTexts, MAX_CHUNKS_PER_KEY } from "./knowledge";
import { UnsafeUrlError } from "./safeFetch";

export const MAX_WEBSITE_SOURCES_PER_KEY = 3;
// A sync that started this long ago and never finished (function killed
// mid-crawl) no longer blocks a new one.
const STALE_SYNC_MS = 3 * 60_000;

export interface SyncOutcome {
  status: "ok" | "partial" | "failed";
  pagesFound: number;
  pagesIngested: number;
  chunkCount: number;
  errors: { url: string; error: string }[];
  message?: string;
}

export function isSyncInProgress(source: { status: string; updatedAt: Date }) {
  return source.status === "syncing" && Date.now() - source.updatedAt.getTime() < STALE_SYNC_MS;
}

export async function syncWebsiteSource(sourceId: string): Promise<SyncOutcome> {
  const source = await db.knowledgeSource.findUniqueOrThrow({ where: { id: sourceId } });
  await db.knowledgeSource.update({ where: { id: sourceId }, data: { status: "syncing" } });

  const fail = async (message: string, crawl?: CrawlResult): Promise<SyncOutcome> => {
    // A failed sync keeps the previous chunks — a flaky site shouldn't wipe
    // a knowledge base that was working.
    const errors = [{ url: source.url, error: message }, ...(crawl?.errors ?? [])].filter(
      (e, i, arr) => arr.findIndex((x) => x.url === e.url && x.error === e.error) === i,
    );
    await db.knowledgeSource.update({
      where: { id: sourceId },
      data: { status: "failed", errors, pagesFound: crawl?.pagesFound ?? 0, lastSyncedAt: new Date() },
    });
    return { status: "failed", pagesFound: crawl?.pagesFound ?? 0, pagesIngested: 0, chunkCount: source.chunkCount, errors, message };
  };

  let crawl: CrawlResult;
  try {
    crawl = await crawlSite(source.url);
  } catch (err) {
    const message = err instanceof UnsafeUrlError ? err.message : "Couldn't crawl that site.";
    console.error("[websiteKnowledge] crawl failed:", err);
    return fail(message);
  }
  if (crawl.pages.length === 0) {
    return fail("No readable pages found.", crawl);
  }

  // Chunk budget: the per-install cap minus everything that isn't this source.
  const otherChunks = await db.documentChunk.count({
    where: { apiKeyId: source.apiKeyId, OR: [{ sourceId: null }, { sourceId: { not: sourceId } }] },
  });
  const budget = Math.max(0, MAX_CHUNKS_PER_KEY - otherChunks);
  if (budget === 0) {
    return fail(`This agent already has ${MAX_CHUNKS_PER_KEY} knowledge chunks. Remove a source or shorten the pasted text first.`, crawl);
  }

  // Chunk page by page so a chunk never straddles two pages, and prefix each
  // chunk with its page so answers can reference where it came from.
  const rows: { source: string; content: string }[] = [];
  const ingestedPages = new Set<string>();
  for (const page of crawl.pages) {
    const header = `${page.title ? `${page.title}\n` : ""}${page.url}\n\n`;
    for (const chunk of chunkText(page.text)) {
      if (rows.length >= budget) break;
      rows.push({ source: page.url.slice(0, 500), content: header + chunk });
      ingestedPages.add(page.url);
    }
    if (rows.length >= budget) break;
  }

  let embeddings: number[][];
  try {
    embeddings = await embedTexts(rows.map((r) => r.content));
  } catch (err) {
    console.error("[websiteKnowledge] embedding failed:", err);
    return fail("Crawled the site but couldn't index it. Try again.", crawl);
  }

  const truncated = rows.length >= budget && crawl.pages.length > ingestedPages.size;
  const status: SyncOutcome["status"] = crawl.errors.length || crawl.stoppedEarly || truncated ? "partial" : "ok";
  const errors = [...crawl.errors];
  if (crawl.stoppedEarly) errors.push({ url: source.url, error: "Stopped at the page/time limit — some pages weren't crawled." });
  if (truncated) errors.push({ url: source.url, error: `Hit the ${MAX_CHUNKS_PER_KEY}-chunk limit — later pages weren't indexed.` });

  await db.$transaction([
    db.documentChunk.deleteMany({ where: { sourceId } }),
    db.documentChunk.createMany({
      data: rows.map((r, i) => ({ apiKeyId: source.apiKeyId, sourceId, source: r.source, content: r.content, embedding: embeddings[i] })),
    }),
    db.knowledgeSource.update({
      where: { id: sourceId },
      data: {
        status,
        pagesFound: crawl.pagesFound,
        pagesIngested: ingestedPages.size,
        chunkCount: rows.length,
        errors,
        lastSyncedAt: new Date(),
      },
    }),
  ]);

  return { status, pagesFound: crawl.pagesFound, pagesIngested: ingestedPages.size, chunkCount: rows.length, errors };
}

/** Shape returned to the dashboard. A stale "syncing" row reads as failed. */
export function serializeSource(s: {
  id: string;
  url: string;
  status: string;
  pagesFound: number;
  pagesIngested: number;
  chunkCount: number;
  errors: unknown;
  lastSyncedAt: Date | null;
  updatedAt: Date;
}) {
  return {
    id: s.id,
    url: s.url,
    status: isSyncInProgress(s) ? "syncing" : s.status === "syncing" ? "failed" : s.status,
    pagesFound: s.pagesFound,
    pagesIngested: s.pagesIngested,
    chunkCount: s.chunkCount,
    errors: Array.isArray(s.errors) ? (s.errors as { url: string; error: string }[]) : [],
    lastSyncedAt: s.lastSyncedAt,
  };
}
