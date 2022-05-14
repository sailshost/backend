-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('NORMAL', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "UserPlan" "UserPlan" NOT NULL DEFAULT E'NORMAL';
