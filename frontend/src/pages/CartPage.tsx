import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductVisual } from '../components/product/ProductVisual'
import { Button } from '../components/ui/Button'
import { cartPreview } from '../constants/products'
import { formatCurrency } from '../utils/formatCurrency'

export function CartPage() {
  const subtotal = cartPreview.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const coupon = 40
  const shipping = 0
  const total = subtotal - coupon + shipping

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Carrinho persistente</span>
          <h1>Revise seu pedido</h1>
          <p>Produtos, tamanhos, quantidades, cupom, frete e total antes do checkout.</p>
        </section>

        <section className="cart-layout">
          <div className="cart-list">
            {cartPreview.map((item) => (
              <article className="cart-item" key={item.product.id}>
                <ProductVisual colors={item.product.colors} name={item.product.name} />
                <div className="cart-item-info">
                  <span>{item.product.league}</span>
                  <h3>{item.product.name}</h3>
                  <small>Tamanho {item.size} | Quantidade {item.quantity}</small>
                </div>
                <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                <button aria-label={`Remover ${item.product.name}`}>×</button>
              </article>
            ))}

            <div className="coupon-box">
              <label>
                <span>Cupom de desconto</span>
                <input defaultValue="TORCIDA10" />
              </label>
              <Button size="small" variant="dark">Aplicar</Button>
            </div>
          </div>

          <aside className="summary-panel">
            <h2>Resumo</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Cupom</span>
              <strong>-{formatCurrency(coupon)}</strong>
            </div>
            <div className="summary-row">
              <span>Frete</span>
              <strong>Grátis</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Link to="/checkout">
              <Button>Finalizar compra</Button>
            </Link>
            <Link className="continue-link" to="/catalogo">
              Continuar comprando
            </Link>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
