import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { roundMoney } from '../../utils/money.ts'

export const adminRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/admin/dashboard',
    auth: true,
    admin: true,
    handler: () => {
      const revenue = store.orders
        .filter((order) => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0)
      const lowStock = store.products.filter((product) => product.stock <= 10)

      return {
        revenue: roundMoney(revenue),
        orders: store.orders.length,
        customers: store.users.filter((user) => user.role === 'customer').length,
        products: store.products.length,
        lowStock,
        topProducts: store.products
          .slice()
          .sort((a, b) => b.reviewsCount - a.reviewsCount)
          .slice(0, 5),
      }
    },
  },
]
