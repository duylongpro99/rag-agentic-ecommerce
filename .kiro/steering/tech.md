# Technology Stack

## Core Technologies
- **Backend**: FastAPI with Python
- **Frontend**: Next.js 15 with TypeScript and React 19
- **Nodejs Pakage Maneger**: Use pnpm
- **Database**: PostgreSQL with pgvector extension for vector operations
- **AI/ML**: Google Gemini Flash (LLM) + Embedding-001 (embeddings)
- **Agent Framework**: LangGraph for orchestrating AI workflows
- **Containerization**: Docker and Docker Compose

## Key Libraries & Frameworks

### Backend (Python)
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `langchain` + `langchain-google-genai` - LLM integration
- `langgraph` - Agent workflow orchestration
- `sqlalchemy` - Database ORM
- `psycopg2-binary` + `pgvector` - PostgreSQL with vector support
- `pydantic` - Data validation

### Frontend (TypeScript/React)
- `next` - React framework
- `@trpc/client` + `@trpc/server` - Type-safe API layer
- `@tanstack/react-query` - Data fetching and caching
- `tailwindcss` - CSS framework
- `@radix-ui` - UI components
- `zod` - Schema validation

### Database
- **Prisma** - Database schema management and migrations
- **pgvector** - Vector similarity search extension

## Common Commands

### Full Application Startup
```bash
./start.sh  # Starts entire stack (database, embeddings, backend, frontend)
```

### Individual Services
```bash
# Database
docker-compose up -d

# Embeddings ingestion
cd embedding && python ingest.py

# Backend API
python -m uvicorn agentic.api.main:app --reload

# Frontend
cd web && npm run dev
```

### Development
```bash
# Install Python dependencies
pip install -r agentic/requirements.txt

# Install Node.js dependencies
cd web && npm install

# Database migrations
cd database && npx prisma migrate dev
```

## Environment Setup
- Copy `.env.example` to `.env`
- Add `GOOGLE_API_KEY` for Gemini API access
- Configure `DATABASE_URL` for PostgreSQL connection

## API Endpoints
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs