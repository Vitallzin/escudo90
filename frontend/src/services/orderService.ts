export type Order = {
  id: string
  status: string
  date: string
  total: string
}

const mockOrders: Order[] = [
  { id: '#EN90481', status: 'Em separação', date: '10 jun 2026', total: 'R$ 609,80' },
  { id: '#EN90392', status: 'Entregue', date: '28 mai 2026', total: 'R$ 319,90' },
  { id: '#EN90244', status: 'A caminho', date: '16 mai 2026', total: 'R$ 749,70' },
]

export const OrderService = {
  getOrders(): Order[] {
    return mockOrders
  },
}
