import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../services/authApi'
import type { AuthSession, LoginCredentials, RegisterDetails } from '../types/auth'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    authApi
      .refresh()
      .then((restoredSession) => {
        if (active) setSession(restoredSession)
      })
      .catch(() => {
        if (active) setSession(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await authApi.login(credentials)
    setSession(nextSession)
    return nextSession.user
  }, [])

  const register = useCallback(async (details: RegisterDetails) => {
    const nextSession = await authApi.register(details)
    setSession(nextSession)
    return nextSession.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setSession(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
