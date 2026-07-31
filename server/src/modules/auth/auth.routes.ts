import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { validateRequest } from '../../middleware/validate-request.js'
import { AuthController } from './auth.controller.js'
import { loginRequestSchema, registerRequestSchema } from './auth.schema.js'

export function createAuthRouter(): Router {
  const router = Router()
  const controller = new AuthController()

  router.post('/register', validateRequest(registerRequestSchema), controller.register)
  router.post('/login', validateRequest(loginRequestSchema), controller.login)
  router.post('/refresh', controller.refresh)
  router.post('/logout', controller.logout)
  router.get('/me', authenticate, controller.me)

  return router
}
