import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'

export const categoryRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/categories',
    handler: () => store.categories.filter((category) => category.active),
  },
]
