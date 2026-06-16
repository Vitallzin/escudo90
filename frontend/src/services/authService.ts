export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  document?: string
  createdAt: string
}

export type RegisterPayload = {
  name: string
  email: string
  phone?: string
  document?: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

async function request<TResponse>(path: string, options: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  const payload = (await response.json()) as { data?: TResponse; error?: { message?: string } }

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Nao foi possivel concluir a solicitacao')
  }

  if (!payload.data) {
    throw new Error('Resposta invalida do servidor')
  }

  return payload.data
}

export const AuthService = {
  register(payload: RegisterPayload) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
