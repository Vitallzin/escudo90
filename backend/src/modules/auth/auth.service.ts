import { store } from '../../database/store.ts'
import { hashPassword, verifyPassword } from '../../services/password.service.ts'
import { signToken } from '../../services/token.service.ts'
import type { User, UserRole } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'
import { parseLoginInput, parseRegisterInput } from './auth.validators.ts'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 30
const failedLoginAttempts = new Map<string, { count: number; lockedUntil?: number }>()

export function sanitizeUser(user: User) {
  const { password, ...safeUser } = user
  void password

  return safeUser
}

function assertLoginIsAllowed(email: string) {
  const attempt = failedLoginAttempts.get(email)

  if (!attempt?.lockedUntil) {
    return
  }

  if (Date.now() >= attempt.lockedUntil) {
    failedLoginAttempts.delete(email)
    return
  }

  assert(false, 429, `Login bloqueado temporariamente. Tente novamente em ${LOCKOUT_MINUTES} minutos.`)
}

function recordFailedLogin(email: string) {
  const current = failedLoginAttempts.get(email)
  const nextCount = (current?.count ?? 0) + 1
  const lockedUntil = nextCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MINUTES * 60 * 1000 : undefined

  failedLoginAttempts.set(email, {
    count: nextCount,
    lockedUntil,
  })
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
  assertLoginIsAllowed(email)

  const user = store.users.find((item) => item.email === email && verifyPassword(password, item.password))

  if (!user) {
    recordFailedLogin(email)
    assert(false, 401, 'E-mail ou senha invalidos')
  }

  failedLoginAttempts.delete(email)

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
