/*
  Warnings:

  - Made the column `conversation_id` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "conversation_id" SET NOT NULL;
