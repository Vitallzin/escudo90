import type { IncomingMessage, ServerResponse } from 'node:http'
import { ApiError } from './api-error.ts'

export async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return undefined
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')

  if (!rawBody.trim()) {
    return undefined
  }

  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    throw new ApiError(400, 'JSON inválido no corpo da requisição')
  }
}

export function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data, null, 2))
}

export function sendNoContent(res: ServerResponse) {
  res.statusCode = 204
  res.end()
}

export function getBearerToken(req: IncomingMessage) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length)
}

export function asRecord(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}
