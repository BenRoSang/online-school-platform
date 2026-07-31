import type { Prisma, Role, User } from '../../generated/prisma/client.ts'
import { getDatabase } from '../../config/database.js'

export class AuthRepository {
  findUserByEmail(email: string) {
    return getDatabase().user.findUnique({ where: { email } })
  }

  findUserById(id: string) {
    return getDatabase().user.findUnique({ where: { id } })
  }

  createUser(data: {
    email: string
    passwordHash: string
    fullName: string
    role: Role
  }): Promise<User> {
    return getDatabase().user.create({ data })
  }

  createRefreshToken(data: {
    tokenHash: string
    userId: string
    expiresAt: Date
  }) {
    return getDatabase().refreshToken.create({ data })
  }

  findRefreshToken(tokenHash: string) {
    return getDatabase().refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    })
  }

  revokeRefreshToken(tokenHash: string) {
    return getDatabase().refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async rotateRefreshToken(
    oldTokenHash: string,
    data: Prisma.RefreshTokenUncheckedCreateInput,
  ): Promise<boolean> {
    return getDatabase().$transaction(async (database) => {
      const revokedToken = await database.refreshToken.updateMany({
        where: { tokenHash: oldTokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      if (revokedToken.count !== 1) return false

      await database.refreshToken.create({ data })
      return true
    })
  }
}
