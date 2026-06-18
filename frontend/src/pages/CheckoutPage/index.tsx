import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { CheckoutStepContent, CheckoutSteps } from '../../features/checkout'
import { useAddresses } from '../../hooks/useAddresses'
import { emptyAddressDraft, type AddressDraft } from '../../types/address'
import './CheckoutPage.css'

const steps = ['Dados', 'Entrega', 'Pagamento', 'Revisão']

export function CheckoutPage() {
  const { addresses, primaryAddress, addAddress } = useAddresses()
  const [step, setStep] = useState(0)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft)
  const [saveAddress, setSaveAddress] = useState(false)
  const [saveAsPrimary, setSaveAsPrimary] = useState(false)
  const [deliveryError, setDeliveryError] = useState('')
  const [showUnsavedAddressModal, setShowUnsavedAddressModal] = useState(false)

  const effectiveSelectedAddressId = selectedAddressId ?? primaryAddress?.id ?? null

  function updateAddressDraft(field: keyof AddressDraft, value: string) {
    setAddressDraft((currentDraft) => ({
      ...currentDraft,
      [field]: field === 'state' ? value.toUpperCase().slice(0, 2) : value,
    }))
  }

  function hasCompleteAddress() {
    return Boolean(
      addressDraft.label.trim() &&
        addressDraft.zipCode.trim() &&
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
  }

  function continueCheckout() {
    if (step !== 1) {
      setStep(Math.min(steps.length - 1, step + 1))
      return
    }

    if (effectiveSelectedAddressId && !isAddingAddress) {
      setDeliveryError('')
      setStep(2)
      return
    }

    if (!hasCompleteAddress()) {
      setDeliveryError('Preencha o endereço de entrega para continuar.')
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
      setStep(2)
      return
    }

    setShowUnsavedAddressModal(true)
  }

  function goBack() {
    if (step === 1 && isAddingAddress && addresses.length > 0) {
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
        <section className="page-title">
          <span className="eyebrow">Checkout otimizado</span>
          <h1>Finalize em poucos passos</h1>
          <p>Fluxo claro, rápido e preparado para Pix, cartão, cupom e frete.</p>
        </section>

        <section className="checkout-layout">
          <div className="checkout-main">
            <CheckoutSteps steps={steps} currentStep={step} onSelectStep={setStep} />

            <div className="checkout-panel">
              <CheckoutStepContent
                addressDraft={addressDraft}
                addresses={addresses}
                deliveryError={deliveryError}
                isAddingAddress={isAddingAddress}
                onAddNewAddress={() => {
                  setIsAddingAddress(true)
                  setSelectedAddressId(null)
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
                  resetNewAddressForm()
                }}
                saveAddress={saveAddress}
                saveAsPrimary={saveAsPrimary}
                selectedAddressId={effectiveSelectedAddressId}
                step={step}
              />

              <div className="checkout-actions">
                <Button variant="ghost" onClick={goBack}>
                  Voltar
                </Button>
                <Button onClick={continueCheckout}>Continuar</Button>
              </div>
            </div>
          </div>

          <aside className="summary-panel">
            <h2>Compra segura</h2>
            <p>Dados criptografados, antifraude ativo e acompanhamento por e-mail.</p>
            <div className="summary-row">
              <span>Total</span>
              <strong>R$ 879,70</strong>
            </div>
          </aside>
        </section>
      </main>

      {showUnsavedAddressModal && (
        <div className="checkout-modal-backdrop" role="presentation">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="unsaved-address-title">
            <div className="checkout-modal__icon">
              <AlertTriangle aria-hidden="true" />
            </div>
            <h2 id="unsaved-address-title">Continuar sem salvar endereço?</h2>
            <p>
              Este endereço será usado apenas nesta compra. Se preferir usar em compras futuras, volte e marque a opção de salvar.
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
                  setStep(2)
                }}
                type="button"
              >
                Prosseguir
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  )
}
