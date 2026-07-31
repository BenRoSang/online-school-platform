import type { Role } from '../../generated/prisma/enums.ts'

export interface PublicUser {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  role: Role
}

export interface RegisterInput {
  email: string
  password: string
  fullName: string
  role: Extract<Role, 'STUDENT' | 'TEACHER'>
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: PublicUser
}
