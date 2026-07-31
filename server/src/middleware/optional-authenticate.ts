import type { RequestHandler } from 'express'
import { verifyAccessToken } from '../modules/auth/token.service.js'

export const optionalAuthenticate: RequestHandler = (request, _response, next) => {
  const authorization = request.header('authorization')
  if (!authorization) {
    next()
    return
  }
  if (!authorization.startsWith('Bearer ')) {
    next()
    return
  }
  const payload = verifyAccessToken(authorization.slice(7))
  request.auth = { userId: payload.sub, role: payload.role }
  next()
}
