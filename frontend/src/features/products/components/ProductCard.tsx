import { Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import type { Product } from '../../../types/product'
import { formatCurrency, getDiscountPercent } from '../../../utils/formatCurrency'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.oldPrice)

  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`} className="product-image-link">
        <div className="product-photo-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
          {discount && <span className="product-badge">-{discount}%</span>}
          <button aria-label="Favoritar" className="favorite-button" onClick={(event) => event.preventDefault()}>
            <Heart aria-hidden="true" />
          </button>
        </div>
      </Link>

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
    </article>
  )
}
