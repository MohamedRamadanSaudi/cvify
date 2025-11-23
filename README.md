# Cvify

> Self-hosted CV generation and management platform powered by AI

Built with React, NestJS, Bun, Prisma, PostgreSQL, and Groq AI.

---

## 🚀 Quick Start (3 Steps)

### Prerequisites

- [Docker Desktop](https://www.docker.com/get-started) installed (includes Docker Compose)
- That's it! Everything else runs in Docker.

### Step 1: Clone & Setup

```bash
git clone https://github.com/MohamedRamadanSaudi/cvify.git
cd cvify
```

**Copy the .env file:**

Linux/Mac:

```bash
cp .env.example .env
```

Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Windows (Command Prompt):

```cmd
copy .env.example .env
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
- ✅ Build React frontend with Nginx
- ✅ Build NestJS backend with Bun
- ✅ Run database migrations
- ✅ Start all services

_First build takes ~3 minutes_

### Step 3: Open

Go to: **http://localhost:3000**

That's it! 🎉

**What's running:**

- 🌐 Frontend (React) - http://localhost:3000
- 🔧 Backend API - http://localhost:3000/api
- 🗄️ PostgreSQL - Internal (port 5432)

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

**Linux/Mac/Windows (all shells):**

```bash
docker compose exec postgres psql -U cvify -d cvify_db
```

### Run Prisma Commands

```bash
# Generate Prisma Client
docker compose exec backend bunx prisma generate

# Create migration
docker compose exec backend bunx prisma migrate dev --name migration_name

# Open Prisma Studio
docker compose exec backend bunx prisma studio
```

### Local Development (Optional)

If you want to run without Docker:

**Install Bun:**

Linux/Mac:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Or visit: https://bun.sh/docs/installation

**Backend:**

```bash
# Install dependencies
bun install
bunx prisma generate

# Start database only
docker compose up postgres -d

# Run development server
bun run start:dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
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

- **Frontend**: React + TypeScript + Vite + Nginx
- **Backend**: NestJS + Bun
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Groq API (LLaMA models)
- **PDF**: PDFMake
- **Deployment**: Docker + Docker Compose
