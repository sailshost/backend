-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "snapshot" TEXT;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "logo" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "role" "PermissionType" NOT NULL,

    PRIMARY KEY ("userId","teamId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team.slug_unique" ON "Team"("slug");

-- AddForeignKey
ALTER TABLE "Membership" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
