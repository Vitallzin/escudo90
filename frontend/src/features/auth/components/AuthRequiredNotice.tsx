import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import './AuthRequiredNotice.css'

type AuthRequiredNoticeProps = {
  title?: string
  message?: string
  compact?: boolean
}

export function AuthRequiredNotice({
  title = 'Entre para continuar',
  message = 'Para usar esse recurso, você precisa acessar sua conta.',
  compact = false,
}: AuthRequiredNoticeProps) {
  return (
    <div className={compact ? 'auth-required auth-required--compact' : 'auth-required'}>
      <LockKeyhole aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      <Link to="/login">Entrar</Link>
    </div>
  )
}
