import type { RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { asRecord } from '../../utils/http.ts'

export const shippingRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/shipping/quote',
    handler: ({ body }) => {
      const input = asRecord(body)
      const zipCode = String(input.zipCode ?? '').replace(/\D/g, '')
      const subtotal = Number(input.subtotal ?? 0)

      assert(zipCode.length === 8, 422, 'CEP inválido')

      const isFree = subtotal >= 299

      return [
        {
          id: 'standard',
          name: 'Entrega padrão',
          price: isFree ? 0 : 24.9,
          deadlineDays: 7,
        },
        {
          id: 'express',
          name: 'Entrega expressa',
          price: isFree ? 14.9 : 39.9,
          deadlineDays: 3,
        },
      ]
    },
  },
]
