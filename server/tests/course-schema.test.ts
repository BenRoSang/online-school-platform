import { describe, expect, it } from 'vitest'
import {
  getPublicCourseSchema,
  listPublicCoursesSchema,
  createTeacherCourseSchema,
} from '../src/modules/courses/course.schema.js'

describe('public course request validation', () => {
  it('trims a catalogue search', () => {
    const result = listPublicCoursesSchema.parse({
      params: {},
      query: { search: '  photography  ' },
    })

    expect(result.query.search).toBe('photography')
  })

  it('uses an empty search by default', () => {
    const result = listPublicCoursesSchema.parse({ params: {}, query: {} })
    expect(result.query.search).toBe('')
  })

  it('rejects an empty course slug', () => {
    expect(() =>
      getPublicCourseSchema.parse({ params: { slug: '' }, query: {} }),
    ).toThrow()
  })
})

describe('teacher course validation', () => {
  const validCourse = {
    title: 'Practical Photography',
    slug: 'practical-photography',
    description: 'A complete introduction to practical photography skills.',
    thumbnailUrl: '',
    status: 'PUBLISHED',
  }

  it('accepts a valid published course and normalizes an empty thumbnail', () => {
    const result = createTeacherCourseSchema.parse({ body: validCourse, params: {}, query: {} })
    expect(result.body.thumbnailUrl).toBeNull()
    expect(result.body.status).toBe('PUBLISHED')
  })

  it('rejects a non-URL-safe slug', () => {
    expect(() => createTeacherCourseSchema.parse({
      body: { ...validCourse, slug: 'Practical Photography' },
      params: {},
      query: {},
    })).toThrow()
  })

  it('rejects a description that is too short to publish', () => {
    expect(() => createTeacherCourseSchema.parse({
      body: { ...validCourse, description: 'Too short' },
      params: {},
      query: {},
    })).toThrow()
  })
})
