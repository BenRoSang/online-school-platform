# Online School Platform

A portfolio project for an online learning platform where teachers create
courses and students enrol, watch lessons, and track their progress.

This repository currently contains **Section 1 — Project Setup**: the React
application shell, public placeholder pages, routing, styling, and development
configuration. Supabase-backed features will be added incrementally in later
sections.

## Tech stack

- React and TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form and Zod
- Supabase JavaScript client
- ESLint

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Local setup

1. Clone the repository and enter the project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file from the example:

   ```bash
   cp .env.example .env
   ```

4. Add your Supabase project values to `.env` when Supabase integration is
   introduced:

   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite, normally
   [http://localhost:5173](http://localhost:5173).

The application can run for Section 1 with empty Supabase variables. Never put
the Supabase service-role key in this frontend project.

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Current routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/login` | Login placeholder |
| `/register` | Registration placeholder |
| Any unknown route | Not Found |

## Project structure

```text
src/
├── components/     # Reusable UI grouped by purpose
├── features/       # Feature-specific UI and business logic
├── hooks/          # Shared React hooks
├── layouts/        # Route layouts
├── lib/            # Third-party client configuration
├── pages/          # Route-level page components
├── routes/         # Application route definitions
├── schemas/        # Zod validation schemas
├── services/       # API and data access functions
├── types/          # Shared TypeScript types
└── utils/          # Reusable utility functions

supabase/
└── migrations/     # Database migrations added in Section 2
```

## Environment and security

- `.env` and environment variants are ignored by Git.
- `.env.example` contains variable names only and is safe to commit.
- Only the public Supabase anonymous key belongs in the frontend.
- The Supabase service-role key must never be exposed to Vite or committed.

## Development roadmap

Development follows the numbered sections in the project master prompt. Each
section is implemented and verified separately before work starts on the next
one. The next planned section is the Supabase database schema and Row Level
Security policies.
