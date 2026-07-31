import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { curriculumApi } from '../services/curriculumApi'

export function useCurriculum(courseId: string | undefined) {
  const { accessToken } = useAuth()
  return useQuery({ queryKey: ['curriculum', courseId], queryFn: () => curriculumApi.get(courseId!, accessToken!), enabled: Boolean(courseId && accessToken) })
}

export function useCurriculumAction(courseId: string) {
  const { accessToken } = useAuth()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (action: (token: string) => Promise<unknown>) => action(accessToken!),
    onSuccess: () => { void client.invalidateQueries({ queryKey: ['curriculum', courseId] }); void client.invalidateQueries({ queryKey: ['teacher-courses'] }); void client.invalidateQueries({ queryKey: ['courses'] }) },
  })
}
