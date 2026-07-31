import { Router } from 'express'
import { Role } from '../../generated/prisma/client.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { EnrolmentController } from './enrolment.controller.js'
import { createEnrolmentSchema } from './enrolment.schema.js'

export function createEnrolmentRouter() {
  const router = Router()
  const controller = new EnrolmentController()
  router.use(authenticate, authorize(Role.STUDENT))
  router.get('/', controller.list)
  router.post('/', validateRequest(createEnrolmentSchema), controller.create)
  return router
}
