import { createContext } from 'react'

export type User = {
  name: string
  email: string
  role: 'client' | 'admin'
}

export type AuthContextData = {
  user: User | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)
