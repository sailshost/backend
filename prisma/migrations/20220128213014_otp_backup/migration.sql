/*
  Warnings:

  - The primary key for the `OtpCodes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OtpCodes" DROP CONSTRAINT "OtpCodes_pkey",
ADD CONSTRAINT "OtpCodes_pkey" PRIMARY KEY ("userId");
