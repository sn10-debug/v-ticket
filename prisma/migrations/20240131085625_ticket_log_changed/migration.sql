/*
  Warnings:

  - You are about to drop the column `outTime` on the `InOutTime` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InOutTime` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usertype` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventsId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceId` to the `InOutTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyingUserId` to the `InOutTime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ticket_types" AS ENUM ('Broken_ID', 'Payment_Issue', 'User_Not_Found', 'Custom');

-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Solo', 'Group');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('Login', 'Logout', 'Create', 'Update', 'Delete', 'Verify', 'Open', 'Close');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SuperAdmin';

-- DropForeignKey
ALTER TABLE "InOutTime" DROP CONSTRAINT "InOutTime_userId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "InOutTime" DROP COLUMN "outTime",
DROP COLUMN "userId",
ADD COLUMN     "attendanceId" TEXT NOT NULL,
ADD COLUMN     "verifyingUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
DROP COLUMN "usertype",
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "paidStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Student',
ADD COLUMN     "year" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Tickets" (
    "id" TEXT NOT NULL,
    "reg_no" TEXT NOT NULL,
    "eventsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ticket_types" NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "LogAction" NOT NULL,
    "message" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_eventsId_key" ON "Attendance"("userId", "eventsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_serial_id_key" ON "User"("serial_id");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InOutTime" ADD CONSTRAINT "InOutTime_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InOutTime" ADD CONSTRAINT "InOutTime_verifyingUserId_fkey" FOREIGN KEY ("verifyingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
