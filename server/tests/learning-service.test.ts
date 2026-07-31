import { describe, expect, it, vi } from 'vitest'
import { Role } from '../src/generated/prisma/client.js'
import { LearningRepository } from '../src/modules/learning/learning.repository.js'
import { LearningService } from '../src/modules/learning/learning.service.js'

const previewId = '50000000-0000-4000-8000-000000000001'
const protectedId = '50000000-0000-4000-8000-000000000002'
const course = {
  id: '30000000-0000-4000-8000-000000000001',
  title: 'Photography',
  slug: 'photography',
  sections: [{
    id: '40000000-0000-4000-8000-000000000001', title: 'Start', position: 0,
    lessons: [
      { id: previewId, title: 'Preview', description: 'Preview description', youtubeVideoId: 'dQw4w9WgXcQ', position: 0, isPreview: true },
      { id: protectedId, title: 'Protected', description: 'Protected description', youtubeVideoId: 'aqz-KE-bpKQ', position: 1, isPreview: false },
    ],
  }],
}

describe('lesson access', () => {
  it('allows public preview lessons without exposing other video IDs', async () => {
    const repository = { findPublishedCourse: vi.fn().mockResolvedValue(course) } as unknown as LearningRepository
    const result = await new LearningService(repository).getLesson('photography', previewId)
    expect(result.lesson.youtubeVideoId).toBe('dQw4w9WgXcQ')
    expect(result.course.sections[0]?.lessons[1]).not.toHaveProperty('youtubeVideoId')
    expect(result.nextLessonId).toBeNull()
  })

  it('blocks a protected lesson without enrolment', async () => {
    const repository = { findPublishedCourse: vi.fn().mockResolvedValue(course) } as unknown as LearningRepository
    await expect(new LearningService(repository).getLesson('photography', protectedId)).rejects.toMatchObject({ statusCode: 403, code: 'ENROLMENT_REQUIRED' })
  })

  it('allows an enrolled student and provides navigation', async () => {
    const repository = {
      findPublishedCourse: vi.fn().mockResolvedValue(course),
      findEnrolment: vi.fn().mockResolvedValue({ id: '60000000-0000-4000-8000-000000000001' }),
    } as unknown as LearningRepository
    const result = await new LearningService(repository).getLesson('photography', protectedId, { userId: '20000000-0000-4000-8000-000000000001', role: Role.STUDENT })
    expect(result.lesson.id).toBe(protectedId)
    expect(result.previousLessonId).toBe(previewId)
  })
})
