const prefix = 'online-school:last-lesson'

export function saveRecentLesson(userId: string, courseId: string, lessonId: string) {
  localStorage.setItem(`${prefix}:${userId}:${courseId}`, JSON.stringify({ lessonId, openedAt: new Date().toISOString() }))
}

export function getRecentLesson(userId: string, courseId: string) {
  return getRecentLessonRecord(userId, courseId)?.lessonId ?? null
}

export function getRecentLessonRecord(userId: string, courseId: string) {
  const value = localStorage.getItem(`${prefix}:${userId}:${courseId}`)
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as { lessonId?: unknown; openedAt?: unknown }
    if (typeof parsed.lessonId === 'string' && typeof parsed.openedAt === 'string') {
      return { lessonId: parsed.lessonId, openedAt: parsed.openedAt }
    }
  } catch {
    return { lessonId: value, openedAt: new Date(0).toISOString() }
  }
  return null
}
