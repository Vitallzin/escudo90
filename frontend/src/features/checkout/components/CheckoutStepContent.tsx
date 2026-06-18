import { CreditCard, MapPin, Plus, ShieldCheck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { Address, AddressDraft } from '../../../types/address'
import { formatCurrency } from '../../../utils/formatCurrency'

const paymentBrands = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'elo', label: 'Elo' },
  { id: 'amex', label: 'American Express' },
]

const paymentMethods = [
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartao de credito' },
]

type CheckoutStepContentProps = {
  step: number
  addresses: Address[]
  selectedAddressId: string | null
  addressDraft: AddressDraft
  saveAddress: boolean
  saveAsPrimary: boolean
  isAddingAddress: boolean
  deliveryError: string
  zipCodeError: string
  isLoadingZipCode: boolean
  paymentError: string
  selectedPaymentMethod: string
  selectedPaymentBrand: string
  selectedShipping: string
  reviewAddress: AddressDraft | null
  subtotal: number
  coupon: number
  shipping: number
  total: number
  onSelectAddress: (addressId: string) => void
  onAddNewAddress: () => void
  onAddressDraftChange: (field: keyof AddressDraft, value: string) => void
  onSaveAddressChange: (checked: boolean) => void
  onSaveAsPrimaryChange: (checked: boolean) => void
  onSelectPaymentMethod: (method: string) => void
  onSelectPaymentBrand: (brand: string) => void
  onSelectShipping: (shipping: string) => void
}

function getPaymentBrandLabel(brand: string) {
  return paymentBrands.find((paymentBrand) => paymentBrand.id === brand)?.label ?? 'Nao selecionada'
}

function formatAddress(address: AddressDraft | null) {
  if (!address) {
    return 'Endereco nao informado'
  }

  return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}`
}

export function CheckoutStepContent({
  step,
  addresses,
  selectedAddressId,
  addressDraft,
  saveAddress,
  saveAsPrimary,
  isAddingAddress,
  deliveryError,
  zipCodeError,
  isLoadingZipCode,
  paymentError,
  selectedPaymentMethod,
  selectedPaymentBrand,
  selectedShipping,
  reviewAddress,
  subtotal,
  coupon,
  shipping,
  total,
  onSelectAddress,
  onAddNewAddress,
  onAddressDraftChange,
  onSaveAddressChange,
  onSaveAsPrimaryChange,
  onSelectPaymentMethod,
  onSelectPaymentBrand,
  onSelectShipping,
}: CheckoutStepContentProps) {
  if (step === 0) {
    return (
      <fieldset>
        <legend>Entrega</legend>

        {addresses.length === 0 && !isAddingAddress && (
          <div className="checkout-address-empty">
            <MapPin aria-hidden="true" />
            <div>
              <strong>Nao ha endereco salvo</strong>
              <span>Adicione um endereco para calcular o frete e continuar a compra.</span>
            </div>
            <Button onClick={onAddNewAddress}>
              <Plus aria-hidden="true" />
              Adicionar endereco
            </Button>
          </div>
        )}

        {addresses.length > 0 && !isAddingAddress && (
          <div className="checkout-address-section">
            <div className="checkout-address-heading">
              <div>
                <strong>Escolha onde receber</strong>
                <span>O principal ja vem selecionado, mas voce pode trocar para esta compra.</span>
              </div>
              <Button variant="ghost" onClick={onAddNewAddress}>
                <Plus aria-hidden="true" />
                Novo endereco
              </Button>
            </div>

            <div className="checkout-address-list">
              {addresses.map((address) => (
                <label
                  className={
                    selectedAddressId === address.id
                      ? 'checkout-address-card checkout-address-card--selected'
                      : 'checkout-address-card'
                  }
                  key={address.id}
                >
                  <input
                    checked={selectedAddressId === address.id}
                    name="delivery-address"
                    onChange={() => onSelectAddress(address.id)}
                    type="radio"
                  />
                  <span>
                    <strong>{address.label}</strong>
                    <small>
                      {address.street}, {address.number}
                    </small>
                    <small>
                      {address.district} - {address.city}/{address.state}
                    </small>
                  </span>
                  {address.isPrimary && <em>Principal</em>}
                </label>
              ))}
            </div>
          </div>
        )}

        {isAddingAddress && (
          <div className="checkout-address-form">
            <div className="checkout-address-form__title">
              <MapPin aria-hidden="true" />
              <div>
                <strong>Novo endereco de entrega</strong>
                <span>Use um nome facil para reconhecer este endereco depois.</span>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Nome do endereco
                <input
                  onChange={(event) => onAddressDraftChange('label', event.target.value)}
                  placeholder="Casa, trabalho, presente..."
                  value={addressDraft.label}
                />
              </label>
              <label>
                CEP
                <input
                  inputMode="numeric"
                  onChange={(event) => onAddressDraftChange('zipCode', event.target.value)}
                  placeholder="00000-000"
                  value={addressDraft.zipCode}
                />
                {isLoadingZipCode && <small className="checkout-field-hint">Buscando endereco...</small>}
                {zipCodeError && <small className="checkout-field-error">{zipCodeError}</small>}
              </label>
              <label className="span-2">
                Rua ou avenida
                <input
                  onChange={(event) => onAddressDraftChange('street', event.target.value)}
                  placeholder="Rua das Camisas"
                  value={addressDraft.street}
                />
              </label>
              <label>
                Numero
                <input
                  onChange={(event) => onAddressDraftChange('number', event.target.value)}
                  placeholder="123"
                  value={addressDraft.number}
                />
              </label>
              <label>
                Complemento
                <input
                  onChange={(event) => onAddressDraftChange('complement', event.target.value)}
                  placeholder="Apartamento, bloco, referencia"
                  value={addressDraft.complement}
                />
              </label>
              <label>
                Bairro
                <input
                  onChange={(event) => onAddressDraftChange('district', event.target.value)}
                  placeholder="Centro"
                  value={addressDraft.district}
                />
              </label>
              <label>
                Cidade
                <input
                  onChange={(event) => onAddressDraftChange('city', event.target.value)}
                  placeholder="Recife"
                  value={addressDraft.city}
                />
              </label>
              <label>
                UF
                <input
                  onChange={(event) => onAddressDraftChange('state', event.target.value)}
                  placeholder="PE"
                  value={addressDraft.state}
                />
              </label>
            </div>

            <div className="checkout-save-options">
              <label>
                <input
                  checked={saveAddress}
                  onChange={(event) => onSaveAddressChange(event.target.checked)}
                  type="checkbox"
                />
                <span>Salvar endereco</span>
              </label>
              <label>
                <input
                  checked={saveAsPrimary}
                  onChange={(event) => onSaveAsPrimaryChange(event.target.checked)}
                  type="checkbox"
                />
                <span>Salvar endereco como principal</span>
              </label>
            </div>
          </div>
        )}

        {deliveryError && <p className="checkout-error">{deliveryError}</p>}

        {(addresses.length > 0 || isAddingAddress) && (
          <div className="shipping-options">
            <label className={selectedShipping === 'express' ? 'selected' : undefined}>
              <input
                checked={selectedShipping === 'express'}
                name="shipping"
                onChange={() => onSelectShipping('express')}
                type="radio"
              />
              <span>Expresso - 2 a 4 dias uteis</span>
              <strong>Gratis</strong>
            </label>
            <label className={selectedShipping === 'pickup' ? 'selected' : undefined}>
              <input
                checked={selectedShipping === 'pickup'}
                name="shipping"
                onChange={() => onSelectShipping('pickup')}
                type="radio"
              />
              <span>Retirada em ponto parceiro</span>
              <strong>R$ 12,90</strong>
            </label>
          </div>
        )}
      </fieldset>
    )
  }

  if (step === 1) {
    return (
      <fieldset>
        <legend>Pagamento</legend>
        <div className="payment-intro">
          <CreditCard aria-hidden="true" />
          <div>
            <strong>Escolha como deseja pagar</strong>
            <span>Os dados sensiveis serao preenchidos apenas no ambiente seguro do PagSeguro.</span>
          </div>
        </div>

        <div className="payment-method-grid">
          {paymentMethods.map((method) => (
            <label
              className={selectedPaymentMethod === method.id ? 'payment-option selected' : 'payment-option'}
              key={method.id}
            >
              <input
                checked={selectedPaymentMethod === method.id}
                name="payment-method"
                onChange={() => onSelectPaymentMethod(method.id)}
                type="radio"
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>

        {selectedPaymentMethod === 'card' && (
          <>
            <div className="payment-section-title">Bandeira do cartao</div>
            <div className="payment-grid">
              {paymentBrands.map((brand) => (
                <label
                  className={selectedPaymentBrand === brand.id ? 'payment-option selected' : 'payment-option'}
                  key={brand.id}
                >
                  <input
                    checked={selectedPaymentBrand === brand.id}
                    name="payment-brand"
                    onChange={() => onSelectPaymentBrand(brand.id)}
                    type="radio"
                  />
                  <span>{brand.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {paymentError && <p className="checkout-error">{paymentError}</p>}
      </fieldset>
    )
  }

  return (
    <div className="review-box">
      <div className="review-box__title">
        <ShieldCheck aria-hidden="true" />
        <div>
          <strong>Revise antes de finalizar</strong>
          <span>Confira entrega, pagamento e valores do pedido.</span>
        </div>
      </div>

      <div className="review-grid">
        <section>
          <h3>Entrega</h3>
          <p>{reviewAddress?.label ?? 'Endereco da compra'}</p>
          <span>{formatAddress(reviewAddress)}</span>
          {reviewAddress && (
            <span>
              {reviewAddress.district} - {reviewAddress.city}/{reviewAddress.state}
            </span>
          )}
        </section>

        <section>
          <h3>Pagamento</h3>
          <p>{selectedPaymentMethod === 'pix' ? 'Pix' : 'Cartao de credito'}</p>
          {selectedPaymentMethod === 'card' && <span>Bandeira: {getPaymentBrandLabel(selectedPaymentBrand)}</span>}
          <span>Processamento via PagSeguro</span>
        </section>
      </div>

      <div className="review-values">
        <div>
          <span>Produtos</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div>
          <span>Cupom</span>
          <strong>- {formatCurrency(coupon)}</strong>
        </div>
        <div>
          <span>Frete</span>
          <strong>{shipping > 0 ? formatCurrency(shipping) : 'Gratis'}</strong>
        </div>
        <div className="review-values__total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  )
}
