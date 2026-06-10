import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'

type CheckoutStepContentProps = {
  step: number
}

export function CheckoutStepContent({ step }: CheckoutStepContentProps) {
  if (step === 0) {
    return (
      <fieldset>
        <legend>Dados pessoais</legend>
        <div className="form-grid">
          <label>
            Nome completo
            <input placeholder="João Silva" />
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
        <legend>Endereço e frete</legend>
        <div className="form-grid">
          <label>
            CEP
            <input placeholder="00000-000" />
          </label>
          <label>
            Número
            <input placeholder="123" />
          </label>
          <label className="span-2">
            Endereço
            <input placeholder="Rua, avenida, bairro e cidade" />
          </label>
        </div>
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
