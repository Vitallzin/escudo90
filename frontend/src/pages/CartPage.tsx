import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { featuredProducts } from '../constants/products'
import { formatCurrency } from '../utils/formatCurrency'

export function CartPage() {
  // Simulating cart data
  const cartItems = [featuredProducts[0], featuredProducts[1]]
  const total = cartItems.reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="app-shell">
      <Header />
      <main>
        <div className="section-header">
          <div>
            <span className="eyebrow">Seu Pedido</span>
            <h2>Carrinho de Compras</h2>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-list">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    👕
                  </div>
                  <div className="cart-item-info" style={{ flex: 1 }}>
                    <h4>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Tamanho: M • Categoria: {item.category}</span>
                  </div>
                  <div style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--primary-blue)' }}>
                      {formatCurrency(item.price)}
                    </strong>
                  </div>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '1.2rem',
                    color: '#ff4d4f',
                    opacity: 0.6
                  }}>✕</button>
                </div>
              ))}
            </div>

            <Link to="/catalogo" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--primary-blue)', fontWeight: 700 }}>
              &larr; Continuar Comprando
            </Link>
          </div>

          <div className="cart-summary card">
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Resumo do Pedido</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <div className="summary-row">
              <span>Frete Estimado</span>
              <span style={{ color: '#28a745', fontWeight: 700 }}>Grátis</span>
            </div>

            <div className="summary-row" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              <span>Cupons</span>
              <span>-</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <Link to="/checkout">
              <Button style={{ width: '100%', padding: '1.25rem' }}>Finalizar Compra</Button>
            </Link>
            
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.5 }}>
              Pagamento 100% seguro com criptografia de ponta a ponta.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
