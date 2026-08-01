import { Router } from 'express'
import { Role } from '../../generated/prisma/client.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { DashboardController } from './dashboard.controller.js'

export function createDashboardRouter() {
  const router = Router()
  const controller = new DashboardController()
  router.use(authenticate)
  router.get('/student', authorize(Role.STUDENT), controller.student)
  router.get('/teacher', authorize(Role.TEACHER), controller.teacher)
  return router
}
