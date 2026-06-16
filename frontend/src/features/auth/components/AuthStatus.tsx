import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../hooks/useAuth'

export function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="auth-status">
      <div>
        <span>Sessão</span>
        <strong>{isAuthenticated ? user?.name : 'Visitante'}</strong>
      </div>
      {isAuthenticated && (
        <Button size="small" variant="ghost" onClick={logout}>
          Sair
        </Button>
      )}
    </div>
  )
}
