import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const PASSWORD_PREFIX = 'scrypt'
const KEY_LENGTH = 64

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex')

  return `${PASSWORD_PREFIX}:${salt}:${hash}`
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!storedPassword.startsWith(`${PASSWORD_PREFIX}:`)) {
    return storedPassword === password
  }

  const [, salt, hash] = storedPassword.split(':')

  if (!salt || !hash) {
    return false
  }

  const candidate = scryptSync(password, salt, KEY_LENGTH)
  const current = Buffer.from(hash, 'hex')

  return current.length === candidate.length && timingSafeEqual(current, candidate)
}
