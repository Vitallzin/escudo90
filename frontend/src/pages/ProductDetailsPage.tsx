import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductVisual } from '../components/product/ProductVisual'
import { Button } from '../components/ui/Button'
import { products } from '../constants/products'
import { formatCurrency, getDiscountPercent } from '../utils/formatCurrency'

export function ProductDetailsPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? 'M')
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="app-shell">
        <Header />
        <main className="empty-state">
          <h1>Produto não encontrado</h1>
          <Link to="/catalogo">Voltar ao catálogo</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = getDiscountPercent(product.price, product.oldPrice)

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="product-details">
          <div className="product-gallery">
            <ProductVisual colors={product.colors} name={product.name} badge={product.badge} large />
            <div className="gallery-thumbs">
              {product.colors.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </div>
          </div>

          <div className="product-detail-panel">
            <span className="eyebrow">{product.club} | {product.season}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <div className="detail-rating">
              <strong>★ {product.rating}</strong>
              <span>{product.reviews} avaliações verificadas</span>
              <span>{product.stock} em estoque</span>
            </div>

            <div className="detail-price-row">
              <div>
                {product.oldPrice && <span className="old-price">{formatCurrency(product.oldPrice)}</span>}
                <strong>{formatCurrency(product.price)}</strong>
                <small>ou 10x sem juros</small>
              </div>
              {discount && <span className="discount-pill">-{discount}%</span>}
            </div>

            <div className="detail-section">
              <h3>Tamanho</h3>
              <div className="size-picker">
                {product.sizes.map((size) => (
                  <button
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section quantity-row">
              <h3>Quantidade</h3>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <Link to="/carrinho">
                <Button>Adicionar ao carrinho</Button>
              </Link>
              <Button variant="ghost">Favoritar</Button>
            </div>

            <div className="shipping-box">
              <strong>Frete e garantia</strong>
              <span>Calcule o frete no carrinho. Troca facilitada em até 7 dias.</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
