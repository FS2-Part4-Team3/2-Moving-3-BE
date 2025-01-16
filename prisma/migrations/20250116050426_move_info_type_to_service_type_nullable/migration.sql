/*
  Warnings:

  - You are about to drop the column `type` on the `MoveInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoveInfo" DROP COLUMN "type",
ADD COLUMN     "serviceType" "ServiceType";
