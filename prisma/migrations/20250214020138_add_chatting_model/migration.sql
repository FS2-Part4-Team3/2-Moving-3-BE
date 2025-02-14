-- CreateEnum
CREATE TYPE "ChatDirection" AS ENUM ('USER_TO_DRIVER', 'DRIVER_TO_USER');

-- CreateTable
CREATE TABLE "Chatting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "direction" "ChatDirection" NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Chatting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Chatting_createdAt_idx" ON "Chatting"("createdAt");
