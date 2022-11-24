/*
  Warnings:

  - You are about to drop the column `studioId` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_studioId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "studioId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
