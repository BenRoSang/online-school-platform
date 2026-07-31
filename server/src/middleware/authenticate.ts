import type { RequestHandler } from 'express'
import { AppError } from '../shared/errors/app-error.js'
import { verifyAccessToken } from '../modules/auth/token.service.js'

export const authenticate: RequestHandler = (request, _response, next) => {
  const authorization = request.header('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required'))
    return
  }

  const payload = verifyAccessToken(authorization.slice(7))
  request.auth = { userId: payload.sub, role: payload.role }
  next()
}
