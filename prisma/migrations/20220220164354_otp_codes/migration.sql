/*
  Warnings:

  - The primary key for the `OtpCodes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OtpCodes` table. All the data in the column will be lost.
  - Added the required column `code` to the `OtpCodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OtpCodes" DROP CONSTRAINT "OtpCodes_pkey",
DROP COLUMN "id",
ADD COLUMN     "code" TEXT NOT NULL,
ADD CONSTRAINT "OtpCodes_pkey" PRIMARY KEY ("code");
