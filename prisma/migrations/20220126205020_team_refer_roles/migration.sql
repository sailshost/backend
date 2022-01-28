/*
  Warnings:

  - Added the required column `role` to the `TeamReferral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamReferral" ADD COLUMN     "role" "PermissionType" NOT NULL;
