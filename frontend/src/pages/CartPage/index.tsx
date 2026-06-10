import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { CartSummary } from '../../features/cart'
import { ProductVisual } from '../../features/products'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatCurrency'
import './CartPage.css'

export function CartPage() {
  const { items, removeItem, subtotal } = useCart()
  const coupon = items.length > 0 ? 40 : 0
  const shipping = 0
  const total = Math.max(0, subtotal - coupon + shipping)

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Carrinho persistente</span>
          <h1>Revise seu pedido</h1>
          <p>Produtos, tamanhos, quantidades, cupom, frete e total antes do checkout.</p>
        </section>

        {items.length === 0 ? (
          <section className="empty-state">
            <h2>Seu carrinho está vazio</h2>
            <p>Aproveite nossas ofertas e encontre seu manto favorito.</p>
            <Link to="/times">
              <Button>Ir para o catálogo</Button>
            </Link>
          </section>
        ) : (
          <section className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-item" key={`${item.product.id}-${item.size}`}>
                  <ProductVisual colors={item.product.colors} name={item.product.name} />
                  <div className="cart-item-info">
                    <span>{item.product.league}</span>
                    <h3>{item.product.name}</h3>
                    <small>
                      Tamanho {item.size} | Quantidade {item.quantity}
                    </small>
                  </div>
                  <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                  <button
                    aria-label={`Remover ${item.product.name}`}
                    onClick={() => removeItem(item.product.id, item.size)}
                  >
                    <X aria-hidden="true" />
                  </button>
                </article>
              ))}

              <div className="coupon-box">
                <label>
                  <span>Cupom de desconto</span>
                  <input defaultValue="TORCIDA10" />
                </label>
                <Button size="small" variant="dark">
                  Aplicar
                </Button>
              </div>
            </div>

            <CartSummary subtotal={subtotal} coupon={coupon} shipping={shipping} total={total} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
