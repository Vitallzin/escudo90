import { env } from '../config/env.ts'

type TokenPayload = {
  userId: string
  role: string
  issuedAt: string
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString('base64url')
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

export function signToken(payload: Omit<TokenPayload, 'issuedAt'>) {
  const tokenPayload: TokenPayload = {
    ...payload,
    issuedAt: new Date().toISOString(),
  }
  const body = toBase64Url(JSON.stringify(tokenPayload))
  const signature = toBase64Url(`${body}.${env.jwtSecret}`).slice(0, 24)

  return `${body}.${signature}`
}

export function verifyToken(token: string) {
  const [body, signature] = token.split('.')

  if (!body || !signature) {
    return null
  }

  const expectedSignature = toBase64Url(`${body}.${env.jwtSecret}`).slice(0, 24)

  if (signature !== expectedSignature) {
    return null
  }

  try {
    return JSON.parse(fromBase64Url(body)) as TokenPayload
  } catch {
    return null
  }
}
