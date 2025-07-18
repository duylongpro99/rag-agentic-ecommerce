# Project Structure

## Root Level Organization
```
├── agentic/           # Python backend application
├── web/              # Next.js frontend application  
├── database/         # Database schema and migrations
├── embedding/        # Embedding generation service
├── idea/            # Project documentation and planning
├── tests/           # Test files
├── docker-compose.yml # Database containerization
├── start.sh         # Application startup script
└── .env             # Environment configuration
```

## Backend Structure (`agentic/`)
```
agentic/
├── agents/
│   └── orchestrator.py    # Main LangGraph agent workflow
├── api/
│   └── main.py           # FastAPI application and endpoints
├── database/
│   ├── connection.py     # Database connection setup
│   └── models.py         # SQLAlchemy models
├── tools/
│   ├── semantic_search.py    # Vector similarity search
│   └── structured_filter.py  # SQL-based filtering
├── system_message.py     # AI agent system prompts
└── requirements.txt      # Python dependencies
```

## Frontend Structure (`web/`)
```
web/src/
├── app/
│   ├── api/trpc/        # tRPC API routes
│   ├── views/           # Page-level view components
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── chat/            # Chat interface components
│   └── ui/              # Reusable UI components
├── trpc/
│   ├── routers/         # tRPC route definitions
│   ├── client.tsx       # Client-side tRPC setup
│   └── server.tsx       # Server-side tRPC setup
└── lib/
    └── utils.ts         # Utility functions
```

## Database Structure (`database/`)
```
database/
├── schema.prisma        # Prisma schema definition
├── migrations/          # Database migration files
├── seed.ts             # Database seeding script
└── package.json        # Node.js dependencies for DB tools
```

## Key Models
- **Product**: Core product information (name, brand, category, description, price)
- **ProductEmbedding**: Vector embeddings for semantic search
- **ProductEmbeddingStatus**: Tracks embedding generation status

## Naming Conventions
- **Python**: snake_case for variables, functions, and file names
- **TypeScript**: camelCase for variables/functions, PascalCase for components
- **Database**: snake_case for table and column names
- **API Routes**: kebab-case for URL paths

## Import Patterns
- Use relative imports within the same module
- Absolute imports from project root (e.g., `from agentic.tools.semantic_search import SemanticSearchTool`)
- Frontend uses path aliases configured in `tsconfig.json`

## Configuration Files
- `.env` - Environment variables (API keys, database URLs)
- `docker-compose.yml` - PostgreSQL service configuration
- `start.sh` - Orchestrates full application startup
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies and scripts