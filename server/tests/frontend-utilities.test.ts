import { beforeEach, describe, expect, it, vi } from 'vitest'
import { slugifyTitle } from '../../src/features/courses/schemas/courseSchema.ts'
import { getRecentLesson, getRecentLessonRecord, saveRecentLesson } from '../../src/features/progress/utils/recentLesson.ts'

const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  })
})

describe('frontend utilities', () => {
  it('generates normalized course slugs', () => {
    expect(slugifyTitle('  Café & Portrait Lighting!  ')).toBe('cafe-portrait-lighting')
  })

  it('stores recent lessons separately for each student and course', () => {
    saveRecentLesson('student-1', 'course-1', 'lesson-2')
    expect(getRecentLesson('student-1', 'course-1')).toBe('lesson-2')
    expect(getRecentLesson('student-2', 'course-1')).toBeNull()
    expect(getRecentLessonRecord('student-1', 'course-1')?.openedAt).toBeTruthy()
  })
})
