/*
  Warnings:

  - The values [GAGNWON] on the enum `Area` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `AIReviewSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Area_new" AS ENUM ('SEOUL', 'GYEONGGI', 'INCHEON', 'GANGWON', 'CHUNGBUK', 'CHUNGNAM', 'SEJONG', 'DAEJEON', 'JEONBUK', 'JEONNAM', 'GWANGJU', 'GYEONGBUK', 'GYEONGNAM', 'DAEGU', 'ULSAN', 'BUSAN', 'JEJU');
ALTER TABLE "User" ALTER COLUMN "areas" TYPE "Area_new"[] USING ("areas"::text::"Area_new"[]);
ALTER TABLE "Driver" ALTER COLUMN "availableAreas" TYPE "Area_new"[] USING ("availableAreas"::text::"Area_new"[]);
ALTER TYPE "Area" RENAME TO "Area_old";
ALTER TYPE "Area_new" RENAME TO "Area";
DROP TYPE "Area_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AIReviewSummary" DROP CONSTRAINT "AIReviewSummary_driverId_fkey";

-- DropTable
DROP TABLE "AIReviewSummary";

-- CreateTable
CREATE TABLE "aiReviewSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "summaryReview" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "aiReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aiReviewSummary_driverId_key" ON "aiReviewSummary"("driverId");

-- CreateIndex
CREATE INDEX "aiReviewSummary_createdAt_idx" ON "aiReviewSummary"("createdAt");

-- AddForeignKey
ALTER TABLE "aiReviewSummary" ADD CONSTRAINT "aiReviewSummary_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
