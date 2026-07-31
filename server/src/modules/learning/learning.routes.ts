import { Router } from 'express'
import { optionalAuthenticate } from '../../middleware/optional-authenticate.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { LearningController } from './learning.controller.js'
import { lessonPlayerSchema } from './learning.schema.js'

export function createLearningRouter() {
  const router = Router()
  const controller = new LearningController()
  router.get('/courses/:slug/lessons/:lessonId', optionalAuthenticate, validateRequest(lessonPlayerSchema), controller.show)
  return router
}
