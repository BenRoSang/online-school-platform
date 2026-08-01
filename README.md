# Online School Platform

A portfolio project for an online teaching platform where teachers create
courses and students enrol, watch lessons, complete assignments, and track
their progress.

This repository currently contains **Section 10 — Dashboards**. Students and
teachers receive role-specific, ownership-scoped learning and course summaries.

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

Development continues one section at a time. The next section will focus on UI
polish, accessibility, reusable feedback components, testing, and documentation.
