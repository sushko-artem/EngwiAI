-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE';
