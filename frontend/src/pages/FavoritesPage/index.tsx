import { Heart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { AuthRequiredNotice } from '../../features/auth'
import { ProductCard } from '../../features/products'
import { useAuth } from '../../hooks/useAuth'
import { useFavorites } from '../../hooks/useFavorites'
import { ProductService } from '../../services/productService'
import type { Product } from '../../types/product'
import './FavoritesPage.css'

export function FavoritesPage() {
  const { isAuthenticated } = useAuth()
  const { favoriteIds, removeFavorite } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let shouldUpdate = true

    async function loadProducts() {
      const nextProducts = await ProductService.getProducts()

      if (shouldUpdate) {
        setProducts(nextProducts)
      }
    }

    void loadProducts()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const favorites = products.filter((product) => favoriteIds.includes(product.id))

  return (
    <div className="app-shell">
      <Header />

      <main>
        <section className="page-title">
          <span className="eyebrow">Lista de desejos</span>
          <h1>Camisas favoritas</h1>
          <p>Salve produtos para comparar e comprar depois.</p>
        </section>

        {!isAuthenticated ? (
          <AuthRequiredNotice
            message="Entre para visualizar e salvar camisas na sua lista de desejos."
            title="Lista de desejos exclusiva para clientes"
          />
        ) : favorites.length === 0 ? (
          <section className="favorites-empty">
            <Heart aria-hidden="true" />
            <h2>Sua lista ainda esta vazia</h2>
            <p>Favorite camisas enquanto navega pelo catalogo.</p>
            <Link to="/times">
              <Button>Ver camisas</Button>
            </Link>
          </section>
        ) : (
          <section className="favorites-list">
            <div className="table-header">
              <h2>{favorites.length} produto(s) salvo(s)</h2>
              <span>Lista da sua conta</span>
            </div>
            <div className="product-grid">
              {favorites.map((product) => (
                <div className="favorite-product" key={product.id}>
                  <button aria-label={`Remover ${product.name}`} onClick={() => removeFavorite(product.id)} type="button">
                    <X aria-hidden="true" />
                  </button>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
