import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { useState } from 'react'

export function CheckoutPage() {
  const [step, setStep] = useState(1)

  return (
    <div className="app-shell">
      <Header />
      <main style={{ paddingBlock: '4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="checkout-steps">
            {[1, 2, 3].map(s => (
              <div key={s} className={`step ${step >= s ? 'active' : ''}`}>
                {s}
              </div>
            ))}
          </div>

          <div className="card">
            {step === 1 && (
              <div>
                <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary-blue)' }}>Dados de Entrega</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ gridColumn: 'span 2' }} className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input type="text" className="form-input" placeholder="Ex: João Silva" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input type="text" className="form-input" placeholder="00000-000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número</label>
                    <input type="text" className="form-input" placeholder="123" />
                  </div>
                  <div style={{ gridColumn: 'span 2' }} className="form-group">
                    <label className="form-label">Endereço</label>
                    <input type="text" className="form-input" placeholder="Rua, Avenida..." />
                  </div>
                </div>
                <Button onClick={() => setStep(2)} style={{ marginTop: '2rem', width: '100%', padding: '1.25rem' }}>Continuar para Pagamento</Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary-blue)' }}>Pagamento</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ 
                    padding: '1.5rem', 
                    border: '2px solid var(--primary-blue)', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    background: 'var(--soft-yellow)'
                  }}>
                    <input type="radio" checked readOnly style={{ width: '20px', height: '20px' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block' }}>Cartão de Crédito</strong>
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Aprovação instantânea</span>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>💳</span>
                  </div>
                  <div style={{ 
                    padding: '1.5rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}>
                    <input type="radio" disabled style={{ width: '20px', height: '20px' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block' }}>PIX</strong>
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>10% de desconto adicional</span>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  </div>
                </div>
                
                <div className="form-group">
                   <label className="form-label">Número do Cartão</label>
                   <input type="text" className="form-input" placeholder="0000 0000 0000 0000" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Validade</label>
                    <input type="text" className="form-input" placeholder="MM/AA" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="text" className="form-input" placeholder="123" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                  <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Voltar</Button>
                  <Button onClick={() => setStep(3)} style={{ flex: 1 }}>Finalizar Pedido</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: '#28a745', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '3rem',
                  margin: '0 auto 2rem',
                  boxShadow: '0 10px 20px rgba(40,167,69,0.2)'
                }}>
                  ✓
                </div>
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary-blue)', fontSize: '2.5rem' }}>Pedido Realizado!</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '400px', marginInline: 'auto' }}>
                  Obrigado pela sua compra. Enviamos um e-mail com a confirmação e o código de rastreio.
                </p>
                <Button onClick={() => window.location.href = '/'}>Voltar para a Loja</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
