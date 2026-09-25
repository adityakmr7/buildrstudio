-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pageUrl" TEXT;

-- CreateTable
CREATE TABLE "UnansweredQuestion" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "chatSessionId" TEXT,
    "question" TEXT NOT NULL,
    "reply" TEXT,
    "reason" TEXT NOT NULL,
    "topScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnansweredQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UnansweredQuestion_apiKeyId_status_createdAt_idx" ON "UnansweredQuestion"("apiKeyId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ChatSession_apiKeyId_lastMessageAt_idx" ON "ChatSession"("apiKeyId", "lastMessageAt");

-- AddForeignKey
ALTER TABLE "UnansweredQuestion" ADD CONSTRAINT "UnansweredQuestion_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnansweredQuestion" ADD CONSTRAINT "UnansweredQuestion_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill conversation-log bookkeeping for conversations that already exist
-- (messages were already stored before this migration).
UPDATE "ChatSession" cs
SET "messageCount" = sub.c, "lastMessageAt" = sub.m
FROM (SELECT "chatSessionId", COUNT(*)::int AS c, MAX("createdAt") AS m FROM "Message" GROUP BY "chatSessionId") sub
WHERE sub."chatSessionId" = cs.id;
