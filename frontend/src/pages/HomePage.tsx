import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { featuredProducts } from '../constants/products'

export function HomePage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Camisas oficiais e premium</span>
            <h1>Vista sua paixao com camisas de time selecionadas.</h1>
            <p>
              Loja completa para clubes, selecoes, edicoes especiais e kits
              personalizados com entrega rapida e compra segura.
            </p>
            <div className="hero-actions">
              <Button>Ver lancamentos</Button>
              <Button variant="secondary">Montar meu kit</Button>
            </div>
          </div>
          <div className="hero-panel" aria-label="Resumo da loja">
            <strong>+120</strong>
            <span>modelos em catalogo</span>
            <strong>24h</strong>
            <span>separacao de pedidos</span>
          </div>
        </section>

        <section className="section-header">
          <div>
            <span className="eyebrow">Destaques</span>
            <h2>Camisas mais procuradas</h2>
          </div>
          <a href="#catalogo">Ver catalogo</a>
        </section>

        <section className="product-grid" id="catalogo">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
