# AgroGarden - Greenhouse Management Application

## Overview

AgroGarden is a full-stack greenhouse and garden management application. It provides soil monitoring dashboards, plant tracking, task management, trending gardening news, and an AI chat assistant. The application follows a monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod schemas derived from Drizzle tables using drizzle-zod
- **Development**: tsx for TypeScript execution, Vite middleware for frontend serving

### Data Storage
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Tables**: users, plants, trends, tasks, messages
- **Migrations**: Drizzle Kit for schema migrations (`npm run db:push`)
- **Fallback**: MemStorage class provides in-memory storage when database unavailable

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── hooks/        # Custom React hooks for data fetching
│       ├── pages/        # Route page components
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema + Zod types
│   └── routes.ts     # API route definitions with type safety
└── migrations/       # Drizzle migration files
```

### Key Design Decisions
1. **Shared Types**: The `shared/` directory contains schema and route definitions used by both frontend and backend, ensuring type safety across the stack
2. **API Route Objects**: Routes are defined as objects in `shared/routes.ts` with path, method, input schema, and response schemas for full type inference
3. **Component Library**: Uses shadcn/ui (new-york style) with extensive Radix UI primitives for accessible, customizable components
4. **Theme System**: CSS variables define a fresh green garden theme with multiple color scales (primary, secondary, accent, etc.)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection string from `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store (available but sessions not currently implemented)

### Frontend Libraries
- **@tanstack/react-query**: Async state management and caching
- **framer-motion**: Animation library for transitions
- **react-hook-form + @hookform/resolvers**: Form handling with Zod validation
- **date-fns**: Date formatting utilities
- **lucide-react**: Icon library

### UI Components (shadcn/ui + Radix)
- Full suite of Radix UI primitives for dialogs, dropdowns, forms, navigation
- Embla Carousel for carousels
- Vaul for drawer component
- cmdk for command palette

### Build & Development
- **Vite**: Frontend bundling and dev server
- **esbuild**: Server-side bundling for production
- **tailwindcss + autoprefixer**: CSS processing