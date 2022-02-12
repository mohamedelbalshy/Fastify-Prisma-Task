-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferences" TEXT[],
ADD COLUMN     "token" TEXT;
