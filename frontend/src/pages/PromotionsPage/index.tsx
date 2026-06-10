import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductListing } from '../../features/products'
import '../CatalogPage/CatalogPage.css'

const filters = [
  { label: 'Todas', value: 'todos' },
  { label: 'Times', value: 'times' },
  { label: 'Seleções', value: 'selecoes' },
  { label: 'Brasileirão', value: 'brasileirao' },
  { label: 'Premier League', value: 'premier-league' },
  { label: 'La Liga', value: 'la-liga' },
  { label: 'Champions League', value: 'champions-league' },
  { label: 'Retrô', value: 'retro' },
]

export function PromotionsPage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <ProductListing
          eyebrow="Promoções"
          title="Ofertas de camisas selecionadas."
          description="Aproveite descontos em clubes, seleções, competições e modelos retrô, mantendo a mesma ordenação do catálogo."
          filters={filters}
          promotions
        />
      </main>

      <Footer />
    </div>
  )
}
