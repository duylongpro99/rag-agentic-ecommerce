# Embedding Service

Service for generating and storing product embeddings using Google Gemini.

## Setup

1. **Install dependencies:**
```bash
cd embedding
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Add your GOOGLE_API_KEY
```

## Usage

**Generate embeddings for all products:**
```bash
python ingest.py
```

## What it does

1. Connects to PostgreSQL database
2. Fetches all products from `products` table
3. Creates unified text documents for each product
4. Generates embeddings using Gemini embedding-001 model
5. Stores embeddings in `product_embeddings` table
6. Skips products that already have embeddings

## Requirements

- PostgreSQL database running with products data
- Google API key for Gemini
- Python 3.8+