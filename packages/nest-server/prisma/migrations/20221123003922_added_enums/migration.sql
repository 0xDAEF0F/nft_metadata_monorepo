/*
  Warnings:

  - You are about to drop the column `chainId` on the `Collection` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayType` to the `Attribute` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DisplayType" AS ENUM ('Date', 'Number', 'String');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('Mainnet', 'Goerli', 'Localhost', 'Arbitrum', 'Polygon', 'BSC', 'Optimism');

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "collectionId" INTEGER NOT NULL,
DROP COLUMN "displayType",
ADD COLUMN     "displayType" "DisplayType" NOT NULL;

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "chainId",
ADD COLUMN     "chain" "Chain" NOT NULL DEFAULT 'Mainnet';

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
