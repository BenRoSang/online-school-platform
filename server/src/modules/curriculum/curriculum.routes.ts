import { Router } from 'express'
import { Role } from '../../generated/prisma/client.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { CurriculumController } from './curriculum.controller.js'
import * as schema from './curriculum.schema.js'

export function createCurriculumRouter() {
  const router = Router({ mergeParams: true })
  const controller = new CurriculumController()
  router.use(authenticate, authorize(Role.TEACHER))
  router.get('/', validateRequest(schema.courseCurriculumSchema), controller.get)
  router.post('/sections', validateRequest(schema.sectionSchema), controller.addSection)
  router.put('/sections/order', validateRequest(schema.reorderSectionsSchema), controller.reorderSections)
  router.put('/sections/:sectionId', validateRequest(schema.sectionItemSchema), controller.editSection)
  router.delete('/sections/:sectionId', validateRequest(schema.deleteSectionSchema), controller.deleteSection)
  router.post('/sections/:sectionId/lessons', validateRequest(schema.lessonSchema), controller.addLesson)
  router.put('/sections/:sectionId/lessons/order', validateRequest(schema.reorderLessonsSchema), controller.reorderLessons)
  router.put('/lessons/:lessonId', validateRequest(schema.lessonItemSchema), controller.editLesson)
  router.delete('/lessons/:lessonId', validateRequest(schema.deleteLessonSchema), controller.deleteLesson)
  return router
}
