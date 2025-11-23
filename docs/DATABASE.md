# Database Documentation

## Database System

**Type:** PostgreSQL 15  
**ORM:** Prisma

## Schema

### Profiles Table

Stores user profile information.

| Column       | Type      | Constraints                 | Description               |
| ------------ | --------- | --------------------------- | ------------------------- |
| id           | INT       | PRIMARY KEY, AUTO INCREMENT | Unique identifier         |
| profileName  | VARCHAR   | UNIQUE, NOT NULL            | Display name for profile  |
| email        | VARCHAR   | NOT NULL                    | Email address             |
| fullName     | VARCHAR   | NULLABLE                    | Full name                 |
| title        | VARCHAR   | NULLABLE                    | Job title                 |
| phone        | VARCHAR   | NULLABLE                    | Phone number              |
| location     | VARCHAR   | NULLABLE                    | Location/address          |
| summary      | TEXT      | NULLABLE                    | Professional summary      |
| skills       | TEXT[]    | DEFAULT []                  | Array of skills           |
| links        | JSONB     | DEFAULT []                  | Social/professional links |
| education    | JSONB     | DEFAULT []                  | Education history         |
| experiences  | JSONB     | DEFAULT []                  | Work experience           |
| projects     | JSONB     | DEFAULT []                  | Projects                  |
| activities   | JSONB     | DEFAULT []                  | Activities                |
| volunteering | JSONB     | DEFAULT []                  | Volunteering              |
| certificates | JSONB     | DEFAULT []                  | Certificates              |
| createdAt    | TIMESTAMP | DEFAULT NOW()               | Created timestamp         |
| updatedAt    | TIMESTAMP | AUTO UPDATE                 | Updated timestamp         |

### CVs Table

Stores generated CV records.

| Column         | Type      | Constraints                 | Description             |
| -------------- | --------- | --------------------------- | ----------------------- |
| id             | INT       | PRIMARY KEY, AUTO INCREMENT | Unique identifier       |
| profileId      | INT       | FOREIGN KEY, NOT NULL       | References Profiles(id) |
| jobDescription | TEXT      | NOT NULL                    | Job posting text        |
| pdfPath        | VARCHAR   | NOT NULL                    | Path to PDF file        |
| cvData         | JSONB     | NOT NULL                    | Structured CV data      |
| createdAt      | TIMESTAMP | DEFAULT NOW()               | Created timestamp       |
| updatedAt      | TIMESTAMP | AUTO UPDATE                 | Updated timestamp       |

## Relationships

```
Profiles (1) ----< (N) CVs
```

- One profile can have many CVs
- Deleting a profile cascades to delete all its CVs

## JSON Structures

### Links

```json
[
  {
    "label": "GitHub",
    "url": "https://github.com/username"
  }
]
```

### Education

```json
[
  {
    "institution": "University Name",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "startDate": "2015",
    "endDate": "2019",
    "description": "Relevant coursework..."
  }
]
```

### Experience

```json
[
  {
    "company": "Company Name",
    "position": "Software Engineer",
    "startDate": "2019-01",
    "endDate": "Present",
    "description": "Responsibilities and achievements...",
    "location": "City, State"
  }
]
```

### Projects

```json
[
  {
    "name": "Project Name",
    "description": "What the project does...",
    "technologies": "Tech stack used",
    "url": "https://project-url.com",
    "startDate": "2023",
    "endDate": "2024"
  }
]
```

### Activities

```json
[
  {
    "name": "Activity Name",
    "role": "Participant/Leader",
    "startDate": "2020",
    "endDate": "2023",
    "description": "What you did..."
  }
]
```

### Volunteering

```json
[
  {
    "organization": "Org Name",
    "role": "Volunteer Role",
    "startDate": "2020",
    "endDate": "2022",
    "description": "What you contributed..."
  }
]
```

### Certificates

```json
[
  {
    "name": "Certificate Name",
    "issuer": "What the certificate does...",
    "date": "Tech stack used",
    "url": "https://certificate-url.com",
    "summary": "What you contributed..."
  }
]
```

## Migrations

Located in `prisma/migrations/`

### Current Migrations

1. `20251019052442_add_cvs_table` - Initial schema
2. `20251021163914_make_profiles_table_and_delete_users` - Schema update

## Prisma Commands

```bash
# Generate Prisma Client
bunx prisma generate

# Create new migration
bunx prisma migrate dev --name migration_name

# Apply migrations (production)
bunx prisma migrate deploy

# Open Prisma Studio (GUI)
bunx prisma studio

# Reset database (⚠️ deletes all data)
bunx prisma migrate reset
```

## Database Access

### Via Docker

```bash
docker compose exec postgres psql -U cvify -d cvify_db
```

### Connection String

```
postgresql://cvify:cvify_password@localhost:5432/cvify_db
```

## Backup and Restore

### Backup

```bash
docker compose exec postgres pg_dump -U cvify cvify_db > backup.sql
```

### Restore

```bash
docker compose exec -T postgres psql -U cvify cvify_db < backup.sql
```
