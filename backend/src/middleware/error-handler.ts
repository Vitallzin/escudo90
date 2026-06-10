import type { ServerResponse } from 'node:http'
import { ApiError } from '../utils/api-error.ts'
import { sendJson } from '../utils/http.ts'

export function handleError(res: ServerResponse, error: unknown) {
  if (error instanceof ApiError) {
    sendJson(res, error.statusCode, {
      error: {
        message: error.message,
        details: error.details,
      },
    })
    return
  }

  console.error(error)
  sendJson(res, 500, {
    error: {
      message: 'Erro interno do servidor',
    },
  })
}
