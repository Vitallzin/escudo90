import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductService } from '../../../services/productService'
import type { Product } from '../../../types/product'
import { ProductCard } from './ProductCard'

type ProductFilter = {
  label: string
  value: string
}

type ProductListingProps = {
  eyebrow: string
  title: string
  description: string
  filters: ProductFilter[]
  group?: 'teams' | 'selections'
  promotions?: boolean
}

export function ProductListing({
  eyebrow,
  title,
  description,
  filters,
  group,
  promotions = false,
}: ProductListingProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('relevancia')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const activeFilter = searchParams.get('filtro') ?? 'todos'

  useEffect(() => {
    let shouldUpdate = true

    async function loadProducts() {
      setIsLoading(true)
      const items = await ProductService.filterProducts({
        category: activeFilter,
        group,
        promotions,
      })

      if (shouldUpdate) {
        setProducts(items)
        setIsLoading(false)
      }
    }

    void loadProducts()

    return () => {
      shouldUpdate = false
    }
  }, [activeFilter, group, promotions])

  const filteredProducts = useMemo(() => sortProducts(products, sort), [products, sort])

  function selectFilter(filter: string) {
    if (filter === 'todos') {
      setSearchParams({})
      return
    }

    setSearchParams({ filtro: filter })
  }

  return (
    <>
      <section className="catalog-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="catalog-toolbar">
        <div className="filter-bar">
          {filters.map((filter) => (
            <button
              className={`filter-button ${activeFilter === filter.value ? 'active' : ''}`}
              key={filter.value}
              onClick={() => selectFilter(filter.value)}
            >
              {filter.label}
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

      {isLoading ? (
        <section className="empty-state">
          <h2>Carregando produtos...</h2>
        </section>
      ) : (
        <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </>
  )
}

function sortProducts(products: Product[], sort: string) {
  return [...products].sort((a, b) => {
    if (sort === 'menor-preco') return a.price - b.price
    if (sort === 'maior-preco') return b.price - a.price
    if (sort === 'avaliacao') return b.rating - a.rating
    return b.reviews - a.reviews
  })
}
