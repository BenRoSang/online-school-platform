import type { RequestHandler } from 'express'
import type { UpdateProgressRequest } from './progress.schema.js'
import { ProgressService } from './progress.service.js'

export class ProgressController {
  constructor(private readonly service = new ProgressService()) {}
  update: RequestHandler = async (request, response) => {
    const { params, body } = response.locals.validated as UpdateProgressRequest
    response.status(200).json({
      data: { progress: await this.service.update(request.auth!.userId, params.lessonId, body.completed) },
    })
  }
}
