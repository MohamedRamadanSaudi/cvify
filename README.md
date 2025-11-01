# Cvify - Self-Hosted Setup

A self-hosted CV generation and management platform powered by AI.

Built with NestJS, Prisma, PostgreSQL, and powered by Groq AI. Uses Bun as the package manager for blazing-fast performance.

## Prerequisites

- Docker Desktop (includes Docker Compose)
- That's it! No need to install Node.js, Bun, PostgreSQL, or any other dependencies.

## Technology Stack

- **Runtime**: Bun (package manager and runtime)
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Groq API
- **PDF Generation**: PDFMake

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cvify
```

### 2. Pre-flight Check (Recommended)

Run the preflight check script to verify your environment:

**PowerShell (Windows):**

```powershell
.\preflight-check.ps1
```

**Bash (Linux/Mac):**

```bash
# Coming soon - for now, manually check Docker and .env
```

This will verify:

- Docker is installed and running
- All required files exist
- Ports are available
- Environment is configured

### 3. Configure Environment Variables

Copy the example environment file and add your Groq API key:

**PowerShell (Windows):**

```powershell
Copy-Item .env.example .env
```

**Bash (Linux/Mac):**

```bash
cp .env.example .env
```

Edit `.env` and replace `your_groq_api_key_here` with your actual Groq API key:

```bash
GROQ_API_KEY=gsk_your_actual_api_key_here
```

Get your Groq API key from: https://console.groq.com

### 4. Run the Application

Start everything with a single command:

```bash
docker compose up -d
```

This will:

- Pull and start PostgreSQL database
- Build the application Docker image (with Bun runtime)
- Generate Prisma Client
- Run database migrations
- Start the application server

**First-time build**: The initial build may take 2-3 minutes as Docker downloads base images and installs dependencies.

### 5. Access the Application

The application will be available at:

- **Frontend**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## Management Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Application only
docker-compose logs -f app

# Database only
docker-compose logs -f postgres
```

### Stop the Application

```bash
docker-compose down
```

### Stop and Remove All Data (including database)

```bash
docker-compose down -v
```

### Restart the Application

```bash
docker-compose restart
```

### Rebuild After Code Changes

```bash
docker-compose up -d --build
```

### Run Prisma Commands

**Note**: We use `bunx` instead of `npx` since the app uses Bun as the runtime.

```bash
# Generate Prisma Client
docker compose exec app bunx prisma generate

# Run migrations
docker compose exec app bunx prisma migrate deploy

# Create a new migration
docker compose exec app bunx prisma migrate dev --name your_migration_name

# Open Prisma Studio (Database GUI)
docker compose exec app bunx prisma studio
```

### Access Database Directly

```bash
docker compose exec postgres psql -U cvify -d cvify_db
```

### Install Dependencies Locally (Optional)

If you want to run the app locally without Docker or get IDE autocompletion:

**Install Bun** (if not already installed):

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

**Then install project dependencies:**

```bash
bun install
bunx prisma generate
```

**Run locally:**

```bash
# Development mode with hot reload
bun run start:dev

# Production mode
bun run build
bun run start:prod
```

## Environment Variables

| Variable       | Description                  | Default        |
| -------------- | ---------------------------- | -------------- |
| `GROQ_API_KEY` | Your Groq API key (Required) | -              |
| `PORT`         | Application port             | 3000           |
| `DB_USER`      | Database username            | cvify          |
| `DB_PASSWORD`  | Database password            | cvify_password |
| `DB_NAME`      | Database name                | cvify_db       |
| `DB_PORT`      | Database port                | 5432           |

## Data Persistence

The following directories are persisted across container restarts:

- `uploads/` - User uploaded files
- `generated/` - Generated CV files
- `public/` - Static assets
- Database data (stored in Docker volume `postgres_data`)

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use, change it in `.env`:

```bash
PORT=3001
DB_PORT=5433
```

### Database Connection Issues

Wait a few seconds for the database to fully initialize, then restart the app:

```bash
docker-compose restart app
```

### View Application Logs

```bash
docker-compose logs -f app
```

### Reset Everything

To start fresh (⚠️ this will delete all data):

```bash
docker-compose down -v
docker-compose up -d
```

## Production Considerations

For production deployment:

1. **Change default passwords** in `.env`
2. **Use strong database credentials**
3. **Set up SSL/TLS** with a reverse proxy (nginx/traefik)
4. **Configure backups** for the database volume
5. **Use environment-specific configurations**
6. **Set up monitoring and logging**

## License

[Your License]

## Support

For issues and questions, please open an issue on GitHub.
