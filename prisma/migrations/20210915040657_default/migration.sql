-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('EMAIL', 'GEN');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('FULL', 'OTP');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('NORMAL', 'STAFF', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT DEFAULT E'https://avatar.tobi.sh/sails.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT,
    "token" TEXT,
    "password" TEXT NOT NULL,
    "emailedCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userType" "UserType" NOT NULL DEFAULT E'NORMAL',
    "otpSecret" TEXT,
    "otpOnboard" TEXT,
    "otpBackup" TEXT[],
    "otpType" "OtpType",

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "type" "AuthType",

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
