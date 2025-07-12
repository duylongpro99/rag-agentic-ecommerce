# E-commerce RAG Agentic Application

A conversational AI-powered product search system using RAG (Retrieval-Augmented Generation) with LangGraph agents.

## 🏗️ Architecture

- **Backend**: FastAPI + LangGraph + PostgreSQL + pgvector
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **AI**: Google Gemini Flash + Embedding-001
- **Database**: PostgreSQL with pgvector for semantic search

## 🚀 Quick Start

1. **Clone and setup environment:**
```bash
cp .env.example .env
# Add your GOOGLE_API_KEY to .env
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Install Node.js dependencies:**
```bash
cd frontend/web
npm install
```

4. **Start the complete application:**
```bash
./start.sh
```

This will:
- Start PostgreSQL with pgvector
- Run product embeddings ingestion
- Start FastAPI backend (port 8000)
- Start Next.js frontend (port 3000)

## 🔗 Access Points

- **Chat Interface**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 💬 Example Queries

Try these in the chat interface:
- "I need comfortable running shoes"
- "Show me Apple products under $500"
- "What wireless headphones do you recommend?"
- "Find Nike shoes for trail running"

## 🛠️ Manual Setup

If you prefer to run components separately:

1. **Start Database:**
```bash
docker-compose up -d
```

2. **Run Embeddings:**
```bash
python ingest.py
```

3. **Start Backend:**
```bash
python -m uvicorn src.api.main:app --reload
```

4. **Start Frontend:**
```bash
cd frontend/web
npm run dev
```

## 📁 Project Structure

```
├── src/
│   ├── agents/          # LangGraph orchestrator
│   ├── tools/           # Semantic search & filtering
│   ├── database/        # Models & connection
│   └── api/            # FastAPI endpoints
├── frontend/web/        # Next.js chat interface
├── docker-compose.yml   # PostgreSQL + pgvector
├── ingest.py           # Embedding pipeline
└── requirements.txt    # Python dependencies
```