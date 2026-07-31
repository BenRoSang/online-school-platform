import { useQuery } from '@tanstack/react-query'
import { courseApi } from '../services/courseApi'

export function useCourses(search: string) {
  return useQuery({
    queryKey: ['courses', search],
    queryFn: () => courseApi.list(search),
  })
}

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseApi.getBySlug(slug!),
    enabled: Boolean(slug),
  })
}
