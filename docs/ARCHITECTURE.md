# Architecture

## Project Structure

```
cvify/
├── src/                    # Backend source code
│   ├── app.module.ts      # Main application module
│   ├── main.ts            # Application entry point
│   ├── profiles/          # Profile management module
│   ├── cvs/               # CV generation module
│   ├── groq/              # AI service module
│   ├── prisma/            # Database service
│   └── middleware/        # HTTP logger
├── prisma/                # Database schema and migrations
├── frontend/              # Frontend source code (React)
│   ├── src/               # React components and logic
│   ├── public/            # Static assets
│   └── index.html         # Entry HTML
├── uploads/cvs/          # Generated PDF files
└── docs/                  # Documentation
```

## Backend Architecture

### Modules

1. **App Module** - Main application module that imports all other modules
2. **Profiles Module** - Manages user profile data
3. **CVs Module** - Handles CV generation and storage
4. **Groq Module** - Connects to AI service
5. **Prisma Module** - Database connection

### Module Details

#### Profiles Module

- **Controller**: REST API endpoints for CRUD operations
- **Service**: Business logic for profile management
- **DTOs**: Data validation objects

#### CVs Module

- **Controller**: CV generation and retrieval endpoints
- **Service**: CV generation logic
- **PDF Generator**: Creates PDF files
- **DTOs**: Generation request validation

#### Groq Module

- **Service**: Communicates with Groq AI API
- **Prompt**: AI prompt template

## Database Schema

### Profiles Table

```
- id (Primary Key)
- profileName (Unique)
- email
- fullName
- title
- phone
- location
- summary
- skills (Array)
- links (JSON)
- education (JSON)
- experiences (JSON)
- projects (JSON)
- activities (JSON)
- volunteering (JSON)
- certificates (JSON)
- timestamps
```

### CVs Table

```
- id (Primary Key)
- profileId (Foreign Key → Profiles)
- jobDescription (Text)
- pdfPath (String)
- cvData (JSON)
- timestamps
```

## Frontend Architecture

### Single Page Application (SPA)

**Tech Stack:**

- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Routing**: React Router
- **State/Data Fetching**: TanStack Query (React Query)

**Structure:**

- `src/components/` - Reusable UI components
- `src/pages/` - Page components (views)
- `src/lib/` - Utilities and API client
- `src/App.tsx` - Main application component and routing

**Views (Routes):**

1. Dashboard (`/`) - List of profiles
2. Create Profile (`/profiles/new`)
3. Profile Detail (`/profiles/:id`) - View and edit profile
4. Generate CV (`/generate`)
5. History (`/history`)

**State Management:**

- **Server State**: Managed by TanStack Query (caching, invalidation)
- **Local State**: React `useState` and `useReducer`
- **Form State**: Controlled components

## Deployment Architecture

```
Docker Compose
    ├── PostgreSQL Container (Port 5432)
    ├── Backend Container (Port 3000)
    │   └── NestJS API
    └── Frontend Container (Port 5173/80)
        └── React App (Vite)
```

## Security Notes

- No authentication system (single user app)
- CORS enabled for development
- Database credentials in environment variables
- API key stored in `.env` file
