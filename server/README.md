# Online School API

Express and TypeScript backend for the Online School Platform.

## Current scope

The backend currently provides:

- a strict TypeScript Express application shell;
- security, CORS, cookie, JSON, 404, and error middleware;
- validated backend environment variables;
- a PostgreSQL connection through Prisma's `pg` driver adapter;
- the initial Prisma schema and SQL migration;
- repeatable development seed data;
- health-route and environment unit tests;
- registration and login with bcrypt password hashing;
- short-lived JWT access tokens;
- rotated HTTP-only refresh-token cookies and database revocation;
- current-user lookup and reusable authentication/role middleware;
- Zod-validated authentication requests.
- public published-course listing and title search;
- published course details with teacher, section, and lesson information.

Draft and archived courses are excluded from both public catalogue endpoints.

## Folder structure

```text
server/
├── src/
│   ├── config/          # Environment and database configuration
│   ├── middleware/      # Cross-cutting Express middleware
│   ├── modules/         # Feature modules added section by section
│   ├── shared/          # Shared errors, types, and utilities
│   ├── app.ts           # Express application composition
│   └── server.ts        # HTTP server and graceful shutdown
├── prisma/
│   ├── migrations/      # Versioned PostgreSQL migrations
│   ├── schema.prisma    # Database data model
│   └── seed.ts          # Development seed
└── tests/               # Backend tests
```

Each feature module will contain its controller, service, repository, routes,
Zod validation schema, and types when that feature is implemented.

## Database models

- Users and hashed credentials
- Refresh tokens
- Courses, sections, and lessons
- Enrolments and lesson progress
- Assignments and submissions
- PDF file metadata

Important database rules include unique course slugs, unique enrolments,
unique lesson progress, ordered curriculum positions, YouTube video ID checks,
completion timestamp consistency, and PDF-only metadata attached to exactly one
lesson, assignment, or submission.

## Environment

Copy `.env.example` to `.env`. Secrets in the example are placeholders and must
be replaced before running the API.

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port |
| `DATABASE_URL` | Direct PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Access-token signing secret |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Short access-token lifetime |
| `JWT_REFRESH_EXPIRES_IN_DAYS` | Refresh-token lifetime |
| `CLIENT_URL` | Allowed browser origin |
| `FILE_STORAGE_PROVIDER` | Local or external PDF storage |
| `MAX_PDF_SIZE_MB` | PDF upload limit |
| `LOCAL_UPLOAD_DIRECTORY` | Development upload location |

JWT secrets must each contain at least 32 characters. Production secrets should
be generated randomly and stored in the deployment platform's secret manager.

## Database workflow

Validate and generate the Prisma Client:

```bash
npm run prisma:validate
npm run prisma:generate
```

Create and apply a development migration after changing `schema.prisma`:

```bash
npm run prisma:migrate:dev -- --name describe-the-change
```

Apply committed migrations in production:

```bash
npm run prisma:migrate:deploy
```

Load local sample data explicitly:

```bash
npm run prisma:seed
```

The committed initial migration contains additional PostgreSQL check constraints
that Prisma cannot express directly. Review generated migrations before applying
them so these constraints are not accidentally removed.

## Development seed accounts

These credentials are for local development only:

| Role | Email | Password |
| --- | --- | --- |
| Teacher | `teacher@example.com` | `Teacher123!` |
| Student | `student@example.com` | `Student123!` |

The seed hashes both passwords with bcrypt and includes one published course
with curriculum plus one draft course for public-access verification.

## Public course endpoints

| Method and path | Purpose |
| --- | --- |
| `GET /api/courses` | List published courses |
| `GET /api/courses?search=photo` | Search published courses by title |
| `GET /api/courses/:slug` | Load published course details and curriculum |

These routes are intentionally public. Publication status is enforced in the
database queries, so a draft or archived course slug returns `404`.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

A running PostgreSQL database is required for applying migrations, running the
seed, and starting the complete API. The unit tests do not require a database.
