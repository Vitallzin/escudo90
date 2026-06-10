import { store } from '../database/store.ts'
import type { IncomingMessage } from 'node:http'
import { getBearerToken } from '../utils/http.ts'
import { verifyToken } from './token.service.ts'

export function getUserFromRequest(req: IncomingMessage) {
  const token = getBearerToken(req)

  if (!token) {
    return undefined
  }

  const payload = verifyToken(token)

  if (!payload) {
    return undefined
  }

  return store.users.find((user) => user.id === payload.userId)
}
