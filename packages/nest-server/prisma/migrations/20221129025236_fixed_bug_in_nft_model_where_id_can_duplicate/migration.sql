/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_nftId_fkey";

-- DropIndex
DROP INDEX "Nft_tokenId_key";

-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nft_id_key" ON "Nft"("id");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
