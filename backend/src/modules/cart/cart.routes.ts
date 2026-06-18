import type { RouteDefinition } from '../../types.ts'
import { asRecord, sendNoContent } from '../../utils/http.ts'
import { addCartItem, clearCart, getCart, removeCartItem } from './cart.service.ts'

export const cartRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/cart',
    auth: true,
    handler: ({ user }) => getCart(user!),
  },
  {
    method: 'POST',
    path: '/cart/items',
    auth: true,
    handler: ({ user, body }) => addCartItem(user!, asRecord(body)),
  },
  {
    method: 'DELETE',
    path: '/cart/items/:productId/:size',
    auth: true,
    handler: async ({ user, params, res }) => {
      await removeCartItem(user!, params.productId, params.size)
      sendNoContent(res)
    },
  },
  {
    method: 'DELETE',
    path: '/cart',
    auth: true,
    handler: async ({ user, res }) => {
      await clearCart(user!)
      sendNoContent(res)
    },
  },
]
