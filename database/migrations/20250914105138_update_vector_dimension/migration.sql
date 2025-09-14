-- Change embedding column from TEXT to vector(4096)
ALTER TABLE "product_embeddings" ALTER COLUMN "embedding" TYPE vector(4096) USING embedding::vector(4096);
