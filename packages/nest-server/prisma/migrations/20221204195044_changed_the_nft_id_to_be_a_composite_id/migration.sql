/*
  Warnings:

  - You are about to drop the column `id` on the `Nft` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Nft_id_key";

-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "id",
ADD CONSTRAINT "Nft_pkey" PRIMARY KEY ("collectionId", "tokenId");
