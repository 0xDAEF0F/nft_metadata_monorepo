/*
  Warnings:

  - You are about to drop the column `displayType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `chain` on the `Collection` table. All the data in the column will be lost.
  - The primary key for the `Nft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Nft` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_nftId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "displayType";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "chain";

-- AlterTable
ALTER TABLE "Nft" DROP CONSTRAINT "Nft_pkey",
DROP COLUMN "id";

-- DropEnum
DROP TYPE "Chain";

-- DropEnum
DROP TYPE "DisplayType";

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("tokenId") ON DELETE SET NULL ON UPDATE CASCADE;
