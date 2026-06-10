import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

const orders = [
  { id: '#EN90481', status: 'Em separação', date: '10 jun 2026', total: 'R$ 609,80' },
  { id: '#EN90392', status: 'Entregue', date: '28 mai 2026', total: 'R$ 319,90' },
  { id: '#EN90244', status: 'A caminho', date: '16 mai 2026', total: 'R$ 749,70' },
]

export function ProfilePage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Área do cliente</span>
          <h1>Minha conta</h1>
          <p>Pedidos em tempo real, favoritos, endereços, dados pessoais e segurança.</p>
        </section>

        <section className="account-layout">
          <aside className="account-sidebar">
            <strong>Marcos Oliveira</strong>
            <span>cliente premium</span>
            <a href="#pedidos">Pedidos</a>
            <a href="#favoritos">Favoritos</a>
            <a href="#enderecos">Endereços</a>
            <a href="#seguranca">Segurança</a>
          </aside>

          <div className="account-content">
            <div className="dashboard-grid">
              <article>
                <span>Pedidos</span>
                <strong>12</strong>
              </article>
              <article>
                <span>Favoritos</span>
                <strong>18</strong>
              </article>
              <article>
                <span>Cupons ativos</span>
                <strong>3</strong>
              </article>
            </div>

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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
