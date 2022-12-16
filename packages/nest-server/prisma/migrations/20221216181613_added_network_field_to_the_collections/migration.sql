-- CreateEnum
CREATE TYPE "Network" AS ENUM ('MAINNET', 'LOCALHOST');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "networkId" "Network" NOT NULL DEFAULT 'MAINNET',
ALTER COLUMN "standard" SET DEFAULT 'ERC721';
