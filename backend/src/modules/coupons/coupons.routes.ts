import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { asRecord } from '../../utils/http.ts'
import { createCoupon, getCoupon } from './coupons.service.ts'

export const couponRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/coupons/validate',
    handler: ({ url }) => {
      const code = url.searchParams.get('code') ?? ''
      return getCoupon(code)
    },
  },
  {
    method: 'GET',
    path: '/admin/coupons',
    auth: true,
    admin: true,
    handler: () => store.coupons,
  },
  {
    method: 'POST',
    path: '/admin/coupons',
    auth: true,
    admin: true,
    handler: ({ body }) => createCoupon(asRecord(body)),
  },
]
