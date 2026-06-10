import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { asRecord } from '../../utils/http.ts'
import { createId } from '../../utils/id.ts'
import { sanitizeUser } from '../auth/auth.service.ts'

export const userRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/users/me',
    auth: true,
    handler: ({ user }) => sanitizeUser(user!),
  },
  {
    method: 'PATCH',
    path: '/users/me',
    auth: true,
    handler: ({ user, body }) => {
      const input = asRecord(body)
      user!.name = input.name ? String(input.name) : user!.name
      user!.phone = input.phone ? String(input.phone) : user!.phone
      user!.document = input.document ? String(input.document) : user!.document

      return sanitizeUser(user!)
    },
  },
  {
    method: 'POST',
    path: '/users/me/addresses',
    auth: true,
    handler: ({ user, body }) => {
      const input = asRecord(body)
      const address = {
        id: createId('addr'),
        label: String(input.label ?? 'Endereço'),
        zipCode: String(input.zipCode ?? ''),
        street: String(input.street ?? ''),
        number: String(input.number ?? ''),
        district: String(input.district ?? ''),
        city: String(input.city ?? ''),
        state: String(input.state ?? ''),
      }

      user!.addresses.push(address)
      return address
    },
  },
  {
    method: 'GET',
    path: '/admin/users',
    auth: true,
    admin: true,
    handler: () => store.users.map(sanitizeUser),
  },
]
