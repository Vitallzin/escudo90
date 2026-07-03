import { createContext } from 'react'

export type User = {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  document?: string
  createdAt: string
}

export type AuthSession = {
  user: User
  token: string
}

export type AuthContextData = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  authenticate: (session: AuthSession) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)
