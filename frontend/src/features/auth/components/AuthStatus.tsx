import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../hooks/useAuth'

export function AuthStatus() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div className="auth-status">
      <div>
        <span>Sessão</span>
        <strong>{isAuthenticated ? user?.name : 'Visitante'}</strong>
      </div>
      <Button size="small" variant={isAuthenticated ? 'ghost' : 'dark'} onClick={isAuthenticated ? logout : login}>
        {isAuthenticated ? 'Sair' : 'Entrar'}
      </Button>
    </div>
  )
}
