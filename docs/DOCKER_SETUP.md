# 🐳 Docker Setup for Cvify

Simple Docker setup for self-hosting Cvify with PostgreSQL.

## 📋 Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd cvify
```

### 2. Create your .env file

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your environment variables (like API keys)
```

### 3. Run everything with one command

```bash
docker-compose up -d
```

That's it! 🎉

The app will be available at: **http://localhost:3000**

## 📝 What This Does

- Builds your NestJS app with Bun
- Starts a PostgreSQL database
- Runs Prisma migrations automatically
- Serves your static files from `/public`
- Persists database data in a Docker volume
- Persists uploaded CVs in `./uploads`

## 🛠️ Useful Commands

### View logs

```bash
docker-compose logs -f
```

### Stop the app

```bash
docker-compose down
```

### Stop and remove everything (including database data)

```bash
docker-compose down -v
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

### Access the database directly

```bash
docker exec -it cvify-postgres psql -U cvify -d cvify_db
```

## 🔧 Configuration

Edit the `.env` file to configure:

- API keys (GROQ_API_KEY, etc.)
- Port (default: 3000)
- Any other environment variables your app needs

The database configuration is already set in `docker-compose.yml` but can be overridden in `.env` if needed.

## 📂 Volumes

- `postgres_data`: Database files (persistent)
- `./uploads`: Uploaded CV files (persistent, mapped to host)
- `./public`: Static files (mapped to host)

## 🐛 Troubleshooting

**Database connection errors?**

- Wait a few seconds for PostgreSQL to fully start
- Check logs: `docker-compose logs postgres`

**Port 3000 already in use?**

- Change the port in `docker-compose.yml` under `app.ports`
- Example: `"8080:3000"` to use port 8080

**Need to reset the database?**

```bash
docker-compose down -v
docker-compose up -d
```
