# Database Service

TypeScript service for database management using Prisma.

## Setup

```bash
cd database
npm install
```

## Commands

```bash
# Generate Prisma client
npm run generate

# Create migration file only (without applying)
npm run migrate:create

# Create and run migrations
npm run migrate

# Seed database with sample data
npm run seed

# Reset database (drops all data)
npm run reset

# Open Prisma Studio
npm run studio
```

## Usage

1. Start PostgreSQL: `docker-compose up -d`
2. Install dependencies: `npm install`
3. Run migrations: `npm run migrate`
4. Seed data: `npm run seed`

## Models

- **Product**: E-commerce products with details
- **ProductEmbedding**: Vector embeddings for semantic search
- **User**: User authentication and profile information
- **Conversation**: Chat sessions between users and the agentic system
- **Message**: Individual messages within conversations