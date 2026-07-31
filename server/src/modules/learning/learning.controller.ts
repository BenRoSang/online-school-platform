import type { RequestHandler } from 'express'
import type { LessonPlayerRequest } from './learning.schema.js'
import { LearningService } from './learning.service.js'

export class LearningController {
  constructor(private readonly service = new LearningService()) {}
  show: RequestHandler = async (request, response) => {
    const { params } = response.locals.validated as LessonPlayerRequest
    response.status(200).json({
      data: await this.service.getLesson(params.slug, params.lessonId, request.auth),
    })
  }
}
