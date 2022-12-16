/*
  Warnings:

  - You are about to drop the column `networkId` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "networkId",
ADD COLUMN     "network" "Network" NOT NULL DEFAULT 'MAINNET';
