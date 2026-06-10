import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { FavoritesPreview } from '../../features/favorites'
import { OrderTable } from '../../features/orders'
import { ProfileSidebar, ProfileStats } from '../../features/profile'
import { OrderService } from '../../services/orderService'
import './ProfilePage.css'

export function ProfilePage() {
  const orders = OrderService.getOrders()

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
          <ProfileSidebar />

          <div className="account-content">
            <ProfileStats />
            <OrderTable orders={orders} />
            <FavoritesPreview />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
