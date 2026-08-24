import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './useAuth'
import * as authService from '../api/services/auth'

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('auth_token')))

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      setLoading(false)
      return
    }
    authService
      .me()
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      })
      .catch(() => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // abaikan error, tetap logout lokal
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser)
    localStorage.setItem('auth_user', JSON.stringify(nextUser))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
