import type { IncomingMessage, ServerResponse } from 'node:http'
import { env } from '../config/env.ts'

export function applyCors(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', env.allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}
