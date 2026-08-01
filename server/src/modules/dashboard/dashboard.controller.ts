import type { RequestHandler } from 'express'
import { DashboardService } from './dashboard.service.js'

export class DashboardController {
  constructor(private readonly service = new DashboardService()) {}
  student: RequestHandler = async (request, response) => {
    response.json({ data: await this.service.student(request.auth!.userId) })
  }
  teacher: RequestHandler = async (request, response) => {
    response.json({ data: await this.service.teacher(request.auth!.userId) })
  }
}
