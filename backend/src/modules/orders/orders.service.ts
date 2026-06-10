import { store } from '../../database/store.ts'
import type { Address, CartItem, Order, PaymentMethod } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'
import { roundMoney } from '../../utils/money.ts'
import { getCoupon } from '../coupons/coupons.service.ts'

export function calculateOrder(items: CartItem[], couponCode?: string) {
  assert(items.length > 0, 422, 'Pedido precisa ter pelo menos um item')

  const subtotal = items.reduce((sum, item) => {
    const product = store.products.find((candidate) => candidate.id === item.productId)
    assert(product, 404, `Produto ${item.productId} não encontrado`)
    assert(product.stock >= item.quantity, 422, `Estoque insuficiente para ${product.name}`)
    assert(product.sizes.includes(item.size), 422, `Tamanho indisponível para ${product.name}`)

    return sum + product.price * item.quantity
  }, 0)
  const coupon = couponCode ? getCoupon(couponCode) : null
  const discount = coupon ? subtotal * (coupon.percent / 100) : 0
  const shipping = subtotal - discount >= 299 ? 0 : 24.9

  return {
    subtotal: roundMoney(subtotal),
    discount: roundMoney(discount),
    shipping: roundMoney(shipping),
    total: roundMoney(subtotal - discount + shipping),
  }
}

export function createOrder(input: Record<string, unknown>, userId: string) {
  const items = Array.isArray(input.items) ? (input.items as CartItem[]) : []
  const couponCode = input.couponCode ? String(input.couponCode) : undefined
  const shippingAddress = input.shippingAddress as Address
  const paymentMethod = String(input.paymentMethod ?? 'credit_card') as PaymentMethod
  const totals = calculateOrder(items, couponCode)

  assert(shippingAddress?.zipCode, 422, 'Endereço de entrega obrigatório')

  for (const item of items) {
    const product = store.products.find((candidate) => candidate.id === item.productId)
    if (product) {
      product.stock -= item.quantity
    }
  }

  const order: Order = {
    id: createId('ord'),
    userId,
    items,
    couponCode,
    ...totals,
    shippingAddress,
    paymentMethod,
    status: 'pending_payment',
    createdAt: new Date().toISOString(),
  }

  store.orders.push(order)
  return order
}

export function getOrder(id: string, userId: string, isAdmin: boolean) {
  const order = store.orders.find((item) => item.id === id)
  assert(order, 404, 'Pedido não encontrado')
  assert(isAdmin || order.userId === userId, 403, 'Você não pode acessar este pedido')

  return order
}
