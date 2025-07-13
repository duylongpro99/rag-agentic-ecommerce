-- Change embedding column from TEXT to vector(768)
ALTER TABLE "product_embeddings" ALTER COLUMN "embedding" TYPE vector(768) USING embedding::vector(768);

-- Create the vector index
CREATE INDEX "product_embeddings_embedding_idx" ON "product_embeddings" USING ivfflat (embedding) WITH (lists = 100);