import { store } from '../../database/store.ts'
import type { Payment, PaymentMethod, RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { asRecord } from '../../utils/http.ts'
import { createId } from '../../utils/id.ts'

export const paymentRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/payments/intent',
    auth: true,
    handler: ({ body, user }) => {
      const input = asRecord(body)
      const orderId = String(input.orderId ?? '')
      const method = String(input.method ?? 'credit_card') as PaymentMethod
      const order = store.orders.find((item) => item.id === orderId)

      assert(order, 404, 'Pedido não encontrado')
      assert(user!.role === 'admin' || order.userId === user!.id, 403, 'Você não pode pagar este pedido')

      const payment: Payment = {
        id: createId('pay'),
        orderId: order.id,
        method,
        status: method === 'pix' ? 'created' : 'approved',
        amount: order.total,
        provider: method === 'mercado_pago' ? 'Mercado Pago' : 'Escudo Pay',
        createdAt: new Date().toISOString(),
      }

      store.payments.push(payment)

      if (payment.status === 'approved') {
        order.status = 'paid'
      }

      return {
        payment,
        pixQrCode: method === 'pix' ? `000201-E90-${payment.id}` : undefined,
      }
    },
  },
  {
    method: 'POST',
    path: '/payments/webhook',
    handler: ({ body }) => {
      const input = asRecord(body)
      const payment = store.payments.find((item) => item.id === input.paymentId)

      assert(payment, 404, 'Pagamento não encontrado')

      payment.status = String(input.status ?? payment.status) as Payment['status']

      const order = store.orders.find((item) => item.id === payment.orderId)
      if (order && payment.status === 'approved') {
        order.status = 'paid'
      }

      return {
        received: true,
        payment,
      }
    },
  },
]
