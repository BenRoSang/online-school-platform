import { describe, expect, it } from 'vitest'
import {
  getPublicCourseSchema,
  listPublicCoursesSchema,
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
