-- CreateTable
CREATE TABLE "loggedInUsers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "loginId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "loggedInUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loggedInUsers_loginId_key" ON "loggedInUsers"("loginId");

-- CreateIndex
CREATE INDEX "loggedInUsers_createdAt_idx" ON "loggedInUsers"("createdAt");
