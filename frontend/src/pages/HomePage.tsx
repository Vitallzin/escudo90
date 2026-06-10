import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { featuredProducts } from '../constants/products'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Nova Coleção 2026</span>
            <h1>Sinta a paixão do futebol em cada fibra.</h1>
            <p>
              As camisas mais icônicas do mundo, com qualidade premium e detalhes que fazem a diferença. Do clássico ao moderno, vista a sua história.
            </p>
            <div className="hero-actions">
              <Link to="/catalogo">
                <Button>Ver lançamentos</Button>
              </Link>
              <Button variant="secondary">Personalizar Camisa</Button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="stat">
              <strong>+500</strong>
              <span>Modelos</span>
            </div>
            <div className="stat">
              <strong>24h</strong>
              <span>Envio</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Original</span>
            </div>
            <div className="stat">
              <strong>Gratis</strong>
              <span>Troca</span>
            </div>
          </div>
        </section>

        <section id="catalogo">
          <div className="section-header">
            <div>
              <span className="eyebrow">Destaques</span>
              <h2>Coleção em Evidência</h2>
            </div>
            <Link to="/catalogo" className="view-all-link" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
              Ver tudo &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-content">
            <span className="eyebrow">Exclusividade</span>
            <h2>Faça parte do Clube Escudo Noventa</h2>
            <p>
              Receba ofertas exclusivas, lançamentos antecipados e 10% de desconto na sua primeira compra de camisas lendárias.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu melhor email" 
                className="newsletter-input"
                required
              />
              <Button type="submit">Cadastrar</Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
