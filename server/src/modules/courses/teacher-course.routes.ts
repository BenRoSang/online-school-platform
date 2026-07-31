import { Router } from 'express'
import { Role } from '../../generated/prisma/client.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { CourseController } from './course.controller.js'
import {
  createTeacherCourseSchema,
  teacherCourseIdSchema,
  updateTeacherCourseSchema,
} from './course.schema.js'

export function createTeacherCourseRouter() {
  const router = Router()
  const controller = new CourseController()

  router.use(authenticate, authorize(Role.TEACHER))
  router.get('/', controller.listTeacher)
  router.get('/:id', validateRequest(teacherCourseIdSchema), controller.getTeacher)
  router.post('/', validateRequest(createTeacherCourseSchema), controller.createTeacher)
  router.put('/:id', validateRequest(updateTeacherCourseSchema), controller.updateTeacher)
  router.delete('/:id', validateRequest(teacherCourseIdSchema), controller.deleteTeacher)

  return router
}
