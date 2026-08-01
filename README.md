# Online School Platform

A portfolio project for an online teaching platform where teachers create
courses and students enrol, watch lessons, complete assignments, and track
their progress.

This repository contains the completed MVP through **Section 11 — UI Polish
and Testing**. It includes responsive student and teacher workflows, accessible
feedback components, protected REST APIs, and automated frontend/backend tests.

## Architecture

```text
React + TypeScript frontend
            |
            | REST API
            v
Express + TypeScript backend
            |
            ├── PostgreSQL through Prisma ORM
            ├── PDF storage provider
            ├── Email service
            └── YouTube video provider
```

The browser never connects directly to PostgreSQL. Authentication,
authorization, validation, and database access belong to the Express API.

## Technology stack

### Frontend

- React and TypeScript
- Vite and Tailwind CSS
- React Router and TanStack Query
- React Hook Form and Zod

### Backend

- Node.js, Express 5, and TypeScript
- PostgreSQL and Prisma ORM
- Zod environment and request validation
- JWT access/refresh tokens and bcrypt
- Multer and external/local PDF storage (implemented in a later section)
- Vitest and Supertest

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer
- PostgreSQL 16 or newer

## Local setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   npm --prefix server install
   ```

3. Create the frontend environment file:

   ```bash
   cp .env.example .env
   ```

4. Create the backend environment file:

   ```bash
   cp server/.env.example server/.env
   ```

5. Create the PostgreSQL database and update `server/.env` with its connection
   string.

6. Apply the database migration and load development data:

   ```bash
   npm --prefix server run prisma:migrate:dev -- --name initial-schema
   npm --prefix server run prisma:seed
   ```

7. Start the backend in one terminal:

   ```bash
   npm run dev:server
   ```

8. Start the frontend in another terminal:

   ```bash
   npm run dev
   ```

The frontend normally runs at `http://localhost:5173`, and the API normally
runs at `http://localhost:5000`. Check the API at
`http://localhost:5000/api/health`.

## Environment and security

- Frontend variables use the `VITE_` prefix and are public to the browser.
- Backend secrets belong only in `server/.env`.
- `.env` files, generated Prisma Client files, build output, uploads, and
  dependencies are ignored by Git.
- Never commit database credentials, JWT secrets, password hashes from real
  users, or storage-provider secrets.
- PDF binaries are stored outside PostgreSQL; the database stores metadata and
  relationships only.

## Commands

### Frontend

```bash
npm run dev
npm run lint
npm run build
npm run test
```

### Backend

```bash
npm run dev:server
npm run lint:server
npm run build:server
npm run test:server
npm --prefix server run typecheck
npm --prefix server run prisma:validate
npm --prefix server run prisma:migrate:dev
npm --prefix server run prisma:migrate:deploy
npm --prefix server run prisma:seed
```

See [server/README.md](server/README.md) for the API structure, database models,
migration workflow, and seed credentials.

## Testing

`npm test` runs the complete Vitest suite. It covers backend request schemas,
authorization and business rules, dashboard/progress calculations, frontend
utilities, and server-rendered checks for the critical course and lesson forms.
The form tests verify required controls and disabled submission states without
adding a browser-only test runtime.

```bash
npm run lint
npm test
npm run build
npm run lint:server
npm run build:server
```

## Current routes

| Application | Route | Purpose |
| --- | --- | --- |
| Frontend | `/` | Home page |
| Frontend | `/courses` | Search published courses |
| Frontend | `/courses/:slug` | Published course details and curriculum |
| Frontend | `/login` | Log in |
| Frontend | `/register` | Create a student or teacher account |
| Frontend | Any unknown route | Not Found page |
| Backend | `GET /api/health` | API health check |
| Backend | `POST /api/auth/register` | Register a student or teacher |
| Backend | `POST /api/auth/login` | Log in and create a session |
| Backend | `POST /api/auth/refresh` | Rotate the refresh token |
| Backend | `POST /api/auth/logout` | Revoke the refresh token |
| Backend | `GET /api/auth/me` | Load the authenticated profile |
| Backend | `GET /api/courses` | List/search published courses |
| Backend | `GET /api/courses/:slug` | Load a published course and curriculum |
| Backend | `GET /api/teacher/courses` | List the authenticated teacher's courses |
| Backend | `POST /api/teacher/courses` | Create a teacher-owned course |
| Backend | `GET /api/teacher/courses/:id` | Load an owned course for editing |
| Backend | `PUT /api/teacher/courses/:id` | Update an owned course and its status |
| Backend | `DELETE /api/teacher/courses/:id` | Delete an owned draft course |
| Backend | `/api/teacher/courses/:id/curriculum` | Manage owned sections and lessons |
| Backend | `GET /api/enrolments` | List the authenticated student's courses |
| Backend | `POST /api/enrolments` | Enrol the authenticated student |
| Backend | `GET /api/learning/courses/:slug/lessons/:lessonId` | Open an authorized lesson |
| Backend | `PUT /api/progress/lessons/:lessonId` | Toggle the student's lesson completion |
| Backend | `GET /api/dashboard/student` | Student learning summary |
| Backend | `GET /api/dashboard/teacher` | Teacher course and enrolment summary |
| Frontend | `/student` | Student dashboard and enrolment summary |
| Frontend | `/student/courses` | Student's enrolled courses |
| Frontend | `/courses/:slug/learn/:lessonId` | Responsive lesson player |
| Frontend | `/teacher` | Teacher dashboard and course summary |
| Frontend | `/teacher/courses` | Teacher's course management list |
| Frontend | `/teacher/courses/new` | Create a course |
| Frontend | `/teacher/courses/:id/edit` | Edit an owned course |
| Frontend | `/teacher/courses/:id/curriculum` | Edit ordered sections and lessons |
| Frontend | `/profile` | Authenticated profile |

## Authentication model

- Passwords are hashed with bcrypt and are never returned by the API.
- Access tokens are short-lived and kept only in React memory.
- Refresh tokens are rotated in HTTP-only cookies.
- Only SHA-256 refresh-token hashes are saved in PostgreSQL.
- Registration permits `STUDENT` and `TEACHER`; it never permits `ADMIN`.
- Frontend and backend role guards are separate security layers.

## Development roadmap

The portfolio MVP sections are complete. Payments, live classes, chat,
certificates, and advanced analytics remain intentionally outside this version.

## Screenshots

Add final deployment screenshots here before publishing the portfolio:

- `[Screenshot placeholder — public course catalogue]`
- `[Screenshot placeholder — responsive lesson player]`
- `[Screenshot placeholder — student dashboard]`
- `[Screenshot placeholder — teacher curriculum editor]`

## Database setup

The original project outline mentioned Supabase, but the backend was explicitly
changed to Express, Prisma, JWT authentication, and standard PostgreSQL. There
is therefore no Supabase project, anon key, Storage bucket, or Row Level
Security setup in this implementation. Equivalent authorization is enforced by
Express middleware and ownership-filtered Prisma queries.

For local PostgreSQL:

1. Create an empty `online_school` database and a dedicated database user.
2. Copy `server/.env.example` to `server/.env`.
3. Set `DATABASE_URL` to the PostgreSQL connection string.
4. Generate strong, different values for both JWT secrets.
5. Apply the committed migrations:

   ```bash
   npm --prefix server run prisma:migrate:deploy
   ```

6. Optionally load the development accounts and sample course:

   ```bash
   npm --prefix server run prisma:seed
   ```

## Deployment

The React SPA can be deployed to Vercel. The long-running Express API and
PostgreSQL database should be deployed separately, for example on Render with
Render Postgres, or with another managed PostgreSQL provider.

### 1. Deploy the API

Create a Render Web Service using `server` as the root directory:

```text
Build command: npm ci && npm run build
Pre-deploy command: npm run prisma:migrate:deploy
Start command: npm start
Health check: /api/health
```

Set these server environment variables:

```text
NODE_ENV=production
DATABASE_URL=<managed PostgreSQL connection string>
JWT_ACCESS_SECRET=<random value of at least 32 characters>
JWT_REFRESH_SECRET=<different random value of at least 32 characters>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN_DAYS=7
CLIENT_URL=https://your-frontend.vercel.app
FILE_STORAGE_PROVIDER=local
MAX_PDF_SIZE_MB=10
LOCAL_UPLOAD_DIRECTORY=uploads
```

Production refresh cookies use `Secure`, `HttpOnly`, and `SameSite=None` so the
Vercel frontend can restore sessions from a separately hosted HTTPS API. CORS
accepts only the exact `CLIENT_URL`; do not include a trailing slash.

### 2. Deploy the frontend to Vercel

Import the repository in Vercel and use:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

Set:

```text
VITE_API_URL=https://your-api.example.com/api
```

The committed `vercel.json` sends client-side routes such as `/courses/...` to
`index.html`. After the first Vercel deployment, update the API's `CLIENT_URL`
to the final Vercel production domain and redeploy the API.

### 3. Production verification

1. Open `/api/health` on the deployed API.
2. Register a student and verify refresh survives a browser reload.
3. Log in as a teacher, create and publish a course, section, and lesson.
4. Enrol as the student, play the lesson, and mark it complete.
5. Open a protected lesson in a private window and confirm access is denied.
