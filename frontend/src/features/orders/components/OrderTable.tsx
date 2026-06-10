import type { Order } from '../../../services/orderService'

type OrderTableProps = {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <section className="data-table" id="pedidos">
      <div className="table-header">
        <h2>Histórico de pedidos</h2>
        <span>Atualizado agora</span>
      </div>
      {orders.map((order) => (
        <div className="table-row" key={order.id}>
          <strong>{order.id}</strong>
          <span>{order.date}</span>
          <span>{order.status}</span>
          <strong>{order.total}</strong>
        </div>
      ))}
    </section>
  )
}
