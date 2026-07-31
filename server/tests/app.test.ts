import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'

const app = createApp({ clientUrl: 'http://localhost:5173' })

describe('application shell', () => {
  it('returns the API health status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        service: 'online-school-api',
        status: 'ok',
      },
    })
  })

  it('returns a structured response for unknown routes', async () => {
    const response = await request(app).get('/api/unknown')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route GET /api/unknown was not found',
      },
    })
  })
})
