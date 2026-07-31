import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { getEnvironment } from './config/env.js'
import { createAuthRouter } from './modules/auth/auth.routes.js'
import { createCourseRouter } from './modules/courses/course.routes.js'

interface CreateAppOptions {
  clientUrl?: string
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express()
  const clientUrl = options.clientUrl ?? getEnvironment().CLIENT_URL

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))
  app.use(cookieParser())

  app.get('/api/health', (_request, response) => {
    response.status(200).json({
      data: {
        service: 'online-school-api',
        status: 'ok',
      },
    })
  })

  app.use('/api/auth', createAuthRouter())
  app.use('/api/courses', createCourseRouter())

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
