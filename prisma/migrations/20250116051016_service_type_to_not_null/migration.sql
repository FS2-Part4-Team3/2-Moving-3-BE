/*
  Warnings:

  - Made the column `serviceType` on table `MoveInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MoveInfo" ALTER COLUMN "serviceType" SET NOT NULL;
