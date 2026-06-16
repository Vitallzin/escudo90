import { createContext } from 'react'

export type User = {
  name: string
  email: string
  role: 'customer' | 'admin'
}

export type AuthContextData = {
  user: User | null
  isAuthenticated: boolean
  authenticate: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)
