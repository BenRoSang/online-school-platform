import { describe, expect, it } from 'vitest'
import { extractYouTubeId, lessonSchema } from '../src/modules/curriculum/curriculum.schema.js'

const params = {
  courseId: '30000000-0000-4000-8000-000000000001',
  sectionId: '40000000-0000-4000-8000-000000000001',
}

describe('curriculum validation', () => {
  it('accepts a YouTube ID', () => {
    expect(extractYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts IDs from standard YouTube URLs', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=20')).toBe('dQw4w9WgXcQ')
  })

  it('rejects an invalid YouTube URL', () => {
    expect(() => lessonSchema.parse({
      params,
      query: {},
      body: { title: 'Introduction', description: 'A valid lesson description.', youtubeVideoId: 'https://example.com/video', isPreview: false },
    })).toThrow()
  })
})
