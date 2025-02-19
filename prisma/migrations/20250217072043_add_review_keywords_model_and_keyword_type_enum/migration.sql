-- CreateEnum
CREATE TYPE "KeywordType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateTable
CREATE TABLE "ReviewKeywords" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "keyword" TEXT NOT NULL,
    "type" "KeywordType" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "ReviewKeywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewKeywords_driverId_idx" ON "ReviewKeywords"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewKeywords_driverId_keyword_key" ON "ReviewKeywords"("driverId", "keyword");

-- AddForeignKey
ALTER TABLE "ReviewKeywords" ADD CONSTRAINT "ReviewKeywords_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
