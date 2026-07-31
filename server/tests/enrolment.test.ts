import { describe, expect, it, vi } from 'vitest'
import { createEnrolmentSchema } from '../src/modules/enrolments/enrolment.schema.js'
import { EnrolmentRepository } from '../src/modules/enrolments/enrolment.repository.js'
import { EnrolmentService } from '../src/modules/enrolments/enrolment.service.js'

const courseId = '30000000-0000-4000-8000-000000000001'
const studentId = '20000000-0000-4000-8000-000000000001'

describe('student enrolment', () => {
  it('accepts only a course ID and never a student ID', () => {
    const result = createEnrolmentSchema.parse({
      body: { courseId, studentId: 'another-user' },
      params: {},
      query: {},
    })
    expect(result.body).toEqual({ courseId })
  })

  it('rejects enrolment when a course is not published', async () => {
    const repository = {
      findPublishedCourse: vi.fn().mockResolvedValue(null),
    } as unknown as EnrolmentRepository
    await expect(new EnrolmentService(repository).enrol(studentId, courseId)).rejects.toMatchObject({
      statusCode: 404,
      code: 'COURSE_NOT_FOUND',
    })
  })

  it('rejects a duplicate enrolment', async () => {
    const repository = {
      findPublishedCourse: vi.fn().mockResolvedValue({ id: courseId }),
      create: vi.fn().mockResolvedValue({ count: 0 }),
    } as unknown as EnrolmentRepository
    await expect(new EnrolmentService(repository).enrol(studentId, courseId)).rejects.toMatchObject({
      statusCode: 409,
      code: 'ALREADY_ENROLLED',
    })
  })
})
