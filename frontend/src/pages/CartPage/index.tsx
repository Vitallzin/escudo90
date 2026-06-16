import { Heart, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { AuthRequiredNotice } from '../../features/auth'
import { CartSummary } from '../../features/cart'
import { ProductVisual } from '../../features/products'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useFavorites } from '../../hooks/useFavorites'
import { ProductService } from '../../services/productService'
import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatCurrency'
import './CartPage.css'

export function CartPage() {
  const { items, addItem, removeItem, subtotal } = useCart()
  const { isAuthenticated } = useAuth()
  const { favoriteIds, removeFavorite } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const coupon = items.length > 0 ? 40 : 0
  const shipping = 0
  const total = Math.max(0, subtotal - coupon + shipping)
  const favorites = products.filter((product) => favoriteIds.includes(product.id))

  useEffect(() => {
    let shouldUpdate = true

    async function loadProducts() {
      const nextProducts = await ProductService.getProducts()

      if (shouldUpdate) {
        setProducts(nextProducts)
      }
    }

    void loadProducts()

    return () => {
      shouldUpdate = false
    }
  }, [])

  function addFavoriteToCart(product: Product) {
    addItem(product, product.sizes[0] ?? 'M', 1)
  }

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Carrinho persistente</span>
          <h1>Revise seu pedido</h1>
          <p>Produtos, tamanhos, quantidades, cupom, frete e total antes do checkout.</p>
        </section>

        {!isAuthenticated ? (
          <AuthRequiredNotice
            message="Entre para acessar seu carrinho, manter seus itens salvos e continuar a compra."
            title="Carrinho exclusivo para clientes"
          />
        ) : (
          <>
            {items.length === 0 ? (
              <section className="empty-state">
                <h2>Seu carrinho esta vazio</h2>
                <p>Aproveite nossas ofertas e encontre seu manto favorito.</p>
                <Link to="/times">
                  <Button>Ir para o catalogo</Button>
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
                        type="button"
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

            <section className="cart-favorites">
              <div className="table-header">
                <div>
                  <span className="eyebrow">Lista de desejos</span>
                  <h2>Favoritos</h2>
                </div>
                <span>{favorites.length} salvo(s)</span>
              </div>

              {favorites.length === 0 ? (
                <div className="cart-favorites-empty">
                  <Heart aria-hidden="true" />
                  <p>Seus favoritos aparecem aqui para voce colocar no carrinho rapidamente.</p>
                  <Link to="/times">Ver camisas</Link>
                </div>
              ) : (
                <div className="cart-favorites-list">
                  {favorites.map((product) => (
                    <article className="cart-favorite-item" key={product.id}>
                      <ProductVisual colors={product.colors} name={product.name} />
                      <div>
                        <span>{product.league}</span>
                        <h3>{product.name}</h3>
                        <strong>{formatCurrency(product.price)}</strong>
                      </div>
                      <button onClick={() => addFavoriteToCart(product)} type="button">
                        <ShoppingBag aria-hidden="true" />
                        <span>Por no carrinho</span>
                      </button>
                      <button
                        aria-label={`Remover ${product.name} dos favoritos`}
                        className="remove-favorite"
                        onClick={() => removeFavorite(product.id)}
                        type="button"
                      >
                        <X aria-hidden="true" />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
