import { ApiError, assert } from '../../utils/api-error.ts'

export type RegisterUserInput = {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
  document?: string
  acceptTerms: boolean
}

export type LoginUserInput = {
  email: string
  password: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeName(value: unknown) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase()
}

function digitsOnly(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '')

  return digits || undefined
}

function validatePassword(password: string) {
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  assert(password.length >= 12, 422, 'A senha deve ter pelo menos 12 caracteres')
  assert(
    hasLowercase && hasUppercase && hasNumber && hasSymbol,
    422,
    'A senha deve conter letra maiuscula, minuscula, numero e simbolo',
  )
}

export function parseRegisterInput(input: Record<string, unknown>): RegisterUserInput {
  const name = normalizeName(input.name)
  const email = normalizeEmail(input.email)
  const password = String(input.password ?? '')
  const confirmPassword = input.confirmPassword === undefined ? undefined : String(input.confirmPassword)
  const phone = digitsOnly(input.phone)
  const document = digitsOnly(input.document)
  const acceptTerms = input.acceptTerms === true

  assert(name.length >= 3, 422, 'Informe um nome valido')
  assert(name.includes(' '), 422, 'Informe nome e sobrenome')
  assert(emailPattern.test(email), 422, 'Informe um e-mail valido')
  validatePassword(password)

  if (confirmPassword !== undefined) {
    assert(password === confirmPassword, 422, 'As senhas nao conferem')
  }

  if (phone) {
    assert(phone.length === 10 || phone.length === 11, 422, 'Informe um telefone valido')
  }

  if (document) {
    assert(document.length === 11, 422, 'Informe um CPF valido')
  }

  assert(acceptTerms, 422, 'Aceite os termos para continuar')

  return {
    name,
    email,
    password,
    confirmPassword,
    phone,
    document,
    acceptTerms,
  }
}

export function parseLoginInput(input: Record<string, unknown>): LoginUserInput {
  const email = normalizeEmail(input.email)
  const password = String(input.password ?? '')

  assert(emailPattern.test(email), 422, 'Informe um e-mail valido')
  assert(password.length > 0, 422, 'Informe sua senha')

  return { email, password }
}

export function getEmailFromQuery(email: string | null) {
  const normalizedEmail = normalizeEmail(email)

  if (!emailPattern.test(normalizedEmail)) {
    throw new ApiError(422, 'Informe um e-mail valido')
  }

  return normalizedEmail
}
