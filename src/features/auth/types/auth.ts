export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  role: UserRole
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterDetails extends LoginCredentials {
  fullName: string
  role: Extract<UserRole, 'STUDENT' | 'TEACHER'>
}
