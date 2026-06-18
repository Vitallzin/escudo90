import { Heart, Star } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { AuthRequiredNotice } from '../../auth'
import { useAuth } from '../../../hooks/useAuth'
import { useFavorites } from '../../../hooks/useFavorites'
import type { Product } from '../../../types/product'
import { formatCurrency, getDiscountPercent } from '../../../utils/formatCurrency'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.oldPrice)
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [showAuthNotice, setShowAuthNotice] = useState(false)
  const favorited = isFavorite(product.id)

  function handleFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (!isAuthenticated) {
      setShowAuthNotice(true)
      return
    }

    setShowAuthNotice(false)
    toggleFavorite(product.id)
  }

  return (
    <article className="product-card">
      <div className="product-photo-wrap">
        <Link to={`/produto/${product.id}`} className="product-image-link">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {discount && <span className="product-badge">-{discount}%</span>}
        <button
          aria-label={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          className={favorited ? 'favorite-button active' : 'favorite-button'}
          onClick={handleFavorite}
          type="button"
        >
          <Heart aria-hidden="true" fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span>{product.league}</span>
          <span>{product.season}</span>
        </div>

        <Link to={`/produto/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <p>{product.description}</p>

        <div className="rating-row">
          <span>
            <Star aria-hidden="true" />
            {product.rating}
          </span>
          <span>{product.reviews} avaliações</span>
          <span>{product.stock} em estoque</span>
        </div>

        <div className="product-footer">
          <div>
            {product.oldPrice && <span className="old-price">{formatCurrency(product.oldPrice)}</span>}
            <strong className="price">{formatCurrency(product.price)}</strong>
          </div>
          <Link to={`/produto/${product.id}`}>
            <Button size="small">Comprar</Button>
          </Link>
        </div>
      </div>
      {showAuthNotice && (
        <AuthRequiredNotice
          compact
          message="Para salvar camisas na sua lista de desejos, entre na sua conta."
          title="Login necessário"
        />
      )}
    </article>
  )
}
