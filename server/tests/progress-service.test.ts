import { describe, expect, it, vi } from 'vitest'
import { ProgressRepository } from '../src/modules/progress/progress.repository.js'
import { ProgressService } from '../src/modules/progress/progress.service.js'

const studentId = '20000000-0000-4000-8000-000000000001'
const lessonId = '50000000-0000-4000-8000-000000000001'

describe('lesson progress ownership', () => {
  it('blocks progress updates without the student enrolment', async () => {
    const repository = {
      findEnrolledLesson: vi.fn().mockResolvedValue(null),
    } as unknown as ProgressRepository
    await expect(new ProgressService(repository).update(studentId, lessonId, true)).rejects.toMatchObject({
      statusCode: 403,
      code: 'ENROLMENT_REQUIRED',
    })
  })

  it('saves completion under the authenticated student', async () => {
    const save = vi.fn().mockResolvedValue({ lessonId, completed: true })
    const repository = {
      findEnrolledLesson: vi.fn().mockResolvedValue({ id: lessonId }),
      save,
    } as unknown as ProgressRepository
    await new ProgressService(repository).update(studentId, lessonId, true)
    expect(save).toHaveBeenCalledWith(studentId, lessonId, true)
  })
})
