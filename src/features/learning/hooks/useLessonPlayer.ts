import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { getLesson } from '../services/learningApi'

export function useLessonPlayer(slug: string | undefined, lessonId: string | undefined) {
  const { accessToken, isLoading } = useAuth()
  return useQuery({
    queryKey: ['lesson-player', slug, lessonId, accessToken ? 'authenticated' : 'public'],
    queryFn: () => getLesson(slug!, lessonId!, accessToken),
    enabled: Boolean(slug && lessonId && !isLoading),
  })
}
