/*
  Warnings:

  - You are about to drop the `aiReviewSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "aiReviewSummary" DROP CONSTRAINT "aiReviewSummary_driverId_fkey";

-- DropTable
DROP TABLE "aiReviewSummary";

-- CreateTable
CREATE TABLE "ReviewSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "summary" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "ReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewSummary_driverId_key" ON "ReviewSummary"("driverId");

-- CreateIndex
CREATE INDEX "ReviewSummary_createdAt_idx" ON "ReviewSummary"("createdAt");

-- AddForeignKey
ALTER TABLE "ReviewSummary" ADD CONSTRAINT "ReviewSummary_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
