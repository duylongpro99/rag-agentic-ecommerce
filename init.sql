-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100),
    description TEXT,
    usage TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_embeddings table for vector storage
CREATE TABLE IF NOT EXISTS product_embeddings (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    embedding vector(768),
    document_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS product_embeddings_embedding_idx 
ON product_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Insert sample products
INSERT INTO products (name, brand, category, description, usage, price, image_url) VALUES
('Running Shoes Pro', 'Nike', 'Footwear', 'High-performance running shoes with advanced cushioning', 'Running, jogging, fitness training', 129.99, 'https://example.com/nike-running-shoes.jpg'),
('Wireless Headphones', 'Sony', 'Electronics', 'Noise-canceling wireless headphones with 30-hour battery', 'Music, calls, travel', 299.99, 'https://example.com/sony-headphones.jpg'),
('Ergonomic Office Chair', 'Herman Miller', 'Furniture', 'Premium ergonomic chair with lumbar support', 'Office work, home office, long sitting sessions', 899.99, 'https://example.com/herman-miller-chair.jpg'),
('Smartphone X1', 'Apple', 'Electronics', 'Latest smartphone with advanced camera and AI features', 'Communication, photography, productivity', 999.99, 'https://example.com/iphone-x1.jpg'),
('Yoga Mat Premium', 'Lululemon', 'Sports', 'Non-slip yoga mat with superior grip and cushioning', 'Yoga, pilates, meditation, stretching', 78.99, 'https://example.com/lululemon-yoga-mat.jpg');