import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function login() {
    setUser({
      name: 'Marcos Oliveira',
      email: 'marcos@email.com',
      role: 'customer',
    })
  }

  function authenticate(nextUser: User) {
    setUser(nextUser)
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext value={{ user, isAuthenticated: !!user, authenticate, login, logout }}>
      {children}
    </AuthContext>
  )
}
