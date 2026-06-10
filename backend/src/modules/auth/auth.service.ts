import { store } from '../../database/store.ts'
import type { User, UserRole } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'
import { signToken } from '../../services/token.service.ts'

export function sanitizeUser(user: User) {
  const { password, ...safeUser } = user
  void password

  return safeUser
}

export function registerUser(input: Record<string, unknown>) {
  const name = String(input.name ?? '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()
  const password = String(input.password ?? '')

  assert(name.length >= 3, 422, 'Informe um nome válido')
  assert(email.includes('@'), 422, 'Informe um e-mail válido')
  assert(password.length >= 6, 422, 'A senha deve ter pelo menos 6 caracteres')
  assert(!store.users.some((user) => user.email === email), 409, 'E-mail já cadastrado')

  const user: User = {
    id: createId('usr'),
    name,
    email,
    password,
    role: 'customer',
    favorites: [],
    addresses: [],
    createdAt: new Date().toISOString(),
  }

  store.users.push(user)

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, role: user.role }),
  }
}

export function loginUser(input: Record<string, unknown>) {
  const email = String(input.email ?? '').trim().toLowerCase()
  const password = String(input.password ?? '')
  const user = store.users.find((item) => item.email === email && item.password === password)

  assert(user, 401, 'E-mail ou senha inválidos')

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, role: user.role }),
  }
}

export function createDemoToken(role: UserRole) {
  const user = store.users.find((item) => item.role === role)
  assert(user, 404, 'Usuário demonstrativo não encontrado')

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, role: user.role }),
  }
}
