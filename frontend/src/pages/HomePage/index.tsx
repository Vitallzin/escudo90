import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductCard } from '../../features/products'
import { Button } from '../../components/ui/Button'
import { ProductService } from '../../services/productService'
import heroStadium from '../../assets/hero-stadium.jpg'
import './HomePage.css'

const metrics = [
  { value: '+500', label: 'camisas em catálogo' },
  { value: '24h', label: 'separação de pedidos' },
  { value: '4.9', label: 'avaliação média' },
]

export function HomePage() {
  const categories = ProductService.getCategories()
  const featuredProducts = ProductService.getFeaturedProducts()
  const products = ProductService.getProducts()

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="hero-section">
          <img className="hero-bg-image" src={heroStadium} alt="" aria-hidden="true" />
          <div className="hero-content">
            <span className="eyebrow">Camisas nacionais e internacionais</span>
            <h1>Vista a paixão pelo futebol com qualidade premium.</h1>
            <p>
              Uma loja completa para clubes, seleções, retrôs, lançamentos e
              edições especiais. Compra segura, estoque em tempo real e entrega
              preparada para crescer junto com sua torcida.
            </p>

            <div className="hero-actions">
              <Link to="/times">
                <Button>Comprar agora</Button>
              </Link>
              <Link to="/promocoes">
                <Button variant="secondary">Ver promoções</Button>
              </Link>
            </div>
          </div>

          <div className="hero-showcase">
            <img className="hero-jersey-image" src={products[0].image} alt={products[0].name} />
            <div className="hero-product-card">
              <span>Produto em destaque</span>
              <strong>{products[0].name}</strong>
              <small>Retrô premium | entrega rápida</small>
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
              <h2>Escolha pela competição</h2>
            </div>
            <Link to="/times">Ver catálogo completo</Link>
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
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="trust-band">
          <div>
            <span className="eyebrow">Compra tranquila</span>
            <h2>Benefícios para comprar sua camisa sem preocupação.</h2>
          </div>
          <div className="trust-grid">
            <article>
              <strong>Entrega rápida</strong>
              <span>Pedidos separados em até 24h e rastreio enviado por e-mail.</span>
            </article>
            <article>
              <strong>Pagamento seguro</strong>
              <span>Cartão, Pix e Mercado Pago com proteção em todas as etapas.</span>
            </article>
            <article>
              <strong>Troca fácil</strong>
              <span>Errou o tamanho? Solicite troca com atendimento rápido.</span>
            </article>
            <article>
              <strong>Produtos selecionados</strong>
              <span>Camisas nacionais, internacionais, retrô e promoções em um só catálogo.</span>
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

  if (categoryId === 'champions') {
    return '/times?filtro=champions-league'
  }

  return `/times?filtro=${categoryId}`
}
