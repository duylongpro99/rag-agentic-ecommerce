-- CreateEnum
CREATE TYPE "EmbeddingStatus" AS ENUM ('new', 'updated', 'embedded');

-- DropIndex
DROP INDEX "product_embeddings_embedding_idx";

-- CreateTable
CREATE TABLE "product_embedding_status" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "status" "EmbeddingStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_embedding_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_embedding_status_product_id_key" ON "product_embedding_status"("product_id");

-- AddForeignKey
ALTER TABLE "product_embedding_status" ADD CONSTRAINT "product_embedding_status_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
