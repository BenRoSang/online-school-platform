import { Router } from 'express'
import { Role } from '../../generated/prisma/client.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { ProgressController } from './progress.controller.js'
import { updateProgressSchema } from './progress.schema.js'

export function createProgressRouter() {
  const router = Router()
  const controller = new ProgressController()
  router.use(authenticate, authorize(Role.STUDENT))
  router.put('/lessons/:lessonId', validateRequest(updateProgressSchema), controller.update)
  return router
}
