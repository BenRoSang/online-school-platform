import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/context/useAuth'
import { teacherCourseApi } from '../services/teacherCourseApi'
import type { CourseInput } from '../types/course'

export function useTeacherCourses() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => teacherCourseApi.list(accessToken!),
    enabled: Boolean(accessToken),
  })
}

export function useTeacherCourse(id: string | undefined) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ['teacher-course', id],
    queryFn: () => teacherCourseApi.get(id!, accessToken!),
    enabled: Boolean(id && accessToken),
  })
}

export function useCreateCourse() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseInput) => teacherCourseApi.create(input, accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher-courses'] }),
  })
}

export function useUpdateCourse(id: string) {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseInput) => teacherCourseApi.update(id, input, accessToken!),
    onSuccess: (course) => {
      queryClient.setQueryData(['teacher-course', id], course)
      void queryClient.invalidateQueries({ queryKey: ['teacher-courses'] })
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteCourse() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teacherCourseApi.delete(id, accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher-courses'] }),
  })
}
