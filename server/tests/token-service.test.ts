import { beforeAll, describe, expect, it } from 'vitest'
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../src/modules/auth/token.service.js'

beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/test'
  process.env.JWT_ACCESS_SECRET = 'a'.repeat(32)
  process.env.JWT_REFRESH_SECRET = 'b'.repeat(32)
  process.env.CLIENT_URL = 'http://localhost:5173'
})

describe('token service', () => {
  it('creates and verifies an access token', () => {
    const token = createAccessToken(
      '10000000-0000-4000-8000-000000000001',
      'TEACHER',
    )
    const payload = verifyAccessToken(token)

    expect(payload.sub).toBe('10000000-0000-4000-8000-000000000001')
    expect(payload.role).toBe('TEACHER')
    expect(payload.type).toBe('access')
  })

  it('does not accept a refresh token as an access token', () => {
    const token = createRefreshToken(
      '20000000-0000-4000-8000-000000000001',
      'STUDENT',
    )
    expect(() => verifyAccessToken(token)).toThrow('invalid or expired')
    expect(verifyRefreshToken(token).type).toBe('refresh')
  })

  it('hashes tokens deterministically without storing the raw value', () => {
    expect(hashToken('token-value')).toBe(hashToken('token-value'))
    expect(hashToken('token-value')).not.toContain('token-value')
  })
})
