#!/bin/bash

echo "🚀 Starting E-commerce RAG Agent Application..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please copy .env.example to .env and add your GOOGLE_API_KEY"
    exit 1
fi

# Start PostgreSQL with Docker
echo "📦 Starting PostgreSQL with pgvector..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run embeddings ingestion
echo "🔄 Running product embeddings ingestion..."
cd embedding
python ingest.py
cd ..

# Start FastAPI backend in background
echo "🖥️  Starting FastAPI backend..."
cd /Users/onedayin20902/personal/ecommerce-agentic-rag
python -m uvicorn agentic.api.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start Next.js frontend
echo "🌐 Starting Next.js frontend..."
cd web
npm run dev &
FRONTEND_PID=$!

echo "✅ Application started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"

# Wait for user to stop
echo "Press Ctrl+C to stop all services..."
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
docker-compose down