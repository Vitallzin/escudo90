import { onIdTokenChanged } from 'firebase/auth'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type AuthSession } from './auth-context'
import { AuthService } from '../services/authService'
import { firebaseAuth } from '../config/firebase'

const AUTH_STORAGE_KEY = 'escudo90:auth'

function readStoredSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedSession) {
      return null
    }

    const parsedSession = JSON.parse(storedSession) as AuthSession

    if (!parsedSession.user?.email || !parsedSession.token) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return parsedSession
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession())

  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, (firebaseUser) => {
      if (!firebaseUser) {
        return
      }

      void firebaseUser.getIdToken().then((token) => {
        setSession((currentSession) => {
          if (!currentSession || currentSession.user.id !== firebaseUser.uid) {
            return currentSession
          }

          const nextSession = {
            ...currentSession,
            token,
          }

          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession))

          return nextSession
        })
      })
    })
  }, [])

  function authenticate(nextSession: AuthSession) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }

  function logout() {
    void AuthService.logout()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
  }

  return (
    <AuthContext
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: !!session,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext>
  )
}
