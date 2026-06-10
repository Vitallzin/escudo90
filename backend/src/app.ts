type HealthStatus = {
  service: string
  status: 'online'
  modules: string[]
}

export function getHealthStatus(): HealthStatus {
  return {
    service: 'loja-camisas-api',
    status: 'online',
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
    ],
  }
}
