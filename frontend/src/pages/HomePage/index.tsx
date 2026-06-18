import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductCard } from '../../features/products'
import { ProductService } from '../../services/productService'
import heroStadium from '../../assets/hero-stadium.jpg'
import './HomePage.css'

const metrics = [
  { value: '+500', label: 'camisas em catalogo' },
  { value: '24h', label: 'separacao de pedidos' },
  { value: '4.9', label: 'avaliacao media' },
]

export function HomePage() {
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof ProductService.getCategories>>>([])
  const [featuredProducts, setFeaturedProducts] = useState<Awaited<ReturnType<typeof ProductService.getProducts>>>([])
  const [products, setProducts] = useState<Awaited<ReturnType<typeof ProductService.getProducts>>>([])

  useEffect(() => {
    let shouldUpdate = true

    async function loadHomeData() {
      const [nextCategories, nextFeaturedProducts, nextProducts] = await Promise.all([
        ProductService.getCategories(),
        ProductService.getFeaturedProducts(),
        ProductService.getProducts(),
      ])

      if (shouldUpdate) {
        setCategories(nextCategories)
        setFeaturedProducts(nextFeaturedProducts)
        setProducts(nextProducts)
      }
    }

    void loadHomeData()

    return () => {
      shouldUpdate = false
    }
  }, [])

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="hero-section">
          <img className="hero-bg-image" src={heroStadium} alt="" aria-hidden="true" />
          <div className="hero-content">
            <span className="eyebrow">Camisas nacionais e internacionais</span>
            <h1>Vista a paixao pelo futebol com qualidade premium.</h1>
            <p>
              Uma loja completa para clubes, selecoes, retros, lancamentos e edicoes especiais. Compra segura, estoque
              em tempo real e entrega preparada para crescer junto com sua torcida.
            </p>

            <div className="hero-actions">
              <Link to="/times">
                <Button>Comprar agora</Button>
              </Link>
              <Link to="/promocoes">
                <Button variant="secondary">Ver promocoes</Button>
              </Link>
            </div>
          </div>

          <div className="hero-showcase">
            {products[0] && <img className="hero-jersey-image" src={products[0].image} alt={products[0].name} />}
            <div className="hero-product-card">
              <span>Produto em destaque</span>
              <strong>{products[0]?.name ?? 'Carregando catalogo'}</strong>
              <small>Retro premium | entrega rapida</small>
            </div>
          </div>
        </section>

        <section className="metrics-row" aria-label="Indicadores da loja">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section className="section-block">
          <div className="section-header">
            <div>
              <span className="eyebrow">Categorias</span>
              <h2>Escolha pela competicao</h2>
            </div>
            <Link to="/times">Ver catalogo completo</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className="category-card"
                key={category.id}
                to={getCategoryTarget(category.id)}
                style={{ '--category-color': category.color } as CSSProperties}
              >
                <span>{category.count} modelos</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-header">
            <div>
              <span className="eyebrow">Destaques</span>
              <h2>Produtos mais procurados</h2>
            </div>
            <Link to="/promocoes">Ver ofertas</Link>
          </div>

          <div className="product-grid">
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
              : Array.from({ length: 6 }, (_, index) => (
                  <div className="product-card-skeleton" key={index} aria-hidden="true">
                    <span />
                    <div>
                      <strong />
                      <p />
                      <p />
                    </div>
                  </div>
                ))}
          </div>
        </section>

        <section className="trust-band">
          <div>
            <span className="eyebrow">Compra tranquila</span>
            <h2>Beneficios para comprar sua camisa sem preocupacao.</h2>
          </div>
          <div className="trust-grid">
            <article>
              <strong>Entrega rapida</strong>
              <span>Pedidos separados em ate 24h e rastreio enviado por e-mail.</span>
            </article>
            <article>
              <strong>Pagamento seguro</strong>
              <span>Cartao, Pix e Mercado Pago com protecao em todas as etapas.</span>
            </article>
            <article>
              <strong>Troca facil</strong>
              <span>Errou o tamanho? Solicite troca com atendimento rapido.</span>
            </article>
            <article>
              <strong>Produtos selecionados</strong>
              <span>Camisas nacionais, internacionais, retro e promocoes em um so catalogo.</span>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function getCategoryTarget(categoryId: string) {
  if (categoryId === 'selecoes') {
    return '/selecoes'
  }

  if (categoryId === 'champions-league') {
    return '/times?filtro=champions-league'
  }

  return `/times?filtro=${categoryId}`
}
