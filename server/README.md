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
- teacher-owned course creation, editing, status management, and draft deletion.
- ownership-protected section and lesson CRUD with ordering and YouTube validation.
- published-course enrolment and a student-owned course list.
- public preview and enrolment-protected lesson playback data.
- student-owned lesson completion and calculated course progress.
- role-scoped student and teacher dashboard analytics.

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

## Teacher course endpoints

All routes below require a valid teacher access token:

| Method and path | Purpose |
| --- | --- |
| `GET /api/teacher/courses` | List the authenticated teacher's courses |
| `POST /api/teacher/courses` | Create a course |
| `GET /api/teacher/courses/:id` | Load an owned course |
| `PUT /api/teacher/courses/:id` | Edit details or publication status |
| `DELETE /api/teacher/courses/:id` | Delete an owned draft course |

Ownership is included in every read and write query. Published and archived
courses cannot be deleted; they can first be changed back to draft if removal
is intended.

## Curriculum endpoints

Curriculum routes are nested below
`/api/teacher/courses/:courseId/curriculum`. Teachers can list the curriculum,
create/edit/delete sections and lessons, and submit ordered ID lists for simple
up/down reordering. Every operation verifies course ownership. Lesson video
input accepts an 11-character YouTube ID, a `youtube.com/watch` URL, a Shorts
URL, or a `youtu.be` URL and stores only the normalized video ID.

## Student enrolment endpoints

`GET /api/enrolments` and `POST /api/enrolments` require a student access
token. The authenticated user ID always comes from that token and cannot be
selected in the request body. Enrolment is limited to published courses, and
the database unique constraint plus an atomic insert prevents duplicates.

## Lesson player endpoint

`GET /api/learning/courses/:slug/lessons/:lessonId` accepts optional access-token
authentication. Preview lessons are public; all other lessons require a student
enrolment in the published course. The selected lesson's YouTube ID is returned
only after authorization. Locked sidebar items never expose video IDs, and
previous/next navigation includes only lessons the current visitor can access.

## Progress endpoint

`PUT /api/progress/lessons/:lessonId` accepts `{ "completed": true | false }`
from authenticated students. The student identity comes from the access token,
and the lesson must belong to one of that student's enrolled courses. Completion
uses an upsert so it remains after refresh. Course percentages are calculated
from completed lesson records and the current curriculum size. The browser
stores the last-opened lesson ID locally per student and course for resume links.

## Dashboard endpoints

`GET /api/dashboard/student` returns enrolled-course, in-progress-course, and
completed-lesson totals derived only from the authenticated student's records.
`GET /api/dashboard/teacher` returns owned course status totals, a unique count
of students enrolled across those courses, and the five most recently updated
owned courses. Role middleware prevents either role from opening the other's
dashboard endpoint.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

A running PostgreSQL database is required for applying migrations, running the
seed, and starting the complete API. The unit tests do not require a database.
