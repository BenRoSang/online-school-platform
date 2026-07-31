import type { RequestHandler } from 'express'
import type {
  CreateTeacherCourseRequest,
  GetPublicCourseRequest,
  ListPublicCoursesRequest,
  TeacherCourseIdRequest,
  UpdateTeacherCourseRequest,
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

  listTeacher: RequestHandler = async (request, response) => {
    response.status(200).json({
      data: { courses: await this.service.listTeacherCourses(request.auth!.userId) },
    })
  }

  getTeacher: RequestHandler = async (request, response) => {
    const { params } = response.locals.validated as TeacherCourseIdRequest
    response.status(200).json({
      data: { course: await this.service.getTeacherCourse(params.id, request.auth!.userId) },
    })
  }

  createTeacher: RequestHandler = async (request, response) => {
    const { body } = response.locals.validated as CreateTeacherCourseRequest
    response.status(201).json({
      data: { course: await this.service.createTeacherCourse(request.auth!.userId, body) },
    })
  }

  updateTeacher: RequestHandler = async (request, response) => {
    const { body, params } = response.locals.validated as UpdateTeacherCourseRequest
    response.status(200).json({
      data: {
        course: await this.service.updateTeacherCourse(params.id, request.auth!.userId, body),
      },
    })
  }

  deleteTeacher: RequestHandler = async (request, response) => {
    const { params } = response.locals.validated as TeacherCourseIdRequest
    await this.service.deleteTeacherCourse(params.id, request.auth!.userId)
    response.status(204).send()
  }
}
