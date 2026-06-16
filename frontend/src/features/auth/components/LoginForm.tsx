import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { AuthService, type LoginPayload } from '../../../services/authService'
import './LoginForm.css'

const initialForm: LoginPayload = {
  email: '',
  password: '',
}

export function LoginForm() {
  const { authenticate } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [message, setMessage] = useState('')

  function updateField(field: keyof LoginPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const result = await AuthService.login(form)
      authenticate({
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      })
      setStatus('success')
      setMessage('Entrada realizada com sucesso.')
      setForm(initialForm)
    } catch (error) {
      setStatus('idle')
      setMessage(error instanceof Error ? error.message : 'Nao foi possivel entrar')
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-field">
        <span>E-mail</span>
        <div>
          <Mail aria-hidden="true" />
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="voce@email.com"
            required
            type="email"
            value={form.email}
          />
        </div>
      </label>

      <label className="login-field">
        <span>Senha</span>
        <div>
          <Lock aria-hidden="true" />
          <input
            autoComplete="current-password"
            name="password"
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Sua senha"
            required
            type={showPassword ? 'text' : 'password'}
            value={form.password}
          />
          <button
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="login-field__icon-button"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
      </label>

      {message && <p className={status === 'success' ? 'login-message success' : 'login-message'}>{message}</p>}

      <button className="login-submit" disabled={status === 'loading'} type="submit">
        {status === 'loading' ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="login-register-link">
        Ainda nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  )
}
