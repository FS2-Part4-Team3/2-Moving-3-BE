-- CreateTable
CREATE TABLE "AIReviewSummary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "summaryReview" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "AIReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIReviewSummary_driverId_key" ON "AIReviewSummary"("driverId");

-- CreateIndex
CREATE INDEX "AIReviewSummary_createdAt_idx" ON "AIReviewSummary"("createdAt");

-- AddForeignKey
ALTER TABLE "AIReviewSummary" ADD CONSTRAINT "AIReviewSummary_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
