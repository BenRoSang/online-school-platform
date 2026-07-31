import type { RequestHandler } from 'express'
import type {
  GetPublicCourseRequest,
  ListPublicCoursesRequest,
} from './course.schema.js'
import { CourseService } from './course.service.js'

export class CourseController {
  constructor(private readonly service = new CourseService()) {}

  listPublic: RequestHandler = async (_request, response) => {
    const { query } = response.locals.validated as ListPublicCoursesRequest
    response.status(200).json({
      data: { courses: await this.service.listPublishedCourses(query.search) },
    })
  }

  getPublic: RequestHandler = async (_request, response) => {
    const { params } = response.locals.validated as GetPublicCourseRequest
    response.status(200).json({
      data: { course: await this.service.getPublishedCourse(params.slug) },
    })
  }
}
