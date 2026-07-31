import { createHash, randomUUID } from 'node:crypto'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import type { Role } from '../../generated/prisma/enums.ts'
import { getEnvironment } from '../../config/env.js'
import { AppError } from '../../shared/errors/app-error.js'

interface TokenPayload extends JwtPayload {
  sub: string
  role: Role
  type: 'access' | 'refresh'
}

function signToken(
  userId: string,
  role: Role,
  type: TokenPayload['type'],
  secret: string,
  expiresIn: NonNullable<SignOptions['expiresIn']>,
) {
  return jwt.sign({ role, type }, secret, {
    subject: userId,
    jwtid: randomUUID(),
    expiresIn,
    issuer: 'online-school-api',
    audience: 'online-school-client',
  })
}

export function createAccessToken(userId: string, role: Role): string {
  const environment = getEnvironment()
  return signToken(
    userId,
    role,
    'access',
    environment.JWT_ACCESS_SECRET,
    environment.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
  )
}

export function createRefreshToken(userId: string, role: Role): string {
  const environment = getEnvironment()
  return signToken(
    userId,
    role,
    'refresh',
    environment.JWT_REFRESH_SECRET,
    `${environment.JWT_REFRESH_EXPIRES_IN_DAYS}d`,
  )
}

function verifyToken(token: string, secret: string, expectedType: TokenPayload['type']) {
  try {
    const payload = jwt.verify(token, secret, {
      issuer: 'online-school-api',
      audience: 'online-school-client',
    })

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      payload.type !== expectedType ||
      !['STUDENT', 'TEACHER', 'ADMIN'].includes(payload.role)
    ) {
      throw new Error('Invalid token payload')
    }

    return payload as TokenPayload
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Authentication token is invalid or expired')
  }
}

export function verifyAccessToken(token: string): TokenPayload {
  return verifyToken(token, getEnvironment().JWT_ACCESS_SECRET, 'access')
}

export function verifyRefreshToken(token: string): TokenPayload {
  return verifyToken(token, getEnvironment().JWT_REFRESH_SECRET, 'refresh')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
