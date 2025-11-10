# Cvify

> Self-hosted CV generation and management platform powered by AI

Built with NestJS, Bun, Prisma, PostgreSQL, and Groq AI.

---

## 🚀 Quick Start (3 Steps)

### Prerequisites

- [Docker Desktop](https://www.docker.com/get-started) installed
- That's it! Everything else runs in Docker.

### Step 1: Clone & Setup

```bash
git clone <your-repo-url>
cd cvify
cp .env.example .env
```

Edit `.env` and add your **Groq API key**:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

Get your free API key from: https://console.groq.com

### Step 2: Run

```bash
docker compose up -d
```

Docker will automatically:

- ✅ Start PostgreSQL database
- ✅ Build the app with Bun
- ✅ Run database migrations
- ✅ Start the server

_First build takes ~2 minutes_

### Step 3: Open

Go to: **http://localhost:3000**

That's it! 🎉

---

## 📋 Common Commands

```bash
# View logs
docker compose logs -f

# Stop everything
docker compose down

# Restart after code changes
docker compose up -d --build

# Reset everything (⚠️ deletes all data)
docker compose down -v && docker compose up -d
```

---

## 🛠️ Advanced Usage

### Access Database

```bash
docker compose exec postgres psql -U cvify -d cvify_db
```

### Run Prisma Commands

```bash
# Generate Prisma Client
docker compose exec app bunx prisma generate

# Create migration
docker compose exec app bunx prisma migrate dev --name migration_name

# Open Prisma Studio
docker compose exec app bunx prisma studio
```

### Local Development (Optional)

If you want to run without Docker:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash  # Mac/Linux
# Or visit: https://bun.sh/docs/installation

# Install dependencies
bun install
bunx prisma generate

# Run development server
bun run start:dev
```

---

## ⚙️ Configuration

### Environment Variables

| Variable       | Description           | Default           | Required |
| -------------- | --------------------- | ----------------- | -------- |
| `GROQ_API_KEY` | Your Groq API key     | -                 | ✅       |
| `PORT`         | Application port      | 3000              | ❌       |
| `DATABASE_URL` | PostgreSQL connection | (auto-configured) | ❌       |

### Data Storage

Persistent data locations:

- `uploads/` - Generated CV files
- `postgres_data/` - Database (Docker volume)

---

## 🐛 Troubleshooting

**Port already in use?**

```bash
# Edit docker-compose.yml and change:
ports:
  - "8080:3000"  # Use port 8080 instead
```

**Database connection failed?**

```bash
# Wait for DB to start, then restart:
docker compose restart app
```

**Something broken?**

```bash
# Nuclear option - reset everything:
docker compose down -v
docker compose up -d
```

---

## 📚 Tech Stack

- **Runtime**: Bun
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Groq API
- **PDF**: PDFMake
