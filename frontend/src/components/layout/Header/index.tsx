import { Search, ShoppingBag, User } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../../../assets/logo.webp'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import './Header.css'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/times', label: 'Times' },
  { to: '/selecoes', label: 'Seleções' },
  { to: '/promocoes', label: 'Promoções' },
]

export function Header() {
  const { totalCount } = useCart()
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const currentPath = `${location.pathname}${location.search}`

  function isNavActive(path: string) {
    if (path === '/') {
      return location.pathname === '/'
    }

    return currentPath === path
  }

  return (
    <header className="site-header">
      <div className="header-main">
        <Link className="brand" to="/" aria-label="Ir para o início">
          <img src={logo} alt="Escudo Noventa" />
          <span>
            ESCUDO<strong>NOVENTA</strong>
          </span>
        </Link>

        <form className="search-form" role="search">
          <input type="search" placeholder="Pesquisar camisas, times ou seleções" aria-label="Pesquisar produtos" />
          <button type="submit" aria-label="Pesquisar">
            <Search aria-hidden="true" />
          </button>
        </form>

        <div className="header-actions">
          {isAuthenticated ? (
            <NavLink className="account-button" to="/perfil" aria-label="Abrir minha conta">
              <User aria-hidden="true" />
              <span>{user?.name}</span>
            </NavLink>
          ) : (
            <NavLink className="account-button" to="/cadastro" aria-label="Criar conta ou entrar">
              <User aria-hidden="true" />
              <span>Login</span>
            </NavLink>
          )}

          <NavLink className="cart-action" to="/carrinho" aria-label="Abrir carrinho">
            <ShoppingBag aria-hidden="true" />
            <span>Carrinho</span>
            {totalCount > 0 && <strong>{totalCount}</strong>}
          </NavLink>
        </div>
      </div>

      <nav className="nav-links" aria-label="Navegação principal">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className={isNavActive(item.to) ? 'active' : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
