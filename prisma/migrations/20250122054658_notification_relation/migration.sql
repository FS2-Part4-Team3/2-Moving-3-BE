/*
  Warnings:

  - You are about to drop the column `driverId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `Request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_notificationId_fkey";

-- DropIndex
DROP INDEX "Question_notificationId_key";

-- DropIndex
DROP INDEX "Request_notificationId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "driverId",
DROP COLUMN "userId",
ADD COLUMN     "questionId" TEXT,
ADD COLUMN     "requestId" TEXT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "notificationId";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "notificationId";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_targetDriverId_fkey" FOREIGN KEY ("targetDriverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
