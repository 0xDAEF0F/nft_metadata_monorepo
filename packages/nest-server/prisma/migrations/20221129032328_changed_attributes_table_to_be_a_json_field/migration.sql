/*
  Warnings:

  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_nftId_fkey";

-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "attributes" JSONB;

-- DropTable
DROP TABLE "Attribute";
