import { store } from '../../database/store.ts'
import type { OrderStatus, RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { asRecord } from '../../utils/http.ts'
import { createOrder, getOrder } from './orders.service.ts'

export const orderRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/orders',
    auth: true,
    handler: ({ user }) =>
      user!.role === 'admin' ? store.orders : store.orders.filter((order) => order.userId === user!.id),
  },
  {
    method: 'GET',
    path: '/orders/:id',
    auth: true,
    handler: ({ params, user }) => getOrder(params.id, user!.id, user!.role === 'admin'),
  },
  {
    method: 'POST',
    path: '/orders',
    auth: true,
    handler: ({ body, user }) => createOrder(asRecord(body), user!.id),
  },
  {
    method: 'PATCH',
    path: '/admin/orders/:id/status',
    auth: true,
    admin: true,
    handler: ({ params, body }) => {
      const order = store.orders.find((item) => item.id === params.id)
      const status = String(asRecord(body).status ?? '') as OrderStatus
      const allowedStatuses: OrderStatus[] = [
        'pending_payment',
        'paid',
        'separating',
        'shipped',
        'delivered',
        'cancelled',
      ]

      assert(order, 404, 'Pedido não encontrado')
      assert(allowedStatuses.includes(status), 422, 'Status inválido')

      order.status = status
      order.trackingCode = status === 'shipped' ? `EN${Date.now().toString().slice(-8)}` : order.trackingCode
      return order
    },
  },
]
