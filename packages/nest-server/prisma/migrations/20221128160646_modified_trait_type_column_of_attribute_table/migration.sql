/*
  Warnings:

  - You are about to drop the column `traitType` on the `Attribute` table. All the data in the column will be lost.
  - Added the required column `trait_type` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "traitType",
ADD COLUMN     "trait_type" TEXT NOT NULL;
