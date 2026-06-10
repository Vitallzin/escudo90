import { store } from '../../database/store.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'

export function getCoupon(code: string) {
  const coupon = store.coupons.find((item) => item.code.toUpperCase() === code.toUpperCase())
  assert(coupon, 404, 'Cupom não encontrado')
  assert(coupon.active, 422, 'Cupom inativo')
  assert(new Date(coupon.expiresAt).getTime() > Date.now(), 422, 'Cupom expirado')

  return coupon
}

export function createCoupon(input: Record<string, unknown>) {
  const coupon = {
    id: createId('cpn'),
    code: String(input.code ?? '').trim().toUpperCase(),
    description: String(input.description ?? ''),
    percent: Number(input.percent ?? 0),
    active: true,
    expiresAt: String(input.expiresAt ?? '2026-12-31T23:59:59.000Z'),
  }

  assert(coupon.code.length >= 4, 422, 'Código do cupom obrigatório')
  assert(coupon.percent > 0 && coupon.percent <= 80, 422, 'Percentual inválido')
  assert(!store.coupons.some((item) => item.code === coupon.code), 409, 'Cupom já existe')

  store.coupons.push(coupon)
  return coupon
}
