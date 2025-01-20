-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SMALL', 'HOME', 'OFFICE');

-- CreateEnum
CREATE TYPE "Area" AS ENUM ('SEOUL', 'GYEONGGI', 'INCHEON', 'GAGNWON', 'CHUNGBUK', 'CHUNGNAM', 'SEJONG', 'DAEJEON', 'JEONBUK', 'JEONNAM', 'GWANGJU', 'GYEONGBUK', 'GYEONGNAM', 'DAEGU', 'ULSAN', 'BUSAN', 'JEJU');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'EXPIRED', 'APPLY', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('PENDING', 'OPEN', 'EXPIRED', 'CONFIRMED', 'CANCELED', 'COMPLETE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MOVE_INFO_EXPIRED', 'NEW_REQUEST', 'NEW_ESTIMATION', 'REQUEST_REJECTED', 'ESTIMATION_CONFIRMED', 'NEW_QUESTION', 'D_7', 'D_DAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "image" TEXT,
    "password" TEXT,
    "salt" TEXT,
    "refreshToken" TEXT,
    "serviceType" "ServiceType"[],
    "areas" "Area"[],
    "provider" TEXT,
    "providerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "image" TEXT,
    "password" TEXT,
    "salt" TEXT,
    "refreshToken" TEXT,
    "phoneNumber" TEXT,
    "introduce" TEXT,
    "description" TEXT,
    "serviceType" "ServiceType"[],
    "availableAreas" "Area"[],
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applyCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "provider" TEXT,
    "providerId" TEXT,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoveInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "progress" "Progress" NOT NULL,
    "confirmedEstimationId" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "MoveInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moveInfoId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "driverId" TEXT NOT NULL,
    "notificationId" TEXT,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER,
    "comment" TEXT NOT NULL,
    "moveInfoId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "confirmedForId" TEXT,

    CONSTRAINT "Estimation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "estimationId" TEXT NOT NULL,
    "userId" TEXT,
    "driverId" TEXT,
    "notificationId" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "driverId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "estimationId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "targetUserId" TEXT,
    "targetDriverId" TEXT,
    "moveInfoId" TEXT,
    "estimationId" TEXT,
    "userId" TEXT,
    "driverId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DriverToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DriverToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MoveInfo_confirmedEstimationId_key" ON "MoveInfo"("confirmedEstimationId");

-- CreateIndex
CREATE INDEX "MoveInfo_createdAt_idx" ON "MoveInfo"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Request_notificationId_key" ON "Request"("notificationId");

-- CreateIndex
CREATE INDEX "Request_createdAt_idx" ON "Request"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Estimation_confirmedForId_key" ON "Estimation"("confirmedForId");

-- CreateIndex
CREATE INDEX "Estimation_createdAt_idx" ON "Estimation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Question_notificationId_key" ON "Question"("notificationId");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "_DriverToUser_B_index" ON "_DriverToUser"("B");

-- AddForeignKey
ALTER TABLE "MoveInfo" ADD CONSTRAINT "MoveInfo_confirmedEstimationId_fkey" FOREIGN KEY ("confirmedEstimationId") REFERENCES "Estimation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveInfo" ADD CONSTRAINT "MoveInfo_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_moveInfoId_fkey" FOREIGN KEY ("moveInfoId") REFERENCES "MoveInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimation" ADD CONSTRAINT "Estimation_moveInfoId_fkey" FOREIGN KEY ("moveInfoId") REFERENCES "MoveInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimation" ADD CONSTRAINT "Estimation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "Estimation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "Estimation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_moveInfoId_fkey" FOREIGN KEY ("moveInfoId") REFERENCES "MoveInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "Estimation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToUser" ADD CONSTRAINT "_DriverToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToUser" ADD CONSTRAINT "_DriverToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
