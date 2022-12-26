/*
  Warnings:

  - Added the required column `arweaveAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arweaveEncryptedPrivateKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "arweaveAddress" TEXT NOT NULL,
ADD COLUMN     "arweaveEncryptedPrivateKey" TEXT NOT NULL;
