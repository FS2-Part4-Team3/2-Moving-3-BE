/*
  Warnings:

  - You are about to drop the column `serviceType` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "serviceType",
ADD COLUMN     "serviceTypes" "ServiceType"[];
