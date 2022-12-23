-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Network" ADD VALUE 'POLYGON';
ALTER TYPE "Network" ADD VALUE 'ARBITRUM';
ALTER TYPE "Network" ADD VALUE 'OPTIMISM';
ALTER TYPE "Network" ADD VALUE 'GOERLI';
