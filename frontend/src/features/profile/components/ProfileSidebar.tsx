import { AuthStatus } from '../../auth'

export function ProfileSidebar() {
  return (
    <aside className="account-sidebar">
      <AuthStatus />
      <a href="#pedidos">Pedidos</a>
      <a href="#favoritos">Favoritos</a>
      <a href="#enderecos">Endereços</a>
      <a href="#seguranca">Segurança</a>
    </aside>
  )
}
