export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getDiscountPercent(price: number, oldPrice?: number) {
  if (!oldPrice) {
    return null
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
