const prefix = 'online-school:last-lesson'

export function saveRecentLesson(userId: string, courseId: string, lessonId: string) {
  localStorage.setItem(`${prefix}:${userId}:${courseId}`, lessonId)
}

export function getRecentLesson(userId: string, courseId: string) {
  return localStorage.getItem(`${prefix}:${userId}:${courseId}`)
}
