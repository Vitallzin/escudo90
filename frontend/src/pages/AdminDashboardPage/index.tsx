import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { DashboardMetrics } from '../../features/dashboard'
import './AdminDashboardPage.css'

const adminRows = [
  ['Brasil Retro 1970', '18 un.', 'R$ 18.844', 'Ativo'],
  ['Boca Juniors Home', '11 un.', 'R$ 11.516', 'Estoque baixo'],
  ['Milan Champions Night', '8 un.', 'R$ 9.998', 'Limitado'],
]

export function AdminDashboardPage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Painel administrativo</span>
          <h1>Operação da loja</h1>
          <p>Produtos, categorias, estoque, pedidos, usuários, cupons e avaliações.</p>
        </section>

        <section className="admin-layout">
          <aside className="admin-sidebar">
            <strong>Administração</strong>
            <a href="#dashboard">Dashboard</a>
            <a href="#produtos">Produtos</a>
            <a href="#pedidos">Pedidos</a>
            <a href="#usuarios">Usuários</a>
            <a href="#cupons">Cupons</a>
            <a href="#config">Configurações</a>
          </aside>

          <div className="admin-content">
            <DashboardMetrics />

            <div className="chart-panel">
              <div className="chart-header">
                <h2>Desempenho da loja</h2>
                <span>Últimos 7 dias</span>
              </div>
              <div className="bar-chart" aria-label="Gráfico de vendas">
                {[45, 62, 58, 74, 68, 82, 91].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <section className="data-table" id="produtos">
              <div className="table-header">
                <h2>Produtos importantes</h2>
                <span>Estoque e vendas</span>
              </div>
              {adminRows.map((row) => (
                <div className="table-row" key={row[0]}>
                  {row.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
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
