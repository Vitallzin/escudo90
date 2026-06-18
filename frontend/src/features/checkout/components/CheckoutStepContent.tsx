import { MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import type { Address, AddressDraft } from '../../../types/address'

type CheckoutStepContentProps = {
  step: number
  addresses: Address[]
  selectedAddressId: string | null
  addressDraft: AddressDraft
  saveAddress: boolean
  saveAsPrimary: boolean
  isAddingAddress: boolean
  deliveryError: string
  onSelectAddress: (addressId: string) => void
  onAddNewAddress: () => void
  onAddressDraftChange: (field: keyof AddressDraft, value: string) => void
  onSaveAddressChange: (checked: boolean) => void
  onSaveAsPrimaryChange: (checked: boolean) => void
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
  onSelectAddress,
  onAddNewAddress,
  onAddressDraftChange,
  onSaveAddressChange,
  onSaveAsPrimaryChange,
}: CheckoutStepContentProps) {
  if (step === 0) {
    return (
      <fieldset>
        <legend>Dados pessoais</legend>
        <div className="form-grid">
          <label>
            Nome completo
            <input placeholder="Joao Silva" />
          </label>
          <label>
            CPF
            <input placeholder="000.000.000-00" />
          </label>
          <label>
            E-mail
            <input placeholder="joao@email.com" />
          </label>
          <label>
            Telefone
            <input placeholder="(11) 99999-9999" />
          </label>
        </div>
      </fieldset>
    )
  }

  if (step === 1) {
    return (
      <fieldset>
        <legend>Entrega</legend>

        {addresses.length === 0 && !isAddingAddress && (
          <div className="checkout-address-empty">
            <MapPin aria-hidden="true" />
            <div>
              <strong>Não há endereço salvo</strong>
              <span>Adicione um endereço para calcular o frete e continuar a compra.</span>
            </div>
            <Button onClick={onAddNewAddress}>
              <Plus aria-hidden="true" />
              Adicionar endereço
            </Button>
          </div>
        )}

        {addresses.length > 0 && !isAddingAddress && (
          <div className="checkout-address-section">
            <div className="checkout-address-heading">
              <div>
                <strong>Escolha onde receber</strong>
                <span>O principal já vem selecionado, mas você pode trocar para esta compra.</span>
              </div>
              <Button variant="ghost" onClick={onAddNewAddress}>
                <Plus aria-hidden="true" />
                Novo endereço
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
                <strong>Novo endereço de entrega</strong>
                <span>Use um nome fácil para reconhecer este endereço depois.</span>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Nome do endereço
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
                Número
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
                <span>Salvar endereço</span>
              </label>
              <label>
                <input
                  checked={saveAsPrimary}
                  onChange={(event) => onSaveAsPrimaryChange(event.target.checked)}
                  type="checkbox"
                />
                <span>Salvar endereço como principal</span>
              </label>
            </div>
          </div>
        )}

        {deliveryError && <p className="checkout-error">{deliveryError}</p>}

        <div className="shipping-options">
          <label>
            <input type="radio" defaultChecked />
            <span>Expresso - 2 a 4 dias úteis</span>
            <strong>Grátis</strong>
          </label>
          <label>
            <input type="radio" />
            <span>Retirada em ponto parceiro</span>
            <strong>R$ 12,90</strong>
          </label>
        </div>
      </fieldset>
    )
  }

  if (step === 2) {
    return (
      <fieldset>
        <legend>Pagamento</legend>
        <div className="payment-grid">
          <label className="payment-option selected">
            <input type="radio" defaultChecked />
            Cartão de crédito
          </label>
          <label className="payment-option">
            <input type="radio" />
            Pix com desconto
          </label>
          <label className="payment-option">
            <input type="radio" />
            Mercado Pago
          </label>
        </div>
        <div className="form-grid">
          <label className="span-2">
            Número do cartão
            <input placeholder="0000 0000 0000 0000" />
          </label>
          <label>
            Validade
            <input placeholder="MM/AA" />
          </label>
          <label>
            CVV
            <input placeholder="123" />
          </label>
        </div>
      </fieldset>
    )
  }

  return (
    <div className="review-box">
      <strong>Pedido pronto para confirmação</strong>
      <p>Camisas separadas, cupom aplicado, frete grátis e pagamento protegido por antifraude.</p>
      <Link to="/perfil">
        <Button>Confirmar pedido</Button>
      </Link>
    </div>
  )
}
