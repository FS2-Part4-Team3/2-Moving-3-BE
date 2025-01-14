-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
