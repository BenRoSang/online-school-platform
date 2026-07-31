import type { CookieOptions, RequestHandler } from 'express'
import { getEnvironment } from '../../config/env.js'
import { AppError } from '../../shared/errors/app-error.js'
import type { LoginRequest, RegisterRequest } from './auth.schema.js'
import { AuthService } from './auth.service.js'

const refreshCookieName = 'refresh_token'

function refreshCookieOptions(includeMaxAge = true): CookieOptions {
  const environment = getEnvironment()
  const options: CookieOptions = {
    httpOnly: true,
    secure: environment.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  }

  if (includeMaxAge) {
    options.maxAge = environment.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
  }
  return options
}

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  register: RequestHandler = async (_request, response) => {
    const { body } = response.locals.validated as RegisterRequest
    const session = await this.service.register(body)
    response.cookie(refreshCookieName, session.refreshToken, refreshCookieOptions())
    response.status(201).json({
      data: { accessToken: session.accessToken, user: session.user },
    })
  }

  login: RequestHandler = async (_request, response) => {
    const { body } = response.locals.validated as LoginRequest
    const session = await this.service.login(body)
    response.cookie(refreshCookieName, session.refreshToken, refreshCookieOptions())
    response.status(200).json({
      data: { accessToken: session.accessToken, user: session.user },
    })
  }

  refresh: RequestHandler = async (request, response) => {
    const refreshToken = request.cookies[refreshCookieName] as unknown
    if (typeof refreshToken !== 'string') {
      throw new AppError(401, 'REFRESH_TOKEN_REQUIRED', 'Refresh session is required')
    }
    const session = await this.service.refresh(refreshToken)
    response.cookie(refreshCookieName, session.refreshToken, refreshCookieOptions())
    response.status(200).json({
      data: { accessToken: session.accessToken, user: session.user },
    })
  }

  logout: RequestHandler = async (request, response) => {
    const refreshToken = request.cookies[refreshCookieName] as unknown
    await this.service.logout(typeof refreshToken === 'string' ? refreshToken : undefined)
    response.clearCookie(refreshCookieName, refreshCookieOptions(false))
    response.status(204).send()
  }

  me: RequestHandler = async (request, response) => {
    if (!request.auth) {
      throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required')
    }
    response.status(200).json({
      data: { user: await this.service.getCurrentUser(request.auth.userId) },
    })
  }
}
