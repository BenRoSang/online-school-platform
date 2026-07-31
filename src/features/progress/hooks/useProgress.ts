import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { updateLessonProgress } from '../services/progressApi'

export function useUpdateProgress(slug: string | undefined, lessonId: string | undefined) {
  const { accessToken, user } = useAuth()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (completed: boolean) => updateLessonProgress(lessonId!, completed, accessToken!),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['lesson-player', slug] })
      void client.invalidateQueries({ queryKey: ['enrolments', user?.id] })
    },
  })
}
