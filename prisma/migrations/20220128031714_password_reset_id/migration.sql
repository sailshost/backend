/*
  Warnings:

  - You are about to drop the column `token` on the `PasswordReset` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionType" ADD VALUE 'ADMIN';
ALTER TYPE "PermissionType" ADD VALUE 'EDITOR';

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "token";

-- CreateTable
CREATE TABLE "OtpCodes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OtpCodes" ADD CONSTRAINT "OtpCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
