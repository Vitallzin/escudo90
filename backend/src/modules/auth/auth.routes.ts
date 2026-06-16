import type { RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { asRecord } from '../../utils/http.ts'
import {
  checkEmailAvailability,
  createDemoToken,
  loginUser,
  registerUser,
  sanitizeUser,
} from './auth.service.ts'
import { getEmailFromQuery } from './auth.validators.ts'

export const authRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/auth/register',
    handler: ({ body }) => registerUser(asRecord(body)),
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: ({ body }) => loginUser(asRecord(body)),
  },
  {
    method: 'POST',
    path: '/auth/recover-password',
    handler: ({ body }) => {
      const email = String(asRecord(body).email ?? '').trim()
      assert(email.includes('@'), 422, 'Informe um e-mail valido')

      return {
        message: 'Se o e-mail existir, enviaremos as instrucoes de recuperacao.',
      }
    },
  },
  {
    method: 'GET',
    path: '/auth/check-email',
    handler: ({ url }) => checkEmailAvailability(getEmailFromQuery(url.searchParams.get('email'))),
  },
  {
    method: 'GET',
    path: '/auth/me',
    auth: true,
    handler: ({ user }) => sanitizeUser(user!),
  },
  {
    method: 'GET',
    path: '/auth/demo/customer',
    handler: () => createDemoToken('customer'),
  },
  {
    method: 'GET',
    path: '/auth/demo/admin',
    handler: () => createDemoToken('admin'),
  },
]
