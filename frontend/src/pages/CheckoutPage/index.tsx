import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { AuthRequiredNotice } from '../../features/auth'
import { CheckoutStepContent, CheckoutSteps } from '../../features/checkout'
import { useAddresses } from '../../hooks/useAddresses'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { emptyAddressDraft, type AddressDraft } from '../../types/address'
import { formatCurrency } from '../../utils/formatCurrency'
import './CheckoutPage.css'

const steps = ['Entrega', 'Pagamento', 'Revisao']
const pagSeguroCheckoutUrl = ''

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

export function CheckoutPage() {
  const { isAuthenticated } = useAuth()
  const { addresses, primaryAddress, addAddress } = useAddresses()
  const { items, subtotal } = useCart()
  const [step, setStep] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft)
  const [saveAddress, setSaveAddress] = useState(false)
  const [saveAsPrimary, setSaveAsPrimary] = useState(false)
  const [deliveryError, setDeliveryError] = useState('')
  const [zipCodeError, setZipCodeError] = useState('')
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [selectedPaymentBrand, setSelectedPaymentBrand] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [selectedShipping, setSelectedShipping] = useState('express')
  const [checkoutAddress, setCheckoutAddress] = useState<AddressDraft | null>(null)
  const [showUnsavedAddressModal, setShowUnsavedAddressModal] = useState(false)
  const [showSecureCheckoutModal, setShowSecureCheckoutModal] = useState(false)

  const effectiveSelectedAddressId = selectedAddressId ?? primaryAddress?.id ?? null
  const selectedAddress = addresses.find((address) => address.id === effectiveSelectedAddressId) ?? null
  const reviewAddress = checkoutAddress ?? selectedAddress
  const coupon = items.length > 0 ? 40 : 0
  const shipping = selectedShipping === 'pickup' ? 12.9 : 0
  const total = Math.max(0, subtotal - coupon + shipping)
  const isDeliveryReady = Boolean(
    (selectedAddress && !isAddingAddress) || (hasCompleteAddress() && !isLoadingZipCode && !zipCodeError)
  )
  const isPaymentReady = selectedPaymentMethod === 'pix' || (selectedPaymentMethod === 'card' && selectedPaymentBrand)
  const canContinue = step === 0 ? isDeliveryReady : step === 1 ? isPaymentReady : true

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

  function hasCompleteAddress() {
    return Boolean(
      addressDraft.label.trim() &&
        getZipCodeDigits(addressDraft.zipCode).length === 8 &&
        addressDraft.street.trim() &&
        addressDraft.number.trim() &&
        addressDraft.district.trim() &&
        addressDraft.city.trim() &&
        addressDraft.state.trim()
    )
  }

  function resetNewAddressForm() {
    setAddressDraft(emptyAddressDraft)
    setSaveAddress(false)
    setSaveAsPrimary(false)
    setDeliveryError('')
    setZipCodeError('')
  }

  function completeDeliveryWithAddress(address: AddressDraft) {
    setCheckoutAddress(address)
    setDeliveryError('')
    setStep(1)
  }

  function continueCheckout() {
    if (step === 0) {
      if (selectedAddress && !isAddingAddress) {
        completeDeliveryWithAddress(selectedAddress)
        return
      }

      if (!hasCompleteAddress()) {
        setDeliveryError('Preencha o endereco de entrega para continuar.')
        return
      }

      if (isLoadingZipCode) {
        return
      }

      if (zipCodeError) {
        return
      }

      if (saveAddress || saveAsPrimary) {
        const savedAddress = addAddress({
          ...addressDraft,
          isPrimary: saveAsPrimary || addresses.length === 0,
        })
        setSelectedAddressId(savedAddress.id)
        setIsAddingAddress(false)
        resetNewAddressForm()
        completeDeliveryWithAddress(savedAddress)
        return
      }

      setShowUnsavedAddressModal(true)
      return
    }

    if (step === 1) {
      if (!selectedPaymentMethod) {
        setPaymentError('Escolha Pix ou cartao para continuar.')
        return
      }

      if (selectedPaymentMethod === 'card' && !selectedPaymentBrand) {
        setPaymentError('Escolha a bandeira do cartao para continuar.')
        return
      }

      setPaymentError('')
      setStep(2)
      return
    }

    setShowSecureCheckoutModal(true)
  }

  function goBack() {
    if (step === 0 && isAddingAddress && addresses.length > 0) {
      setIsAddingAddress(false)
      resetNewAddressForm()
      return
    }

    setStep(Math.max(0, step - 1))
  }

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="checkout-title">
          <span className="eyebrow">Checkout seguro</span>
          <h1>Revise sua compra</h1>
          <p>Escolha a entrega, confirme o pagamento e finalize pelo ambiente protegido do PagSeguro.</p>
        </section>

        {!isAuthenticated ? (
          <AuthRequiredNotice
            message="Entre para escolher a entrega, revisar o pedido e finalizar a compra com seguranca."
            title="Checkout exclusivo para clientes"
          />
        ) : (
          <section className="checkout-layout">
            <div className="checkout-main">
              <CheckoutSteps steps={steps} currentStep={step} onSelectStep={setStep} />

              <div className="checkout-panel">
                <CheckoutStepContent
                  addressDraft={addressDraft}
                  addresses={addresses}
                  coupon={coupon}
                  deliveryError={deliveryError}
                  isLoadingZipCode={isLoadingZipCode}
                  isAddingAddress={isAddingAddress}
                  onAddNewAddress={() => {
                    setIsAddingAddress(true)
                    setSelectedAddressId(null)
                    setCheckoutAddress(null)
                    setDeliveryError('')
                  }}
                  onAddressDraftChange={updateAddressDraft}
                  onSaveAddressChange={(checked) => {
                    setSaveAddress(checked)
                    if (!checked) {
                      setSaveAsPrimary(false)
                    }
                  }}
                  onSaveAsPrimaryChange={(checked) => {
                    setSaveAsPrimary(checked)
                    if (checked) {
                      setSaveAddress(true)
                    }
                  }}
                  onSelectAddress={(addressId) => {
                    setSelectedAddressId(addressId)
                    setIsAddingAddress(false)
                    setCheckoutAddress(null)
                    resetNewAddressForm()
                  }}
                  onSelectPaymentBrand={(brand) => {
                    setSelectedPaymentBrand(brand)
                    setPaymentError('')
                  }}
                  onSelectPaymentMethod={(method) => {
                    setSelectedPaymentMethod(method)
                    setPaymentError('')

                    if (method === 'pix') {
                      setSelectedPaymentBrand('')
                    }
                  }}
                  onSelectShipping={setSelectedShipping}
                  paymentError={paymentError}
                  reviewAddress={reviewAddress}
                  saveAddress={saveAddress}
                  saveAsPrimary={saveAsPrimary}
                  selectedAddressId={effectiveSelectedAddressId}
                  selectedPaymentBrand={selectedPaymentBrand}
                  selectedPaymentMethod={selectedPaymentMethod}
                  selectedShipping={selectedShipping}
                  shipping={shipping}
                  subtotal={subtotal}
                  step={step}
                  total={total}
                  zipCodeError={zipCodeError}
                />

                <div className="checkout-actions">
                  {step > 0 || isAddingAddress ? (
                    <Button variant="ghost" onClick={goBack}>
                      Voltar
                    </Button>
                  ) : (
                    <Link className="button button-ghost button-default" to="/carrinho#carrinho">
                      Voltar ao carrinho
                    </Link>
                  )}
                  <Button disabled={!canContinue} onClick={continueCheckout}>
                    {step === 2 ? 'Prosseguir para compra' : step === 1 ? 'Seguir' : 'Prosseguir'}
                  </Button>
                </div>
              </div>
            </div>

            <aside className="summary-panel">
              <h2>Compra segura</h2>
              <p>Dados criptografados, antifraude ativo e acompanhamento por e-mail.</p>
              <div className="summary-row">
                <span>Produtos</span>
                <strong>{items.length}</strong>
              </div>
              <div className="summary-row">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </aside>
          </section>
        )}
      </main>

      {showUnsavedAddressModal && (
        <div className="checkout-modal-backdrop" role="presentation">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="unsaved-address-title">
            <div className="checkout-modal__icon">
              <AlertTriangle aria-hidden="true" />
            </div>
            <h2 id="unsaved-address-title">Continuar sem salvar endereco?</h2>
            <p>
              Este endereco sera usado apenas nesta compra. Se preferir usar em compras futuras, volte e marque a opcao de salvar.
            </p>
            <div className="checkout-modal__actions">
              <button
                className="checkout-modal__cancel"
                onClick={() => {
                  setShowUnsavedAddressModal(false)
                  setSaveAddress(true)
                }}
                type="button"
              >
                Voltar e salvar
              </button>
              <button
                className="checkout-modal__confirm"
                onClick={() => {
                  setShowUnsavedAddressModal(false)
                  completeDeliveryWithAddress(addressDraft)
                }}
                type="button"
              >
                Prosseguir
              </button>
            </div>
          </section>
        </div>
      )}

      {showSecureCheckoutModal && (
        <div className="checkout-modal-backdrop" role="presentation">
          <section
            className="checkout-modal checkout-modal--secure"
            role="dialog"
            aria-modal="true"
            aria-labelledby="secure-checkout-title"
          >
            <div className="checkout-modal__icon">
              <ShieldCheck aria-hidden="true" />
            </div>
            <h2 id="secure-checkout-title">Ambiente seguro de pagamento</h2>
            <p>
              Voce sera direcionado para o PagSeguro para concluir o pagamento em um ambiente protegido.
              A integracao final ja pode usar o endereco abaixo quando estiver pronta.
            </p>
            <div className="checkout-provider-target" data-provider="pagseguro" data-checkout-url={pagSeguroCheckoutUrl}>
              PagSeguro
            </div>
            <div className="checkout-modal__actions">
              <button className="checkout-modal__cancel" onClick={() => setShowSecureCheckoutModal(false)} type="button">
                Voltar para revisao
              </button>
              <button
                className="checkout-modal__confirm"
                disabled={!pagSeguroCheckoutUrl}
                onClick={() => {
                  if (pagSeguroCheckoutUrl) {
                    window.location.assign(pagSeguroCheckoutUrl)
                  }
                }}
                type="button"
              >
                Ir para PagSeguro
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  )
}
