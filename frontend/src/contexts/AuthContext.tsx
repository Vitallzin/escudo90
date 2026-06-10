import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function login() {
    setUser({
      name: 'Marcos Oliveira',
      email: 'marcos@email.com',
      role: 'client',
    })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext>
  )
}
