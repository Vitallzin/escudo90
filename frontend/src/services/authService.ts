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

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

async function request<TResponse>(path: string, options: RequestInit) {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
  }

  const payload = (await response.json()) as { data?: TResponse; error?: { message?: string } }

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Não foi possível concluir a solicitação')
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
  login(payload: LoginPayload) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
