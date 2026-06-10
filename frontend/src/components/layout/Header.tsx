import { Link, NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link className="brand" to="/">
          Escudo <span className="brand-yellow">Noventa</span>
        </Link>
        <nav className="nav-links" aria-label="Navegação principal">
          <NavLink to="/catalogo" className={({ isActive }) => isActive ? 'active' : ''}>
            Coleções
          </NavLink>
          <Link to="/carrinho" className="cart-link">
            <span className="icon">🛒</span>
            <span className="cart-count">0</span>
          </Link>
          <button className="search-button" aria-label="Pesquisar">
            <span className="icon">🔍</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
