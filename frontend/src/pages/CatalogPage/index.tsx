import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductCard } from '../../features/products'
import { ProductService } from '../../services/productService'
import './CatalogPage.css'

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Brasileirão', value: 'brasileirao' },
  { label: 'Premier League', value: 'premier-league' },
  { label: 'La Liga', value: 'la-liga' },
  { label: 'Champions League', value: 'champions-league' },
  { label: 'Seleções', value: 'selecoes' },
  { label: 'Retrô', value: 'retro' },
]

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('relevancia')
  const activeFilter = searchParams.get('categoria') ?? 'todos'
  const onlyPromotions = searchParams.get('promocoes') === 'true'

  const filteredProducts = useMemo(() => {
    const items = ProductService.filterProducts({
      category: activeFilter,
      promotions: onlyPromotions,
    })

    return [...items].sort((a, b) => {
      if (sort === 'menor-preco') return a.price - b.price
      if (sort === 'maior-preco') return b.price - a.price
      if (sort === 'avaliacao') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [activeFilter, onlyPromotions, sort])

  function selectFilter(filter: string) {
    if (filter === 'todos') {
      setSearchParams({})
      return
    }

    setSearchParams({ categoria: filter })
  }

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
                className={`filter-button ${!onlyPromotions && activeFilter === filter.value ? 'active' : ''}`}
                key={filter.value}
                onClick={() => selectFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
            <button
              className={`filter-button ${onlyPromotions ? 'active' : ''}`}
              onClick={() => setSearchParams({ promocoes: 'true' })}
            >
              Promoções
            </button>
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
