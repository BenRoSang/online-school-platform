const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function updateLessonProgress(lessonId: string, completed: boolean, token: string) {
  const response = await fetch(`${apiUrl}/progress/lessons/${lessonId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ completed }),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(body.error?.message ?? 'Progress could not be updated')
  }
}
