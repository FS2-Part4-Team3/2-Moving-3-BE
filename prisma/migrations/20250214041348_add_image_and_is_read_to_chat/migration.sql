-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "image" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
