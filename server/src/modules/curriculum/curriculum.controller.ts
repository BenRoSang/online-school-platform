import type { RequestHandler } from 'express'
import type { z } from 'zod'
import type * as schemas from './curriculum.schema.js'
import { CurriculumService } from './curriculum.service.js'

type Parsed<T extends z.ZodType> = z.infer<T>

export class CurriculumController {
  constructor(private readonly service = new CurriculumService()) {}
  get: RequestHandler = async (request, response) => { const { params } = response.locals.validated as Parsed<typeof schemas.courseCurriculumSchema>; response.json({ data: { curriculum: await this.service.get(params.courseId, request.auth!.userId) } }) }
  addSection: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.sectionSchema>; response.status(201).json({ data: { section: await this.service.addSection(params.courseId, request.auth!.userId, body.title) } }) }
  editSection: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.sectionItemSchema>; await this.service.editSection(params.courseId, params.sectionId, request.auth!.userId, body.title); response.status(204).send() }
  deleteSection: RequestHandler = async (request, response) => { const { params } = response.locals.validated as Parsed<typeof schemas.deleteSectionSchema>; await this.service.removeSection(params.courseId, params.sectionId, request.auth!.userId); response.status(204).send() }
  reorderSections: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.reorderSectionsSchema>; await this.service.reorderSections(params.courseId, request.auth!.userId, body.sectionIds); response.status(204).send() }
  addLesson: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.lessonSchema>; response.status(201).json({ data: { lesson: await this.service.addLesson(params.courseId, params.sectionId, request.auth!.userId, body) } }) }
  editLesson: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.lessonItemSchema>; await this.service.editLesson(params.courseId, params.lessonId, request.auth!.userId, body); response.status(204).send() }
  deleteLesson: RequestHandler = async (request, response) => { const { params } = response.locals.validated as Parsed<typeof schemas.deleteLessonSchema>; await this.service.removeLesson(params.courseId, params.lessonId, request.auth!.userId); response.status(204).send() }
  reorderLessons: RequestHandler = async (request, response) => { const { params, body } = response.locals.validated as Parsed<typeof schemas.reorderLessonsSchema>; await this.service.reorderLessons(params.courseId, params.sectionId, request.auth!.userId, body.lessonIds); response.status(204).send() }
}
