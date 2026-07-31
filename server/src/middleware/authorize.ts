import type { RequestHandler } from 'express'
import type { Role } from '../generated/prisma/enums.ts'
import { AppError } from '../shared/errors/app-error.js'

export function authorize(...roles: Role[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required'))
      return
    }

    if (!roles.includes(request.auth.role)) {
      next(new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource'))
      return
    }

    next()
  }
}
