import { ArrowLeft, Heart, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { AuthRequiredNotice } from '../../features/auth'
import { ProductCard } from '../../features/products'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useFavorites } from '../../hooks/useFavorites'
import { ProductService } from '../../services/productService'
import type { Product } from '../../types/product'
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency'
import './ProductDetailsPage.css'

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [product, setProduct] = useState<Product>()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [authNotice, setAuthNotice] = useState('')

  useEffect(() => {
    let shouldUpdate = true

    async function loadProduct() {
      setIsLoading(true)
      const [nextProduct, products] = await Promise.all([
        ProductService.getProductById(id ?? ''),
        ProductService.getProducts(),
      ])

      if (shouldUpdate) {
        setProduct(nextProduct)
        setSelectedSize(nextProduct?.sizes[0] ?? 'M')
        setRelatedProducts(
          products
            .filter(
              (item) =>
                nextProduct &&
                item.id !== nextProduct.id &&
                (item.category === nextProduct.category || item.league === nextProduct.league),
            )
            .slice(0, 4),
        )
        setIsLoading(false)
      }
    }

    void loadProduct()

    return () => {
      shouldUpdate = false
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="empty-state">
          <h1>Carregando produto...</h1>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="app-shell">
        <Header />
        <main className="empty-state">
          <h1>Produto não encontrado</h1>
          <Link to="/times">Voltar ao catálogo</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = getDiscountPercent(product.price, product.oldPrice)

  function handleAddToCart() {
    if (!product) return

    if (!isAuthenticated) {
      setAuthNotice('Para adicionar produtos ao carrinho, entre na sua conta.')
      return
    }

    setAuthNotice('')
    addItem(product, selectedSize, quantity)
  }

  function handleFavorite() {
    if (!product) return

    if (!isAuthenticated) {
      setAuthNotice('Para salvar produtos na lista de desejos, entre na sua conta.')
      return
    }

    setAuthNotice('')
    toggleFavorite(product.id)
  }

  return (
    <div className="app-shell">
      <Header />

      <main>
        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft aria-hidden="true" />
          Voltar
        </button>

        <section className="product-details">
          <div className="product-gallery">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
              <span className="product-badge">{product.badge}</span>
            </div>
            <div className="gallery-thumbs">
              {product.colors.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </div>
          </div>

          <div className="product-detail-panel">
            <span className="eyebrow">
              {product.club} | {product.season}
            </span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <div className="detail-rating">
              <strong>
                <Star aria-hidden="true" />
                {product.rating}
              </strong>
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
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section quantity-row">
              <h3>Quantidade</h3>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} type="button">
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} type="button">
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <Button onClick={handleAddToCart}>Adicionar ao carrinho</Button>
              <Button variant="ghost" onClick={handleFavorite}>
                <Heart aria-hidden="true" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                {isFavorite(product.id) ? 'Favoritado' : 'Favoritar'}
              </Button>
            </div>

            {authNotice && <AuthRequiredNotice message={authNotice} title="Login necessário" />}

            <div className="shipping-box">
              <strong>Frete e garantia</strong>
              <span>Calcule o frete no carrinho. Troca facilitada em até 7 dias.</span>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <div className="section-header">
              <div>
                <span className="eyebrow">Você também pode gostar</span>
                <h2>Produtos semelhantes</h2>
              </div>
              <Link to="/times">Ver mais camisas</Link>
            </div>

            <div className="product-grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
