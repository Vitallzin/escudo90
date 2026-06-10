import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatCurrency'
import { Button } from '../ui/Button'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image" aria-hidden="true">
        <span>{product.badge}</span>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <Button size="small">Comprar</Button>
        </div>
      </div>
    </article>
  )
}
