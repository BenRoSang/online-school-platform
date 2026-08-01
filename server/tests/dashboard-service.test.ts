import { describe, expect, it, vi } from 'vitest'
import { CourseStatus } from '../src/generated/prisma/client.js'
import { DashboardRepository } from '../src/modules/dashboard/dashboard.repository.js'
import { DashboardService } from '../src/modules/dashboard/dashboard.service.js'

describe('dashboard calculations', () => {
  it('calculates student metrics from only the supplied student query', async () => {
    const repository = {
      findStudentCourses: vi.fn().mockResolvedValue([
        { course: { sections: [{ lessons: [{ progress: [{ id: 'p1' }] }, { progress: [] }] }] } },
        { course: { sections: [{ lessons: [{ progress: [{ id: 'p2' }] }] }] } },
      ]),
    } as unknown as DashboardRepository
    const result = await new DashboardService(repository).student('student-1')
    expect(result).toEqual({ enrolledCourseCount: 2, coursesInProgress: 1, completedLessons: 2 })
    expect(repository.findStudentCourses).toHaveBeenCalledWith('student-1')
  })

  it('counts unique students across a teacher’s courses', async () => {
    const repository = {
      findTeacherCourses: vi.fn().mockResolvedValue([
        { id: 'c1', title: 'One', slug: 'one', status: CourseStatus.PUBLISHED, updatedAt: new Date('2026-01-02'), enrolments: [{ studentId: 's1' }, { studentId: 's2' }] },
        { id: 'c2', title: 'Two', slug: 'two', status: CourseStatus.DRAFT, updatedAt: new Date('2026-01-01'), enrolments: [{ studentId: 's1' }] },
      ]),
    } as unknown as DashboardRepository
    const result = await new DashboardService(repository).teacher('teacher-1')
    expect(result.totalCourses).toBe(2)
    expect(result.publishedCourses).toBe(1)
    expect(result.draftCourses).toBe(1)
    expect(result.totalEnrolledStudents).toBe(2)
    expect(repository.findTeacherCourses).toHaveBeenCalledWith('teacher-1')
  })
})
