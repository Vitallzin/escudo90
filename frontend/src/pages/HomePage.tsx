import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard } from '../components/product/ProductCard'
import { ProductVisual } from '../components/product/ProductVisual'
import { Button } from '../components/ui/Button'
import { categories, featuredProducts, products } from '../constants/products'

const metrics = [
  { value: '+500', label: 'camisas em catálogo' },
  { value: '24h', label: 'separação de pedidos' },
  { value: '4.9', label: 'avaliação média' },
]

export function HomePage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">Camisas nacionais e internacionais</span>
            <h1>Vista a paixão pelo futebol com qualidade premium.</h1>
            <p>
              Uma loja completa para clubes, seleções, retrôs, lançamentos e
              edições especiais. Compra segura, estoque em tempo real e entrega
              preparada para crescer junto com sua torcida.
            </p>

            <div className="hero-actions">
              <Link to="/catalogo">
                <Button>Comprar agora</Button>
              </Link>
              <Link to="/catalogo?promocoes=true">
                <Button variant="secondary">Ver promoções</Button>
              </Link>
            </div>
          </div>

          <div className="hero-showcase">
            <ProductVisual colors={products[0].colors} name={products[0].name} large />
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
            <Link to="/catalogo">Ver catálogo completo</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className="category-card"
                key={category.id}
                to={`/catalogo?categoria=${category.id}`}
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
            <Link to="/catalogo?promocoes=true">Ver ofertas</Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="trust-band">
          <div>
            <span className="eyebrow">Experiência completa</span>
            <h2>Da busca ao pós-venda, tudo pensado para conversão.</h2>
          </div>
          <div className="trust-grid">
            <article>
              <strong>Checkout em etapas</strong>
              <span>Dados pessoais, entrega, frete, pagamento e revisão.</span>
            </article>
            <article>
              <strong>Conta do cliente</strong>
              <span>Pedidos, favoritos, endereços e segurança em um só lugar.</span>
            </article>
            <article>
              <strong>Admin separado</strong>
              <span>Produtos, estoque, pedidos, cupons e métricas da loja.</span>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
