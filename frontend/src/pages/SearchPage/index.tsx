import { SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductCard } from '../../features/products'
import { ProductService } from '../../services/productService'
import type { Product } from '../../types/product'
import './SearchPage.css'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let shouldUpdate = true

    async function searchProducts() {
      setIsLoading(true)
      const results = query ? await ProductService.filterProducts({ query }) : []

      if (shouldUpdate) {
        setProducts(results)
        setIsLoading(false)
      }
    }

    void searchProducts()

    return () => {
      shouldUpdate = false
    }
  }, [query])

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="search-heading">
          <div>
            <span className="eyebrow">Busca</span>
            <h1>{query ? `Resultado para "${query}"` : 'Pesquise uma camisa, clube ou seleção.'}</h1>
            <p>
              A busca aceita letras maiúsculas, minúsculas e termos sem acento, como Retro para encontrar modelos retrô.
            </p>
          </div>
          {query && <span>{products.length} encontrado(s)</span>}
        </section>

        {isLoading ? (
          <section className="empty-state">
            <h2>Procurando produtos...</h2>
          </section>
        ) : products.length > 0 ? (
          <section className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="search-empty">
            <SearchX aria-hidden="true" />
            <h2>Não encontramos nada para sua busca.</h2>
            <p>
              Confira se o nome foi digitado corretamente ou tente pesquisar por clube, seleção, campeonato ou modelo.
            </p>
            <div>
              <Link to="/times">Ver times</Link>
              <Link to="/selecoes">Ver seleções</Link>
              <Link to="/promocoes">Ver promoções</Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
