import type {
  AuthSession,
  LoginCredentials,
  RegisterDetails,
} from '../types/auth'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ApiErrorResponse {
  error?: {
    message?: string
  }
}

export class ApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorResponse
    throw new ApiError(body.error?.message ?? 'The request could not be completed', response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

interface SessionResponse {
  data: AuthSession
}

export const authApi = {
  async login(credentials: LoginCredentials) {
    return (await request<SessionResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })).data
  },
  async register(details: RegisterDetails) {
    return (await request<SessionResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    })).data
  },
  async refresh() {
    return (await request<SessionResponse>('/auth/refresh', { method: 'POST' })).data
  },
  async logout() {
    await request<void>('/auth/logout', { method: 'POST' })
  },
}
