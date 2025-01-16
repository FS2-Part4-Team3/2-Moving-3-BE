/*
  Warnings:

  - You are about to drop the column `serviceTypes` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `serviceTypes` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "serviceTypes",
ADD COLUMN     "serviceType" "ServiceType"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "serviceTypes",
ADD COLUMN     "serviceType" "ServiceType"[];
