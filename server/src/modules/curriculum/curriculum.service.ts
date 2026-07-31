import { AppError } from '../../shared/errors/app-error.js'
import { CurriculumRepository } from './curriculum.repository.js'

export class CurriculumService {
  constructor(private readonly repository = new CurriculumRepository()) {}
  async get(courseId: string, teacherId: string) {
    const curriculum = await this.repository.findOwnedCurriculum(courseId, teacherId)
    if (!curriculum) throw new AppError(404, 'COURSE_NOT_FOUND', 'Course was not found')
    return curriculum
  }
  async addSection(courseId: string, teacherId: string, title: string) { await this.get(courseId, teacherId); return this.repository.createSection(courseId, title) }
  async editSection(courseId: string, sectionId: string, teacherId: string, title: string) { await this.get(courseId, teacherId); if ((await this.repository.updateSection(sectionId, courseId, title)).count !== 1) throw new AppError(404, 'SECTION_NOT_FOUND', 'Section was not found') }
  async removeSection(courseId: string, sectionId: string, teacherId: string) { await this.get(courseId, teacherId); if ((await this.repository.deleteSection(sectionId, courseId)).count !== 1) throw new AppError(404, 'SECTION_NOT_FOUND', 'Section was not found') }
  async addLesson(courseId: string, sectionId: string, teacherId: string, data: { title: string; description: string; youtubeVideoId: string; isPreview: boolean }) { const course = await this.get(courseId, teacherId); if (!course.sections.some((section) => section.id === sectionId)) throw new AppError(404, 'SECTION_NOT_FOUND', 'Section was not found'); return this.repository.createLesson(sectionId, data.title, data.description, data.youtubeVideoId, data.isPreview) }
  async editLesson(courseId: string, lessonId: string, teacherId: string, data: { title: string; description: string; youtubeVideoId: string; isPreview: boolean }) { await this.get(courseId, teacherId); if ((await this.repository.updateLesson(lessonId, courseId, data)).count !== 1) throw new AppError(404, 'LESSON_NOT_FOUND', 'Lesson was not found') }
  async removeLesson(courseId: string, lessonId: string, teacherId: string) { await this.get(courseId, teacherId); if ((await this.repository.deleteLesson(lessonId, courseId)).count !== 1) throw new AppError(404, 'LESSON_NOT_FOUND', 'Lesson was not found') }
  async reorderSections(courseId: string, teacherId: string, sectionIds: string[]) { const course = await this.get(courseId, teacherId); this.assertExactIds(course.sections.map((section) => section.id), sectionIds); await this.repository.reorderSections(courseId, sectionIds) }
  async reorderLessons(courseId: string, sectionId: string, teacherId: string, lessonIds: string[]) { const course = await this.get(courseId, teacherId); const section = course.sections.find((item) => item.id === sectionId); if (!section) throw new AppError(404, 'SECTION_NOT_FOUND', 'Section was not found'); this.assertExactIds(section.lessons.map((lesson) => lesson.id), lessonIds); await this.repository.reorderLessons(sectionId, lessonIds) }
  private assertExactIds(existing: string[], submitted: string[]) { if (existing.length !== submitted.length || new Set(existing).size !== new Set(submitted).size || submitted.some((id) => !existing.includes(id))) throw new AppError(400, 'INVALID_ORDER', 'Order must include every item exactly once') }
}
