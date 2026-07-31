import { Router } from 'express'
import { validateRequest } from '../../middleware/validate-request.js'
import { CourseController } from './course.controller.js'
import { getPublicCourseSchema, listPublicCoursesSchema } from './course.schema.js'

export function createCourseRouter() {
  const router = Router()
  const controller = new CourseController()

  router.get('/', validateRequest(listPublicCoursesSchema), controller.listPublic)
  router.get('/:slug', validateRequest(getPublicCourseSchema), controller.getPublic)

  return router
}
