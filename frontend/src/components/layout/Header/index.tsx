import { ChevronDown, Heart, LogIn, LogOut, Search, Settings, ShoppingBag, User, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const { user, isAuthenticated, logout } = useAuth()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isFavoriteBumping, setIsFavoriteBumping] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const previousFavorites = useRef(totalFavorites)
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}`

  useEffect(() => {
    if (previousFavorites.current === totalFavorites) {
      return
    }

    previousFavorites.current = totalFavorites

    if (!isAuthenticated) {
      return
    }

    setIsFavoriteBumping(true)
    const timeout = window.setTimeout(() => setIsFavoriteBumping(false), 420)

    return () => window.clearTimeout(timeout)
  }, [isAuthenticated, totalFavorites])

  function isNavActive(path: string) {
    if (path === '/') {
      return location.pathname === '/'
    }

    return currentPath === path
  }

  function getHeaderName(name?: string) {
    return name?.trim().split(/\s+/).slice(0, 2).join(' ') ?? ''
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = searchTerm.trim()

    navigate(term ? `/buscar?q=${encodeURIComponent(term)}` : '/buscar')
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

        <form className="search-form" role="search" onSubmit={handleSearch}>
          <input
            aria-label="Pesquisar produtos"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Pesquisar camisas, times ou seleções"
            type="search"
            value={searchTerm}
          />
          <button type="submit" aria-label="Pesquisar">
            <Search aria-hidden="true" />
          </button>
        </form>

        <div className="header-actions">
          <div className="account-menu">
            <button
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="menu"
              className="account-button"
              onClick={() => setIsAccountMenuOpen((current) => !current)}
              type="button"
            >
              <User aria-hidden="true" />
              <span>{isAuthenticated ? getHeaderName(user?.name) : 'Login'}</span>
              <ChevronDown aria-hidden="true" className={isAccountMenuOpen ? 'rotate' : undefined} />
            </button>

            {isAccountMenuOpen && (
              <div className="account-dropdown" role="menu">
                {isAuthenticated ? (
                  <>
                    <Link onClick={() => setIsAccountMenuOpen(false)} role="menuitem" to="/perfil">
                      <Settings aria-hidden="true" />
                      <span>Configuração</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true)
                        setIsAccountMenuOpen(false)
                      }}
                      role="menuitem"
                      type="button"
                    >
                      <LogOut aria-hidden="true" />
                      <span>Sair da conta</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link onClick={() => setIsAccountMenuOpen(false)} role="menuitem" to="/login">
                      <LogIn aria-hidden="true" />
                      <span>Entrar</span>
                    </Link>
                    <Link onClick={() => setIsAccountMenuOpen(false)} role="menuitem" to="/cadastro">
                      <UserPlus aria-hidden="true" />
                      <span>Cadastrar</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <NavLink
            className={isFavoriteBumping ? 'favorite-action favorite-action--bump' : 'favorite-action'}
            to="/carrinho#favoritos"
            aria-label="Abrir lista de desejos"
          >
            <Heart aria-hidden="true" />
            <span>Favoritos</span>
            {isAuthenticated && totalFavorites > 0 && <strong key={totalFavorites}>{totalFavorites}</strong>}
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

      {showLogoutConfirm && (
        <div className="logout-modal-backdrop" role="presentation">
          <section className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="logout-modal__icon">
              <LogOut aria-hidden="true" />
            </div>
            <h2 id="logout-title">Sair da conta?</h2>
            <p>Você será desconectado neste navegador. Seus favoritos e carrinho continuam protegidos pela conta.</p>
            <div className="logout-modal__actions">
              <button className="logout-modal__cancel" onClick={() => setShowLogoutConfirm(false)} type="button">
                Continuar logado
              </button>
              <button
                className="logout-modal__confirm"
                onClick={() => {
                  logout()
                  setShowLogoutConfirm(false)
                }}
                type="button"
              >
                Sair da conta
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  )
}
