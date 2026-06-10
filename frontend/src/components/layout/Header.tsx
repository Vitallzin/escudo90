import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalogo', label: 'Times' },
  { to: '/catalogo?categoria=selecoes', label: 'Seleções' },
  { to: '/catalogo?categoria=retro', label: 'Retrô' },
  { to: '/catalogo?promocoes=true', label: 'Promoções' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="top-strip">
        <span>Frete grátis acima de R$ 299</span>
        <span>Compra segura | Troca fácil | Atendimento premium</span>
      </div>

      <div className="header-container">
        <Link className="brand" to="/">
          <span className="brand-mark">E90</span>
          <span>
            Escudo <strong>Noventa</strong>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive && item.to !== '/' ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-button" aria-label="Pesquisar">
            ⌕
          </button>
          <NavLink className="icon-button" to="/perfil" aria-label="Perfil do usuário">
            ♙
          </NavLink>
          <NavLink className="icon-button cart-button" to="/carrinho" aria-label="Carrinho">
            ◴
            <span>3</span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}
