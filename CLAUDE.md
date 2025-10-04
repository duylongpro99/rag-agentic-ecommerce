# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce conversational AI system using RAG (Retrieval-Augmented Generation) with LangGraph agents for semantic product search. The system combines vector similarity search with structured filtering to help users find products through natural language queries.

**Tech Stack:**
- Backend: FastAPI + LangGraph
- Database: PostgreSQL with pgvector extension
- AI Models: Google Gemini (Flash for chat, embedding-001 for vectors)
- Database Management: Prisma (TypeScript)

## Development Commands

### Starting the Application

**Full stack startup:**
```bash
./start.sh
```
This script starts PostgreSQL, runs embeddings, and starts the FastAPI backend.

**Individual components:**
```bash
# Start PostgreSQL with pgvector
docker-compose up -d

# Generate embeddings for products
cd embedding
python ingest.py

# Start FastAPI backend (port 8010)
python -m uvicorn agentic.api.main:app --reload

# View API docs
# Navigate to http://localhost:8010/docs
```

### Database Management

```bash
cd database

# Generate Prisma client (required after schema changes)
npm run generate

# Create migration (without applying)
npm run migrate:create

# Create and apply migrations
npm run migrate

# Seed database with sample products
npm run seed

# Reset database (drops all data)
npm run reset

# Open Prisma Studio GUI
npm run studio
```

### Python Environment

```bash
# Install dependencies
pip install -r requirements.txt

# Or using uv (faster)
uv sync
```

### Environment Setup

Copy `.env.example` to `.env` and configure:
- `GOOGLE_API_KEY`: Required for Gemini models
- `DATABASE_URL`: PostgreSQL connection string
- `EMBEDDING_MODEL`: Set to `gemini` (supports `voyage` and `jina` alternatives)

## Architecture

### Core Components

**Orchestrator Agent** (`agentic/agents/orchestrator.py`)
- LangGraph-based state machine that routes queries
- Analyzes user intent to determine search strategy (semantic/structured/both)
- Coordinates between tools and generates final response
- Uses `AgentState` TypedDict to maintain conversation state

**Semantic Search Tool** (`agentic/tools/semantic_search.py`)
- Embeds user queries using Gemini embedding-001
- Performs vector similarity search using pgvector's `<=>` distance operator
- Returns top-k products with similarity scores
- Uses SQLAlchemy with raw SQL for vector operations

**Structured Filter Tool** (`agentic/tools/structured_filter.py`)
- Extracts structured parameters (brand, category, price range) from queries
- Performs traditional SQL filtering on the products table
- Falls back to semantic search if filter parsing fails

**Database Models** (`agentic/database/models.py`)
- SQLAlchemy ORM models for Product, ProductEmbedding, User, Conversation, Message
- Matches Prisma schema definitions

### Data Flow

1. User query → FastAPI endpoint (`/chat`)
2. Orchestrator analyzes query intent using LLM
3. Routes to semantic search (vector DB) or structured filter (SQL) or both
4. Tool returns product results
5. Orchestrator generates conversational response
6. Response sent to user with conversation tracking

### Embedding Pipeline

**Ingest Process** (`embedding/ingest.py`):
1. Fetches all products from PostgreSQL
2. Creates unified text documents: "Product: [name]. Brand: [brand]. Category: [category]. Description: [description]. Ideal for: [usage]."
3. Generates 4096-dimensional embeddings via Gemini
4. Stores in `product_embeddings` table with pgvector
5. Skips products with existing embeddings

**Factory Pattern** (`agentic/factory/`, `embedding/factory/`):
- `EmbeddingModel` and `LLMModel` classes support multiple providers
- Configured via environment variables
- Current implementation: Gemini (can be swapped for Voyage, Jina, etc.)

### Database Schema

**Products:** id, name, brand, category, description, usage, price, imageUrl
**ProductEmbeddings:** productId, embedding (vector 4096), documentText
**ProductEmbeddingStatus:** Tracks embedding sync status (new/updated/embedded)
**Users/Conversations/Messages:** Support multi-user chat persistence

Prisma generates TypeScript client, but Python code uses SQLAlchemy for backend operations.

## Key Implementation Details

- **Vector Search:** Uses pgvector extension with cosine distance (`<=>` operator)
- **LangGraph Workflow:** StateGraph with nodes for analyze_query, semantic_search, structured_filter, generate_response
- **System Prompt:** Defined in `agentic/system_message.py` as ProductFinder persona
- **Analysis Tool:** `agentic/utils/analyze.py` refines LLM responses for routing decisions
- **Conversation History:** Stored in PostgreSQL but not yet integrated into agent memory (see commented code in `agentic/api/main.py:100-118`)

## Common Development Tasks

**Adding new products:**
1. Insert into `products` table via Prisma or direct SQL
2. Run `python embedding/ingest.py` to generate embeddings

**Testing semantic search:**
- Use `/chat` endpoint with natural language queries
- Check `agentic/tools/semantic_search.py:20` for embedding generation
- Verify vector similarity in pgvector using `ORDER BY embedding <=> query_vector`

**Modifying agent behavior:**
- Update system prompt in `agentic/system_message.py`
- Adjust routing logic in `agentic/agents/orchestrator.py:_analyze_query`
- Change tool selection in `_route_query` method

**Database schema changes:**
1. Edit `database/schema.prisma`
2. Run `npm run migrate:create` in database/
3. Review migration SQL, then `npm run migrate`
4. Update SQLAlchemy models in `agentic/database/models.py` to match

## Access Points

- Chat API: http://localhost:8010
- API Docs: http://localhost:8010/docs
- Database GUI: `npm run studio` (in database/)
- PostgreSQL: localhost:5432
