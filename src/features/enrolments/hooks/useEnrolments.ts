import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { enrolmentApi } from '../services/enrolmentApi'

export function useEnrolments() {
  const { accessToken, user } = useAuth()
  return useQuery({
    queryKey: ['enrolments', user?.id],
    queryFn: () => enrolmentApi.list(accessToken!),
    enabled: Boolean(accessToken && user?.role === 'STUDENT'),
  })
}

export function useCreateEnrolment() {
  const { accessToken, user } = useAuth()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => enrolmentApi.create(courseId, accessToken!),
    onSuccess: () => client.invalidateQueries({ queryKey: ['enrolments', user?.id] }),
  })
}
