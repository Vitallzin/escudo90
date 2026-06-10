import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'

const steps = ['Dados', 'Entrega', 'Pagamento', 'Revisão']

export function CheckoutPage() {
  const [step, setStep] = useState(0)

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
            <div className="checkout-steps">
              {steps.map((item, index) => (
                <button
                  className={`checkout-step ${index <= step ? 'active' : ''}`}
                  key={item}
                  onClick={() => setStep(index)}
                >
                  <span>{index + 1}</span>
                  {item}
                </button>
              ))}
            </div>

            <div className="checkout-panel">
              {step === 0 && (
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
              )}

              {step === 1 && (
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
              )}

              {step === 2 && (
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
              )}

              {step === 3 && (
                <div className="review-box">
                  <strong>Pedido pronto para confirmação</strong>
                  <p>
                    Camisas separadas, cupom aplicado, frete grátis e pagamento
                    protegido por antifraude.
                  </p>
                  <Link to="/perfil">
                    <Button>Confirmar pedido</Button>
                  </Link>
                </div>
              )}

              <div className="checkout-actions">
                <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))}>
                  Voltar
                </Button>
                <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
                  Continuar
                </Button>
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

      <Footer />
    </div>
  )
}
