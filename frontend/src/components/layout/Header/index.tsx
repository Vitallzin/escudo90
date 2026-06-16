import { ChevronDown, Heart, LogIn, Search, ShoppingBag, User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../../../assets/logo.webp'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import { useFavorites } from '../../../hooks/useFavorites'
import './Header.css'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/times', label: 'Times' },
  { to: '/selecoes', label: 'Seleções' },
  { to: '/promocoes', label: 'Promoções' },
]

export function Header() {
  const { totalCount } = useCart()
  const { totalFavorites } = useFavorites()
  const { user, isAuthenticated } = useAuth()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
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
            <div className="account-menu">
              <button
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="account-button"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                type="button"
              >
                <User aria-hidden="true" />
                <span>Login</span>
                <ChevronDown aria-hidden="true" className={isAccountMenuOpen ? 'rotate' : undefined} />
              </button>

              {isAccountMenuOpen && (
                <div className="account-dropdown" role="menu">
                  <Link onClick={() => setIsAccountMenuOpen(false)} role="menuitem" to="/login">
                    <LogIn aria-hidden="true" />
                    <span>Entrar</span>
                  </Link>
                  <Link onClick={() => setIsAccountMenuOpen(false)} role="menuitem" to="/cadastro">
                    <UserPlus aria-hidden="true" />
                    <span>Cadastrar</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          <NavLink className="favorite-action" to="/favoritos" aria-label="Abrir lista de desejos">
            <Heart aria-hidden="true" />
            <span>Favoritos</span>
            {isAuthenticated && totalFavorites > 0 && <strong>{totalFavorites}</strong>}
          </NavLink>

          <NavLink className="cart-action" to="/carrinho" aria-label="Abrir carrinho">
            <ShoppingBag aria-hidden="true" />
            <span>Carrinho</span>
            {isAuthenticated && totalCount > 0 && <strong>{totalCount}</strong>}
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
