import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard } from '../components/product/ProductCard'
import { featuredProducts } from '../constants/products'
import { useState } from 'react'

export function CatalogPage() {
  const [filter, setFilter] = useState('Todos')
  const categories = ['Todos', ...new Set(featuredProducts.map(p => p.category))]

  const filteredProducts = filter === 'Todos' 
    ? featuredProducts 
    : featuredProducts.filter(p => p.category === filter)

  return (
    <div className="app-shell">
      <Header />
      <main>
        <div className="section-header">
          <div>
            <span className="eyebrow">Nosso Acervo</span>
            <h2>Catálogo Completo</h2>
          </div>
        </div>

        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-button ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
