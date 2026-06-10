import { ProductCard } from '../../products'
import { ProductService } from '../../../services/productService'

export function FavoritesPreview() {
  const favorites = ProductService.getProducts().slice(0, 3)

  return (
    <section className="favorites-preview" id="favoritos">
      <div className="table-header">
        <h2>Favoritos</h2>
        <span>{favorites.length} camisas salvas</span>
      </div>
      <div className="product-grid">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
