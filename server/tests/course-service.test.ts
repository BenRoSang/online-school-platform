import { describe, expect, it, vi } from 'vitest'
import { CourseRepository } from '../src/modules/courses/course.repository.js'
import { CourseService } from '../src/modules/courses/course.service.js'

describe('teacher course ownership', () => {
  it('does not expose a course that is not owned by the teacher', async () => {
    const repository = {
      findTeacherCourseById: vi.fn().mockResolvedValue(null),
    } as unknown as CourseRepository
    const service = new CourseService(repository)

    await expect(
      service.getTeacherCourse(
        '30000000-0000-4000-8000-000000000001',
        '10000000-0000-4000-8000-000000000002',
      ),
    ).rejects.toMatchObject({ statusCode: 404, code: 'COURSE_NOT_FOUND' })
  })
})
