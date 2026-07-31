import { createContext } from 'react'
import type {
  AuthUser,
  LoginCredentials,
  RegisterDetails,
} from '../types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  register: (details: RegisterDetails) => Promise<AuthUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
