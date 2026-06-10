import { useState } from 'react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { CheckoutStepContent, CheckoutSteps } from '../../features/checkout'
import './CheckoutPage.css'

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
            <CheckoutSteps steps={steps} currentStep={step} onSelectStep={setStep} />

            <div className="checkout-panel">
              <CheckoutStepContent step={step} />

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
