import { createServer } from 'node:http'
import { env } from './config/env.ts'
import { adminRoutes } from './modules/admin/admin.routes.ts'
import { authRoutes } from './modules/auth/auth.routes.ts'
import { categoryRoutes } from './modules/categories/categories.routes.ts'
import { couponRoutes } from './modules/coupons/coupons.routes.ts'
import { favoriteRoutes } from './modules/favorites/favorites.routes.ts'
import { orderRoutes } from './modules/orders/orders.routes.ts'
import { paymentRoutes } from './modules/payments/payments.routes.ts'
import { productRoutes } from './modules/products/products.routes.ts'
import { reviewRoutes } from './modules/reviews/reviews.routes.ts'
import { shippingRoutes } from './modules/shipping/shipping.routes.ts'
import { userRoutes } from './modules/users/users.routes.ts'
import { applyCors } from './middleware/cors.ts'
import { handleError } from './middleware/error-handler.ts'
import { createRouter } from './router.ts'
import type { RouteDefinition } from './types.ts'

const routes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/health',
    handler: () => getHealthStatus(),
  },
  ...authRoutes,
  ...categoryRoutes,
  ...productRoutes,
  ...favoriteRoutes,
  ...reviewRoutes,
  ...couponRoutes,
  ...shippingRoutes,
  ...userRoutes,
  ...orderRoutes,
  ...paymentRoutes,
  ...adminRoutes,
]

const router = createRouter(routes)

export function getHealthStatus() {
  return {
    service: 'escudo-noventa-api',
    status: 'online',
    environment: env.nodeEnv,
    modules: [
      'auth',
      'users',
      'products',
      'categories',
      'orders',
      'payments',
      'coupons',
      'favorites',
      'reviews',
      'shipping',
      'admin',
    ],
  }
}

export function createApiServer() {
  return createServer(async (req, res) => {
    applyCors(req, res)

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    try {
      await router(req, res)
    } catch (error) {
      handleError(res, error)
    }
  })
}

export function listRoutes() {
  return routes.map((route) => `${route.method} ${route.path}`)
}
