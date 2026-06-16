import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import './ProfilePage.css'

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Area do cliente</span>
          <h1>Minha conta</h1>
          <p>Gerencie seu acesso e seus dados quando estiver conectado.</p>
        </section>

        {isAuthenticated && user ? (
          <section className="profile-panel">
            <div>
              <span className="eyebrow">Dados da conta</span>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <strong>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</strong>
            </div>

            <Button variant="dark" onClick={logout}>
              Sair da conta
            </Button>
          </section>
        ) : (
          <section className="profile-empty">
            <h2>Entre para acessar sua conta.</h2>
            <p>Depois de entrar, suas informacoes reais de cliente vao aparecer aqui.</p>
            <div>
              <Link className="profile-action" to="/login">
                Entrar
              </Link>
              <Link className="profile-action profile-action--light" to="/cadastro">
                Cadastrar
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
