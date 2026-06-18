import {
  Bell,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  SlidersHorizontal,
  UserRound,
  Pencil,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { useAddresses } from '../../hooks/useAddresses'
import { useAuth } from '../../hooks/useAuth'
import type { Address } from '../../types/address'
import { emptyAddressDraft, type AddressDraft } from '../../types/address'
import { formatCpf, formatPhone } from '../../utils/inputMasks'
import './ProfilePage.css'

const menuItems = [
  { id: 'dados', label: 'Dados pessoais', icon: UserRound },
  { id: 'seguranca', label: 'Segurança', icon: LockKeyhole },
  { id: 'enderecos', label: 'Endereços', icon: MapPin },
  { id: 'preferencias', label: 'Preferências', icon: SlidersHorizontal },
]

type ViaCepResponse = {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

function getZipCodeDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
}

function formatZipCode(value: string) {
  const digits = getZipCodeDigits(value)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function ProfilePage() {
  const { user, token, isAuthenticated, authenticate, logout } = useAuth()
  const { addresses, addAddress, removeAddress, setPrimaryAddress, updateAddress } = useAddresses()
  const [activeSection, setActiveSection] = useState('dados')
  const [canEditProfile, setCanEditProfile] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ? formatPhone(user.phone) : '')
  const [cpf, setCpf] = useState(user?.document ? formatCpf(user.document) : '')
  const [editPassword, setEditPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true)
  const [trustedDeviceEnabled, setTrustedDeviceEnabled] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft)
  const [zipCodeError, setZipCodeError] = useState('')
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false)
  const [addressToRemove, setAddressToRemove] = useState<Address | null>(null)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (!isAddingAddress) {
      return
    }

    const zipCode = getZipCodeDigits(addressDraft.zipCode)

    if (zipCode.length < 8) {
      return
    }

    const controller = new AbortController()

    async function loadAddressFromZipCode() {
      try {
        setIsLoadingZipCode(true)
        setZipCodeError('')

        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`, {
          signal: controller.signal,
        })
        const address = (await response.json()) as ViaCepResponse

        if (!response.ok || address.erro) {
          setZipCodeError('CEP nao encontrado. Confira o numero informado.')
          return
        }

        setAddressDraft((currentDraft) => ({
          ...currentDraft,
          street: address.logradouro ?? currentDraft.street,
          district: address.bairro ?? currentDraft.district,
          city: address.localidade ?? currentDraft.city,
          state: address.uf ?? currentDraft.state,
        }))
      } catch {
        if (!controller.signal.aborted) {
          setZipCodeError('Nao foi possivel validar este CEP agora. Tente novamente.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingZipCode(false)
        }
      }
    }

    const timeout = window.setTimeout(() => {
      void loadAddressFromZipCode()
    }, 250)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [addressDraft.zipCode, isAddingAddress])

  function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user || !token) {
      return
    }

    authenticate({
      token,
      user: {
        ...user,
        name: name.trim() || user.name,
        phone,
        document: cpf,
      },
    })
    setSaveMessage('Alterações salvas nesta sessão.')
    setActiveSection('dados')
    setCanEditProfile(false)
    setEditPassword('')
  }

  function requestProfileEdit() {
    setActiveSection('editar-dados')
    setCanEditProfile(false)
    setEditPassword('')
    setSaveMessage('')
  }

  function handleUnlockProfileEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editPassword.trim()) {
      setSaveMessage('Digite sua senha para continuar.')
      return
    }

    setCanEditProfile(true)
    setSaveMessage('')
  }

  function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setSaveMessage('Solicitação de redefinição registrada nesta sessão.')
  }

  function confirmLogout() {
    setShowLogoutConfirm(true)
  }

  function updateAddressDraft(field: keyof AddressDraft, value: string) {
    if (field === 'zipCode') {
      setZipCodeError('')
      setIsLoadingZipCode(false)
    }

    setAddressDraft((currentDraft) => ({
      ...currentDraft,
      [field]: field === 'state' ? value.toUpperCase().slice(0, 2) : field === 'zipCode' ? formatZipCode(value) : value,
    }))
  }

  function resetAddressForm() {
    setAddressDraft(emptyAddressDraft)
    setEditingAddressId(null)
    setIsAddingAddress(false)
    setZipCodeError('')
    setIsLoadingZipCode(false)
  }

  function startNewAddress() {
    setAddressDraft(emptyAddressDraft)
    setEditingAddressId(null)
    setZipCodeError('')
    setIsLoadingZipCode(false)
    setIsAddingAddress(true)
  }

  function startEditAddress(address: Address) {
    setAddressDraft({
      label: address.label,
      zipCode: address.zipCode,
      street: address.street,
      number: address.number,
      complement: address.complement,
      district: address.district,
      city: address.city,
      state: address.state,
    })
    setEditingAddressId(address.id)
    setZipCodeError('')
    setIsLoadingZipCode(false)
    setIsAddingAddress(true)
  }

  function handleSaveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (getZipCodeDigits(addressDraft.zipCode).length !== 8) {
      setZipCodeError('Informe um CEP valido com 8 digitos.')
      return
    }

    if (isLoadingZipCode || zipCodeError) {
      return
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, addressDraft)
    } else {
      addAddress({
        ...addressDraft,
        isPrimary: addresses.length === 0,
      })
    }

    resetAddressForm()
  }

  function confirmRemoveAddress() {
    if (!addressToRemove) {
      return
    }

    removeAddress(addressToRemove.id)
    setAddressToRemove(null)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="app-shell">
        <Header />

        <main>
          <section className="account-access">
            <div>
              <span className="eyebrow">Área do cliente</span>
              <h1>Entre para gerenciar sua conta.</h1>
              <p>Acesse seus dados, segurança, endereços e preferências em um painel único.</p>
            </div>

            <div className="account-access__actions">
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro">Criar conta</Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="account-topbar">
          <div>
            <span className="eyebrow">Área do cliente</span>
            <h1>Configurações da conta</h1>
            <p>Controle seus dados, acessos e preferências da loja em um só lugar.</p>
          </div>

          <div className="account-avatar">
            <span>{getInitials(user.name)}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</small>
            </div>
          </div>
        </section>

        <section className="account-shell">
          <aside className="account-nav" aria-label="Configurações da conta">
            {menuItems.map((item) => (
              <button
                className={activeSection === item.id ? 'active' : undefined}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                type="button"
              >
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}

            <button className="logout-item" onClick={confirmLogout} type="button">
              <LogOut aria-hidden="true" />
              <span>Sair da conta</span>
            </button>
          </aside>

          <div className="account-sections">
            {activeSection === 'dados' && (
              <section className="settings-panel settings-panel--animated" key="dados">
                <div className="settings-panel__header">
                  <div>
                    <h2>Dados pessoais</h2>
                    <p>Confira seus dados principais e altere apenas quando precisar atualizar alguma informação.</p>
                  </div>
                  <ShieldCheck aria-hidden="true" />
                </div>

                <div className="profile-summary">
                  <article>
                    <span>Nome</span>
                    <strong>{user.name}</strong>
                  </article>
                  <article>
                    <span>E-mail</span>
                    <strong>{user.email}</strong>
                  </article>
                  <article>
                    <span>Telefone</span>
                    <strong>{phone || user.phone || 'Não informado'}</strong>
                  </article>
                </div>

                <div className="settings-actions">
                  <Button onClick={requestProfileEdit}>Alterar dados pessoais</Button>
                </div>
              </section>
            )}

            {activeSection === 'editar-dados' && (
              <section className="settings-panel settings-panel--animated" key="editar-dados">
                <div className="settings-panel__header">
                  <div>
                    <h2>Alterar dados pessoais</h2>
                    <p>Por segurança, confirme sua senha antes de editar informações da conta.</p>
                  </div>
                  <LockKeyhole aria-hidden="true" />
                </div>

                {!canEditProfile ? (
                  <form className="profile-unlock settings-step" onSubmit={handleUnlockProfileEdit}>
                    <label>
                      <span>Senha da conta</span>
                      <input
                        autoComplete="current-password"
                        onChange={(event) => setEditPassword(event.target.value)}
                        placeholder="Digite sua senha"
                        type="password"
                        value={editPassword}
                      />
                    </label>

                    {saveMessage && <p className="settings-message">{saveMessage}</p>}

                    <div className="settings-actions">
                      <Button type="submit">Continuar</Button>
                      <Button variant="ghost" onClick={() => setActiveSection('dados')}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form className="settings-form settings-step" onSubmit={handleSaveProfile}>
                    <label>
                      <span>Nome completo</span>
                      <input value={name} onChange={(event) => setName(event.target.value)} />
                    </label>

                    <label>
                      <span>E-mail</span>
                      <input disabled value={email} />
                    </label>

                    <label>
                      <span>Telefone</span>
                      <input
                        inputMode="tel"
                        onChange={(event) => setPhone(formatPhone(event.target.value))}
                        placeholder="Adicione um telefone"
                        value={phone}
                      />
                    </label>

                    <label>
                      <span>CPF</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setCpf(formatCpf(event.target.value))}
                        placeholder="Adicione um CPF"
                        value={cpf}
                      />
                    </label>

                    {saveMessage && <p className="settings-message">{saveMessage}</p>}

                    <div className="settings-actions">
                      <Button type="submit">Salvar alterações</Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setActiveSection('dados')
                          setCanEditProfile(false)
                          setName(user.name)
                          setPhone(user.phone ? formatPhone(user.phone) : '')
                          setCpf(user.document ? formatCpf(user.document) : '')
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            )}

            {activeSection === 'seguranca' && (
              <section className="settings-panel settings-panel--animated" key="seguranca">
                <div className="settings-panel__header">
                  <div>
                    <h2>Segurança</h2>
                    <p>Gerencie senha, sessão ativa e proteção da sua conta.</p>
                  </div>
                  <LockKeyhole aria-hidden="true" />
                </div>

                <div className="security-list">
                  <article>
                    <Mail aria-hidden="true" />
                    <div>
                      <strong>E-mail de acesso</strong>
                      <span>{user.email}</span>
                    </div>
                  </article>

                  <article>
                    <ShieldCheck aria-hidden="true" />
                    <div>
                      <strong>Sessão persistente</strong>
                      <span>Sua conta continua ativa neste navegador até você sair.</span>
                    </div>
                  </article>
                </div>

                <div className="security-controls">
                  <label>
                    <input
                      checked={twoFactorEnabled}
                      onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong>Verificação em duas etapas</strong>
                      <small>Adicionar uma segunda confirmação ao entrar na conta.</small>
                    </span>
                  </label>

                  <label>
                    <input
                      checked={loginAlertsEnabled}
                      onChange={(event) => setLoginAlertsEnabled(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong>Alertas de acesso</strong>
                      <small>Receber aviso quando houver entrada em um novo dispositivo.</small>
                    </span>
                  </label>

                  <label>
                    <input
                      checked={trustedDeviceEnabled}
                      onChange={(event) => setTrustedDeviceEnabled(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong>Dispositivo confiavel</strong>
                      <small>Manter este navegador reconhecido para próximos acessos.</small>
                    </span>
                    <Smartphone aria-hidden="true" />
                  </label>
                </div>

                <form className="password-reset" onSubmit={handlePasswordReset}>
                  <div>
                    <h3>Redefinir senha</h3>
                    <p>Atualize sua senha usando uma combinação segura de letras e números.</p>
                  </div>

                  <label>
                    <span>Senha atual</span>
                    <input
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Digite sua senha atual"
                      type="password"
                      value={currentPassword}
                    />
                  </label>

                  <label>
                    <span>Nova senha</span>
                    <input
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Minimo 8 caracteres"
                      type="password"
                      value={newPassword}
                    />
                  </label>

                  <label>
                    <span>Confirmar nova senha</span>
                    <input
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repita a nova senha"
                      type="password"
                      value={confirmPassword}
                    />
                  </label>

                  <Button type="submit">Redefinir senha</Button>
                </form>
              </section>
            )}

            {activeSection === 'enderecos' && (
              <section className="settings-panel settings-panel--animated" key="enderecos">
                <div className="settings-panel__header">
                  <div>
                    <h2>Endereços</h2>
                    <p>Prepare endereços de entrega para acelerar suas próximas compras.</p>
                  </div>
                  <Home aria-hidden="true" />
                </div>

                <div className="address-manager">
                  {addresses.length === 0 && !isAddingAddress && (
                    <div className="address-empty">
                      <MapPin aria-hidden="true" />
                      <h3>Nenhum endereço salvo ainda</h3>
                      <p>Adicione um endereço agora para deixar a entrega mais rápida no checkout.</p>
                      <Button onClick={startNewAddress}>
                        <Plus aria-hidden="true" />
                        Adicionar endereço
                      </Button>
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <>
                      <div className="address-toolbar">
                        <div>
                          <strong>{addresses.length} endereço{addresses.length > 1 ? 's' : ''} salvo{addresses.length > 1 ? 's' : ''}</strong>
                          <span>O endereço principal será selecionado automaticamente na entrega.</span>
                        </div>
                        <Button onClick={startNewAddress}>
                          <Plus aria-hidden="true" />
                          Novo endereço
                        </Button>
                      </div>

                      <div className="address-list">
                        {addresses.map((address) => (
                          <article className={address.isPrimary ? 'address-card address-card--primary' : 'address-card'} key={address.id}>
                            <div className="address-card__main">
                              <div>
                                <strong>{address.label}</strong>
                                <span>
                                  {address.street}, {address.number}
                                </span>
                                <small>
                                  {address.district} - {address.city}/{address.state}
                                </small>
                              </div>

                              {address.isPrimary && (
                                <span className="address-badge">
                                  <Star aria-hidden="true" />
                                  Principal
                                </span>
                              )}
                            </div>

                            {address.complement && <p>{address.complement}</p>}

                            <div className="address-card__actions">
                              <button onClick={() => startEditAddress(address)} type="button">
                                <Pencil aria-hidden="true" />
                                Editar
                              </button>
                              {!address.isPrimary && (
                                <button onClick={() => setPrimaryAddress(address.id)} type="button">
                                  Tornar principal
                                </button>
                              )}
                              <button className="danger-link" onClick={() => setAddressToRemove(address)} type="button">
                                <Trash2 aria-hidden="true" />
                                Remover
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  )}

                  {isAddingAddress && (
                    <form className="address-form settings-step" onSubmit={handleSaveAddress}>
                      <div className="address-form__header">
                        <div>
                          <h3>{editingAddressId ? 'Editar endereço' : 'Novo endereço'}</h3>
                          <p>Use um nome fácil de reconhecer, como Casa, Trabalho ou Presente.</p>
                        </div>
                      </div>

                      <label>
                        <span>Nome do endereço</span>
                        <input
                          onChange={(event) => updateAddressDraft('label', event.target.value)}
                          placeholder="Casa, trabalho, presente..."
                          required
                          value={addressDraft.label}
                        />
                      </label>

                      <label>
                        <span>CEP</span>
                        <input
                          inputMode="numeric"
                          onChange={(event) => updateAddressDraft('zipCode', event.target.value)}
                          placeholder="00000-000"
                          required
                          value={addressDraft.zipCode}
                        />
                        {isLoadingZipCode && <small className="address-field-hint">Buscando endereÃ§o...</small>}
                        {zipCodeError && <small className="address-field-error">{zipCodeError}</small>}
                      </label>

                      <label>
                        <span>Rua ou avenida</span>
                        <input
                          onChange={(event) => updateAddressDraft('street', event.target.value)}
                          placeholder="Rua das Camisas"
                          required
                          value={addressDraft.street}
                        />
                      </label>

                      <label>
                        <span>Número</span>
                        <input
                          onChange={(event) => updateAddressDraft('number', event.target.value)}
                          placeholder="123"
                          required
                          value={addressDraft.number}
                        />
                      </label>

                      <label>
                        <span>Complemento</span>
                        <input
                          onChange={(event) => updateAddressDraft('complement', event.target.value)}
                          placeholder="Apartamento, bloco, referencia"
                          value={addressDraft.complement}
                        />
                      </label>

                      <label>
                        <span>Bairro</span>
                        <input
                          onChange={(event) => updateAddressDraft('district', event.target.value)}
                          placeholder="Centro"
                          required
                          value={addressDraft.district}
                        />
                      </label>

                      <label>
                        <span>Cidade</span>
                        <input
                          onChange={(event) => updateAddressDraft('city', event.target.value)}
                          placeholder="Recife"
                          required
                          value={addressDraft.city}
                        />
                      </label>

                      <label>
                        <span>UF</span>
                        <input
                          onChange={(event) => updateAddressDraft('state', event.target.value)}
                          placeholder="PE"
                          required
                          value={addressDraft.state}
                        />
                      </label>

                      <div className="settings-actions">
                        <Button type="submit">{editingAddressId ? 'Salvar alterações' : 'Salvar endereço'}</Button>
                        <Button
                          variant="ghost"
                          onClick={resetAddressForm}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'preferencias' && (
              <section className="settings-panel settings-panel--animated" key="preferencias">
                <div className="settings-panel__header">
                  <div>
                    <h2>Preferências</h2>
                    <p>Escolha como a loja deve se comunicar com você.</p>
                  </div>
                  <Bell aria-hidden="true" />
                </div>

                <div className="preference-list">
                  <label>
                    <input
                      checked={orderUpdates}
                      onChange={(event) => setOrderUpdates(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong>Atualizações de pedido</strong>
                      <small>Receber avisos sobre pagamento, envio e entrega.</small>
                    </span>
                  </label>

                  <label>
                    <input
                      checked={newsletter}
                      onChange={(event) => setNewsletter(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong>Ofertas e lançamentos</strong>
                      <small>Receber novidades de camisas, seleções e promoções.</small>
                    </span>
                  </label>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      {showLogoutConfirm && (
        <div className="account-modal-backdrop" role="presentation">
          <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-logout-title">
            <div className="account-modal__icon">
              <LogOut aria-hidden="true" />
            </div>
            <h2 id="account-logout-title">Sair da conta?</h2>
            <p>Você será desconectado deste navegador. Para comprar, favoritar ou acessar o carrinho, será preciso entrar novamente.</p>
            <div className="account-modal__actions">
              <button className="account-modal__cancel" onClick={() => setShowLogoutConfirm(false)} type="button">
                Continuar logado
              </button>
              <button
                className="account-modal__confirm"
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

      {addressToRemove && (
        <div className="account-modal-backdrop" role="presentation">
          <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-remove-address-title">
            <div className="account-modal__icon account-modal__icon--danger">
              <Trash2 aria-hidden="true" />
            </div>
            <h2 id="account-remove-address-title">Remover endereço?</h2>
            <p>
              O endereço "{addressToRemove.label}" não aparecerá mais nas próximas compras. Você pode adicionar outro depois.
            </p>
            <div className="account-modal__actions">
              <button className="account-modal__cancel" onClick={() => setAddressToRemove(null)} type="button">
                Manter endereço
              </button>
              <button className="account-modal__confirm" onClick={confirmRemoveAddress} type="button">
                Remover
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

