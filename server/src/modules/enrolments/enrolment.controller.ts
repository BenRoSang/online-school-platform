import type { RequestHandler } from 'express'
import type { CreateEnrolmentRequest } from './enrolment.schema.js'
import { EnrolmentService } from './enrolment.service.js'

export class EnrolmentController {
  constructor(private readonly service = new EnrolmentService()) {}

  create: RequestHandler = async (request, response) => {
    const { body } = response.locals.validated as CreateEnrolmentRequest
    await this.service.enrol(request.auth!.userId, body.courseId)
    response.status(201).json({ data: { enrolled: true } })
  }

  list: RequestHandler = async (request, response) => {
    response.status(200).json({
      data: { courses: await this.service.listForStudent(request.auth!.userId) },
    })
  }
}
