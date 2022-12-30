/*
  Warnings:

  - You are about to drop the column `arweaveAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `arweaveEncryptedPrivateKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "arweaveAddress",
DROP COLUMN "arweaveEncryptedPrivateKey";
