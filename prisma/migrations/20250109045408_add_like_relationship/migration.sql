/*
  Warnings:

  - You are about to drop the column `favoriteCount` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "favoriteCount",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "applyCount" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "_DriverToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DriverToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DriverToUser_B_index" ON "_DriverToUser"("B");

-- AddForeignKey
ALTER TABLE "_DriverToUser" ADD CONSTRAINT "_DriverToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToUser" ADD CONSTRAINT "_DriverToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
