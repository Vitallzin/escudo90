import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatCurrency'
import { Button } from '../ui/Button'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`} className="product-image-wrapper">
        <div className="product-image">
          {product.badge && <span className="badge">{product.badge}</span>}
          <div className="product-placeholder">👕</div>
        </div>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/produto/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong className="price">{formatCurrency(product.price)}</strong>
          <Link to={`/produto/${product.id}`}>
            <Button size="small">Ver Detalhes</Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
