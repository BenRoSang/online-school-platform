import { describe, expect, it } from 'vitest'
import {
  loginRequestSchema,
  registerRequestSchema,
} from '../src/modules/auth/auth.schema.js'

describe('authentication request validation', () => {
  it('normalizes valid registration data', () => {
    const result = registerRequestSchema.parse({
      body: {
        email: '  Student@Example.com ',
        password: 'Student123!',
        fullName: '  Jamie Chen  ',
        role: 'STUDENT',
      },
    })

    expect(result.body.email).toBe('student@example.com')
    expect(result.body.fullName).toBe('Jamie Chen')
  })

  it('rejects admin self-registration', () => {
    expect(() =>
      registerRequestSchema.parse({
        body: {
          email: 'admin@example.com',
          password: 'Admin123!',
          fullName: 'Admin User',
          role: 'ADMIN',
        },
      }),
    ).toThrow()
  })

  it('requires a password for login', () => {
    expect(() =>
      loginRequestSchema.parse({
        body: { email: 'student@example.com', password: '' },
      }),
    ).toThrow()
  })
})
