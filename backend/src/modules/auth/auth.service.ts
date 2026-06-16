import { store } from '../../database/store.ts'
import { hashPassword, verifyPassword } from '../../services/password.service.ts'
import { signToken } from '../../services/token.service.ts'
import type { User, UserRole } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'
import { parseLoginInput, parseRegisterInput } from './auth.validators.ts'

export function sanitizeUser(user: User) {
  const { password, ...safeUser } = user
  void password

  return safeUser
}

export function registerUser(input: Record<string, unknown>) {
  const { name, email, password, phone, document } = parseRegisterInput(input)

  assert(!store.users.some((user) => user.email === email), 409, 'E-mail ja cadastrado')

  if (document) {
    assert(!store.users.some((user) => user.document === document), 409, 'CPF ja cadastrado')
  }

  const user: User = {
    id: createId('usr'),
    name,
    email,
    password: hashPassword(password),
    role: 'customer',
    phone,
    document,
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
  const { email, password } = parseLoginInput(input)
  const user = store.users.find((item) => item.email === email && verifyPassword(password, item.password))

  assert(user, 401, 'E-mail ou senha invalidos')

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, role: user.role }),
  }
}

export function createDemoToken(role: UserRole) {
  const user = store.users.find((item) => item.role === role)
  assert(user, 404, 'Usuario demonstrativo nao encontrado')

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, role: user.role }),
  }
}

export function checkEmailAvailability(email: string) {
  return {
    email,
    available: !store.users.some((user) => user.email === email),
  }
}
