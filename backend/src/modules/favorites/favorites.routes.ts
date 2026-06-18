import type { RouteDefinition } from '../../types.ts'
import { sendNoContent } from '../../utils/http.ts'
import { addFavorite, listFavorites, removeFavorite } from './favorites.service.ts'

export const favoriteRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/favorites',
    auth: true,
    handler: ({ user }) => listFavorites(user!),
  },
  {
    method: 'POST',
    path: '/favorites/:productId',
    auth: true,
    handler: ({ user, params }) => addFavorite(user!, params.productId),
  },
  {
    method: 'DELETE',
    path: '/favorites/:productId',
    auth: true,
    handler: async ({ user, params, res }) => {
      await removeFavorite(user!, params.productId)
      sendNoContent(res)
    },
  },
]
