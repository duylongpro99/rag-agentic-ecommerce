/*
  Warnings:

  - You are about to alter the column `embedding` on the `product_embeddings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8000)`.

*/
-- AlterTable
ALTER TABLE "product_embeddings" ALTER COLUMN "embedding" SET DATA TYPE vector(768) USING embedding::vector(768);