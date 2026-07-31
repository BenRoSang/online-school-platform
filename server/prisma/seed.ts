import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaPg } from '@prisma/adapter-pg'
import {
  CourseStatus,
  PrismaClient,
  Role,
  SubmissionStatus,
} from '../src/generated/prisma/client.ts'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const ids = {
  teacher: '10000000-0000-4000-8000-000000000001',
  student: '20000000-0000-4000-8000-000000000001',
  course: '30000000-0000-4000-8000-000000000001',
  draftCourse: '30000000-0000-4000-8000-000000000002',
  section: '40000000-0000-4000-8000-000000000001',
  secondSection: '40000000-0000-4000-8000-000000000002',
  previewLesson: '50000000-0000-4000-8000-000000000001',
  protectedLesson: '50000000-0000-4000-8000-000000000002',
  enrolment: '60000000-0000-4000-8000-000000000001',
  progress: '70000000-0000-4000-8000-000000000001',
  assignment: '80000000-0000-4000-8000-000000000001',
  submission: '90000000-0000-4000-8000-000000000001',
} as const

async function seed() {
  const [teacherPasswordHash, studentPasswordHash] = await Promise.all([
    bcrypt.hash('Teacher123!', 12),
    bcrypt.hash('Student123!', 12),
  ])

  await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {
      fullName: 'Avery Morgan',
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
    create: {
      id: ids.teacher,
      email: 'teacher@example.com',
      fullName: 'Avery Morgan',
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
  })

  await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {
      fullName: 'Jamie Chen',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
    },
    create: {
      id: ids.student,
      email: 'student@example.com',
      fullName: 'Jamie Chen',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
    },
  })

  await prisma.course.upsert({
    where: { slug: 'foundations-of-digital-photography' },
    update: {
      title: 'Foundations of Digital Photography',
      description: 'Learn exposure, composition, and practical camera techniques.',
      status: CourseStatus.PUBLISHED,
      teacherId: ids.teacher,
    },
    create: {
      id: ids.course,
      title: 'Foundations of Digital Photography',
      slug: 'foundations-of-digital-photography',
      description: 'Learn exposure, composition, and practical camera techniques.',
      status: CourseStatus.PUBLISHED,
      teacherId: ids.teacher,
    },
  })

  await prisma.course.upsert({
    where: { slug: 'portrait-lighting-workshop' },
    update: {
      title: 'Portrait Lighting Workshop',
      description: 'A draft course about natural and studio portrait lighting.',
      status: CourseStatus.DRAFT,
      teacherId: ids.teacher,
    },
    create: {
      id: ids.draftCourse,
      title: 'Portrait Lighting Workshop',
      slug: 'portrait-lighting-workshop',
      description: 'A draft course about natural and studio portrait lighting.',
      status: CourseStatus.DRAFT,
      teacherId: ids.teacher,
    },
  })

  await prisma.section.upsert({
    where: { id: ids.section },
    update: { title: 'Getting Started', position: 0 },
    create: {
      id: ids.section,
      courseId: ids.course,
      title: 'Getting Started',
      position: 0,
    },
  })

  await prisma.section.upsert({
    where: { id: ids.secondSection },
    update: { title: 'Camera Controls', position: 1 },
    create: {
      id: ids.secondSection,
      courseId: ids.course,
      title: 'Camera Controls',
      position: 1,
    },
  })

  await prisma.lesson.upsert({
    where: { id: ids.previewLesson },
    update: {
      title: 'Welcome to the Course',
      description: 'Meet your teacher and see what the course covers.',
      youtubeVideoId: 'dQw4w9WgXcQ',
      position: 0,
      isPreview: true,
    },
    create: {
      id: ids.previewLesson,
      sectionId: ids.section,
      title: 'Welcome to the Course',
      description: 'Meet your teacher and see what the course covers.',
      youtubeVideoId: 'dQw4w9WgXcQ',
      position: 0,
      isPreview: true,
    },
  })

  await prisma.lesson.upsert({
    where: { id: ids.protectedLesson },
    update: {
      title: 'Choosing Your Camera',
      description: 'Understand the camera features that matter most.',
      youtubeVideoId: 'aqz-KE-bpKQ',
      position: 1,
      isPreview: false,
    },
    create: {
      id: ids.protectedLesson,
      sectionId: ids.section,
      title: 'Choosing Your Camera',
      description: 'Understand the camera features that matter most.',
      youtubeVideoId: 'aqz-KE-bpKQ',
      position: 1,
      isPreview: false,
    },
  })

  await prisma.enrolment.upsert({
    where: {
      studentId_courseId: {
        studentId: ids.student,
        courseId: ids.course,
      },
    },
    update: {},
    create: {
      id: ids.enrolment,
      studentId: ids.student,
      courseId: ids.course,
    },
  })

  await prisma.lessonProgress.upsert({
    where: {
      studentId_lessonId: {
        studentId: ids.student,
        lessonId: ids.previewLesson,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      id: ids.progress,
      studentId: ids.student,
      lessonId: ids.previewLesson,
      completed: true,
      completedAt: new Date(),
    },
  })

  await prisma.assignment.upsert({
    where: { id: ids.assignment },
    update: {
      title: 'Composition Practice',
      instructions: 'Upload a short reflection about your strongest photograph.',
      maxPoints: 100,
    },
    create: {
      id: ids.assignment,
      lessonId: ids.protectedLesson,
      createdById: ids.teacher,
      title: 'Composition Practice',
      instructions: 'Upload a short reflection about your strongest photograph.',
      maxPoints: 100,
    },
  })

  await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: ids.assignment,
        studentId: ids.student,
      },
    },
    update: {
      content: 'I used leading lines to guide attention toward the subject.',
      status: SubmissionStatus.SUBMITTED,
      grade: null,
      gradedAt: null,
    },
    create: {
      id: ids.submission,
      assignmentId: ids.assignment,
      studentId: ids.student,
      content: 'I used leading lines to guide attention toward the subject.',
      status: SubmissionStatus.SUBMITTED,
    },
  })

  console.log('Development database seeded')
}

seed()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
