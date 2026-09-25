-- AlterTable
ALTER TABLE "DocumentChunk" ADD COLUMN     "sourceId" TEXT;

-- CreateTable
CREATE TABLE "KnowledgeSource" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'website',
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "pagesFound" INTEGER NOT NULL DEFAULT 0,
    "pagesIngested" INTEGER NOT NULL DEFAULT 0,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeSource_apiKeyId_idx" ON "KnowledgeSource"("apiKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeSource_apiKeyId_url_key" ON "KnowledgeSource"("apiKeyId", "url");

-- CreateIndex
CREATE INDEX "DocumentChunk_sourceId_idx" ON "DocumentChunk"("sourceId");

-- AddForeignKey
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KnowledgeSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeSource" ADD CONSTRAINT "KnowledgeSource_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
