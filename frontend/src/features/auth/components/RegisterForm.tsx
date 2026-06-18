import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { AuthService, type RegisterPayload } from '../../../services/authService'
import { formatCpf, formatPhone, onlyDigits } from '../../../utils/inputMasks'
import './RegisterForm.css'

const initialForm: RegisterPayload = {
  name: '',
  email: '',
  phone: '',
  document: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
}

export function RegisterForm() {
  const { authenticate } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [message, setMessage] = useState('')

  const passwordStrength = useMemo(() => {
    let score = 0

    if (form.password.length >= 8) score += 1
    if (/[A-Z]/.test(form.password)) score += 1
    if (/[a-z]/.test(form.password)) score += 1
    if (/\d/.test(form.password)) score += 1

    return score
  }, [form.password])

  function updateField(field: keyof RegisterPayload, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const result = await AuthService.register({
        ...form,
        phone: onlyDigits(form.phone ?? ''),
        document: onlyDigits(form.document ?? ''),
      })
      authenticate({
        user: {
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          phone: result.user.phone,
          document: result.user.document,
        },
        token: result.token,
      })
      setStatus('success')
      setMessage('Cadastro criado com sucesso. Sua conta já está ativa para comprar.')
      setForm(initialForm)
      navigate('/')
    } catch (error) {
      setStatus('idle')
      setMessage(error instanceof Error ? error.message : 'Não foi possível criar sua conta')
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__grid">
        <label className="register-field register-field--wide">
          <span>Nome completo</span>
          <div>
            <UserRound aria-hidden="true" />
            <input
              autoComplete="name"
              name="name"
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Ex: Lucas Pereira"
              required
              type="text"
              value={form.name}
            />
          </div>
        </label>

        <label className="register-field register-field--wide">
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

        <label className="register-field">
          <span>Telefone</span>
          <div>
            <Phone aria-hidden="true" />
            <input
              autoComplete="tel"
              inputMode="tel"
              name="phone"
              onChange={(event) => updateField('phone', formatPhone(event.target.value))}
              placeholder="(11) 99999-9999"
              type="tel"
              value={form.phone}
            />
          </div>
        </label>

        <label className="register-field">
          <span>CPF</span>
          <div>
            <ShieldCheck aria-hidden="true" />
            <input
              inputMode="numeric"
              name="document"
              onChange={(event) => updateField('document', formatCpf(event.target.value))}
              placeholder="000.000.000-00"
              type="text"
              value={form.document}
            />
          </div>
        </label>

        <label className="register-field">
          <span>Senha</span>
          <div>
            <Lock aria-hidden="true" />
            <input
              autoComplete="new-password"
              name="password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              type={showPassword ? 'text' : 'password'}
              value={form.password}
            />
            <button
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="register-field__icon-button"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
        </label>

        <label className="register-field">
          <span>Confirmar senha</span>
          <div>
            <Lock aria-hidden="true" />
            <input
              autoComplete="new-password"
              name="confirmPassword"
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              placeholder="Repita sua senha"
              required
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
            />
          </div>
        </label>
      </div>

      <div className="password-meter" aria-label="Força da senha">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className={item < passwordStrength ? 'active' : undefined} />
        ))}
      </div>

      <label className="register-terms">
        <input
          checked={form.acceptTerms}
          name="acceptTerms"
          onChange={(event) => updateField('acceptTerms', event.target.checked)}
          required
          type="checkbox"
        />
        <span>Aceito os termos da loja, política de privacidade e comunicações sobre meu pedido.</span>
      </label>

      {message && <p className={status === 'success' ? 'register-message success' : 'register-message'}>{message}</p>}

      <button className="register-submit" disabled={status === 'loading'} type="submit">
        {status === 'loading' ? 'Criando conta...' : 'Criar minha conta'}
      </button>
    </form>
  )
}
