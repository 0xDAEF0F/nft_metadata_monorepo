/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Attribute` table. All the data in the column will be lost.
  - Made the column `traitType` on table `Attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nftId` on table `Attribute` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_nftId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "collectionId",
ALTER COLUMN "traitType" SET NOT NULL,
ALTER COLUMN "nftId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
