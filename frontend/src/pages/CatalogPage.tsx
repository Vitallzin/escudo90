import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { ProductCard } from '../components/product/ProductCard'
import { products } from '../constants/products'

const filters = ['Todos', 'Brasileirao', 'Premier League', 'La Liga', 'Champions League', 'Selecoes', 'Retro']

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('categoria')
  const [activeFilter, setActiveFilter] = useState(initialCategory === 'retro' ? 'Retro' : 'Todos')
  const [sort, setSort] = useState('relevancia')

  const filteredProducts = useMemo(() => {
    const items =
      activeFilter === 'Todos'
        ? products
        : products.filter((product) => product.league === activeFilter || product.category === activeFilter)

    return [...items].sort((a, b) => {
      if (sort === 'menor-preco') return a.price - b.price
      if (sort === 'maior-preco') return b.price - a.price
      if (sort === 'avaliacao') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [activeFilter, sort])

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="catalog-hero">
          <span className="eyebrow">Catálogo inteligente</span>
          <h1>Camisas para todos os estilos de torcedor.</h1>
          <p>
            Filtre por competição, descubra promoções, compare avaliações e
            encontre rapidamente o manto ideal para coleção, presente ou jogo.
          </p>
        </section>

        <section className="catalog-toolbar">
          <div className="filter-bar">
            {filters.map((filter) => (
              <button
                className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="select-field">
            <span>Ordenar</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevancia">Relevância</option>
              <option value="avaliacao">Melhor avaliação</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
            </select>
          </label>
        </section>

        <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
