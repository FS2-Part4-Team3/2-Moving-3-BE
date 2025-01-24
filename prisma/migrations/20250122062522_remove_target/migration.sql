/*
  Warnings:

  - You are about to drop the column `targetDriverId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `targetUserId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_targetDriverId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_targetUserId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "targetDriverId",
DROP COLUMN "targetUserId",
ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
