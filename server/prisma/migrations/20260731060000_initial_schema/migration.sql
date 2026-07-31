-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED', 'RETURNED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "teacher_id" UUID NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT NOT NULL,
    "youtube_video_id" VARCHAR(11) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrolments" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "enrolled_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrolments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ(3),

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "instructions" TEXT NOT NULL,
    "due_at" TIMESTAMPTZ(3),
    "max_points" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "content" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "grade" DECIMAL(5,2),
    "feedback" TEXT,
    "submitted_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "graded_at" TIMESTAMPTZ(3),
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_files" (
    "id" UUID NOT NULL,
    "original_file_name" VARCHAR(255) NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "file_url" TEXT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_by_id" UUID NOT NULL,
    "lesson_id" UUID,
    "assignment_id" UUID,
    "submission_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pdf_files_pkey" PRIMARY KEY ("id")
);

-- AddCheckConstraint
ALTER TABLE "users"
ADD CONSTRAINT "users_email_lowercase_check" CHECK ("email" = lower("email"));

-- AddCheckConstraint
ALTER TABLE "courses"
ADD CONSTRAINT "courses_title_length_check"
CHECK (char_length(trim("title")) BETWEEN 3 AND 160);

-- AddCheckConstraint
ALTER TABLE "courses"
ADD CONSTRAINT "courses_slug_format_check"
CHECK ("slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- AddCheckConstraint
ALTER TABLE "sections"
ADD CONSTRAINT "sections_position_nonnegative_check" CHECK ("position" >= 0);

-- AddCheckConstraint
ALTER TABLE "lessons"
ADD CONSTRAINT "lessons_position_nonnegative_check" CHECK ("position" >= 0);

-- AddCheckConstraint
ALTER TABLE "lessons"
ADD CONSTRAINT "lessons_youtube_video_id_check"
CHECK ("youtube_video_id" ~ '^[A-Za-z0-9_-]{11}$');

-- AddCheckConstraint
ALTER TABLE "lesson_progress"
ADD CONSTRAINT "lesson_progress_completed_at_check"
CHECK (
    ("completed" = true AND "completed_at" IS NOT NULL)
    OR ("completed" = false AND "completed_at" IS NULL)
);

-- AddCheckConstraint
ALTER TABLE "assignments"
ADD CONSTRAINT "assignments_max_points_positive_check" CHECK ("max_points" > 0);

-- AddCheckConstraint
ALTER TABLE "submissions"
ADD CONSTRAINT "submissions_grade_nonnegative_check"
CHECK ("grade" IS NULL OR "grade" >= 0);

-- AddCheckConstraint
ALTER TABLE "submissions"
ADD CONSTRAINT "submissions_graded_state_check"
CHECK (
    "status" <> 'GRADED'
    OR ("grade" IS NOT NULL AND "graded_at" IS NOT NULL)
);

-- AddCheckConstraint
ALTER TABLE "pdf_files"
ADD CONSTRAINT "pdf_files_pdf_only_check"
CHECK ("mime_type" = 'application/pdf');

-- AddCheckConstraint
ALTER TABLE "pdf_files"
ADD CONSTRAINT "pdf_files_size_positive_check" CHECK ("file_size" > 0);

-- AddCheckConstraint
ALTER TABLE "pdf_files"
ADD CONSTRAINT "pdf_files_single_parent_check"
CHECK (num_nonnulls("lesson_id", "assignment_id", "submission_id") = 1);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_teacher_id_idx" ON "courses"("teacher_id");

-- CreateIndex
CREATE INDEX "courses_status_updated_at_idx" ON "courses"("status", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "sections_course_id_position_key" ON "sections"("course_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_section_id_position_key" ON "lessons"("section_id", "position");

-- CreateIndex
CREATE INDEX "enrolments_course_id_idx" ON "enrolments"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrolments_student_id_course_id_key" ON "enrolments"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "lesson_progress_lesson_id_idx" ON "lesson_progress"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_student_id_lesson_id_key" ON "lesson_progress"("student_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "assignments_lesson_id_idx" ON "assignments"("lesson_id");

-- CreateIndex
CREATE INDEX "assignments_created_by_id_idx" ON "assignments"("created_by_id");

-- CreateIndex
CREATE INDEX "assignments_due_at_idx" ON "assignments"("due_at");

-- CreateIndex
CREATE INDEX "submissions_student_id_status_idx" ON "submissions"("student_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_assignment_id_student_id_key" ON "submissions"("assignment_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "pdf_files_storage_key_key" ON "pdf_files"("storage_key");

-- CreateIndex
CREATE INDEX "pdf_files_uploaded_by_id_idx" ON "pdf_files"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "pdf_files_lesson_id_idx" ON "pdf_files"("lesson_id");

-- CreateIndex
CREATE INDEX "pdf_files_assignment_id_idx" ON "pdf_files"("assignment_id");

-- CreateIndex
CREATE INDEX "pdf_files_submission_id_idx" ON "pdf_files"("submission_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
