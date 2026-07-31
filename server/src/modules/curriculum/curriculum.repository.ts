import { getDatabase } from '../../config/database.js'

const curriculumSelection = {
  id: true, title: true, slug: true,
  sections: { orderBy: { position: 'asc' as const }, select: {
    id: true, title: true, position: true,
    lessons: { orderBy: { position: 'asc' as const }, select: {
      id: true, title: true, description: true, youtubeVideoId: true, position: true, isPreview: true,
    } },
  } },
} as const

export class CurriculumRepository {
  findOwnedCurriculum(courseId: string, teacherId: string) {
    return getDatabase().course.findFirst({ where: { id: courseId, teacherId }, select: curriculumSelection })
  }
  async createSection(courseId: string, title: string) {
    const aggregate = await getDatabase().section.aggregate({ where: { courseId }, _max: { position: true } })
    return getDatabase().section.create({ data: { courseId, title, position: (aggregate._max.position ?? -1) + 1 } })
  }
  updateSection(sectionId: string, courseId: string, title: string) {
    return getDatabase().section.updateMany({ where: { id: sectionId, courseId }, data: { title } })
  }
  deleteSection(sectionId: string, courseId: string) {
    return getDatabase().section.deleteMany({ where: { id: sectionId, courseId } })
  }
  async createLesson(sectionId: string, title: string, description: string, youtubeVideoId: string, isPreview: boolean) {
    const aggregate = await getDatabase().lesson.aggregate({ where: { sectionId }, _max: { position: true } })
    return getDatabase().lesson.create({ data: { sectionId, title, description, youtubeVideoId, isPreview, position: (aggregate._max.position ?? -1) + 1 } })
  }
  updateLesson(lessonId: string, courseId: string, data: { title: string; description: string; youtubeVideoId: string; isPreview: boolean }) {
    return getDatabase().lesson.updateMany({ where: { id: lessonId, section: { courseId } }, data })
  }
  deleteLesson(lessonId: string, courseId: string) {
    return getDatabase().lesson.deleteMany({ where: { id: lessonId, section: { courseId } } })
  }
  async reorderSections(courseId: string, sectionIds: string[]) {
    await getDatabase().$transaction(async (database) => {
      await database.section.updateMany({ where: { courseId }, data: { position: { increment: 1_000_000 } } })
      for (const [position, id] of sectionIds.entries()) await database.section.update({ where: { id, courseId }, data: { position } })
    })
  }
  async reorderLessons(sectionId: string, lessonIds: string[]) {
    await getDatabase().$transaction(async (database) => {
      await database.lesson.updateMany({ where: { sectionId }, data: { position: { increment: 1_000_000 } } })
      for (const [position, id] of lessonIds.entries()) await database.lesson.update({ where: { id, sectionId }, data: { position } })
    })
  }
}
