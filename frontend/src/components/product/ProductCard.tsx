import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency'
import { Button } from '../ui/Button'
import { ProductVisual } from './ProductVisual'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.oldPrice)

  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`} className="product-image-link">
        <ProductVisual colors={product.colors} name={product.name} badge={product.badge} />
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
          <span>★ {product.rating}</span>
          <span>{product.reviews} avaliações</span>
          {discount && <strong>-{discount}%</strong>}
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
