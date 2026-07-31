import bcrypt from 'bcrypt'
import type { User } from '../../generated/prisma/client.ts'
import { getEnvironment } from '../../config/env.js'
import { AppError } from '../../shared/errors/app-error.js'
import { AuthRepository } from './auth.repository.js'
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from './token.service.js'
import type { AuthSession, LoginInput, PublicUser, RegisterInput } from './auth.types.js'

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role,
  }
}

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(input: RegisterInput): Promise<AuthSession> {
    const existingUser = await this.repository.findUserByEmail(input.email)
    if (existingUser) {
      throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'An account already uses this email')
    }

    const user = await this.repository.createUser({
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      passwordHash: await bcrypt.hash(input.password, 12),
    })
    return this.createSession(user)
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const user = await this.repository.findUserByEmail(input.email)
    const validPassword = user
      ? await bcrypt.compare(input.password, user.passwordHash)
      : false

    if (!user || !validPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect')
    }

    return this.createSession(user)
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const payload = verifyRefreshToken(refreshToken)
    const oldTokenHash = hashToken(refreshToken)
    const storedToken = await this.repository.findRefreshToken(oldTokenHash)

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date() ||
      storedToken.userId !== payload.sub
    ) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh session is invalid or expired')
    }

    const newRefreshToken = createRefreshToken(storedToken.user.id, storedToken.user.role)
    const tokenWasRotated = await this.repository.rotateRefreshToken(oldTokenHash, {
      tokenHash: hashToken(newRefreshToken),
      userId: storedToken.user.id,
      expiresAt: this.refreshExpiry(),
    })

    if (!tokenWasRotated) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh session is invalid or expired')
    }

    return {
      accessToken: createAccessToken(storedToken.user.id, storedToken.user.role),
      refreshToken: newRefreshToken,
      user: toPublicUser(storedToken.user),
    }
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await this.repository.revokeRefreshToken(hashToken(refreshToken))
    }
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await this.repository.findUserById(userId)
    if (!user) throw new AppError(401, 'USER_NOT_FOUND', 'Authenticated user no longer exists')
    return toPublicUser(user)
  }

  private async createSession(user: User): Promise<AuthSession> {
    const refreshToken = createRefreshToken(user.id, user.role)
    await this.repository.createRefreshToken({
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: this.refreshExpiry(),
    })
    return {
      accessToken: createAccessToken(user.id, user.role),
      refreshToken,
      user: toPublicUser(user),
    }
  }

  private refreshExpiry(): Date {
    const days = getEnvironment().JWT_REFRESH_EXPIRES_IN_DAYS
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  }
}
