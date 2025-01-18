/*
  Warnings:

  - A unique constraint covering the columns `[estimationId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "estimationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Review_estimationId_key" ON "Review"("estimationId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "Estimation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
