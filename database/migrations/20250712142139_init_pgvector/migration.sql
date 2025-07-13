-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(100),
    "category" VARCHAR(100),
    "description" TEXT,
    "usage" TEXT,
    "price" DECIMAL(10,2),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_embeddings" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "embedding" TEXT NOT NULL,
    "document_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_embeddings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_embeddings" ADD CONSTRAINT "product_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex (after pgvector is enabled)
-- CREATE INDEX "product_embeddings_embedding_idx" ON "product_embeddings" USING ivfflat (embedding::vector(768)) WITH (lists = 100);
