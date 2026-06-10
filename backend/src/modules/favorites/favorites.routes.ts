import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { sendNoContent } from '../../utils/http.ts'

export const favoriteRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/favorites',
    auth: true,
    handler: ({ user }) =>
      store.products.filter((product) => user!.favorites.includes(product.id)),
  },
  {
    method: 'POST',
    path: '/favorites/:productId',
    auth: true,
    handler: ({ user, params }) => {
      const product = store.products.find((item) => item.id === params.productId)
      assert(product, 404, 'Produto não encontrado')

      if (!user!.favorites.includes(product.id)) {
        user!.favorites.push(product.id)
      }

      return {
        favorites: user!.favorites,
      }
    },
  },
  {
    method: 'DELETE',
    path: '/favorites/:productId',
    auth: true,
    handler: ({ user, params, res }) => {
      user!.favorites = user!.favorites.filter((id) => id !== params.productId)
      sendNoContent(res)
    },
  },
]
