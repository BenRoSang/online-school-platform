import { describe, expect, it } from 'vitest'
import { parseEnvironment } from '../src/config/env.js'

const validEnvironment = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/online_school',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  CLIENT_URL: 'http://localhost:5173',
}

describe('environment validation', () => {
  it('applies safe development defaults', () => {
    const environment = parseEnvironment(validEnvironment)

    expect(environment.PORT).toBe(5000)
    expect(environment.FILE_STORAGE_PROVIDER).toBe('local')
    expect(environment.MAX_PDF_SIZE_MB).toBe(10)
  })

  it('rejects short JWT secrets', () => {
    expect(() =>
      parseEnvironment({
        ...validEnvironment,
        JWT_ACCESS_SECRET: 'too-short',
      }),
    ).toThrow('Invalid server environment')
  })
})
