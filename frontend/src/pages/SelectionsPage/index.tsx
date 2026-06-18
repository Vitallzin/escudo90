import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductListing } from '../../features/products'
import '../CatalogPage/CatalogPage.css'

const filters = [
  { label: 'Todas', value: 'todos' },
  { label: 'Atuais', value: 'atuais' },
  { label: 'Retrô', value: 'retro' },
]

export function SelectionsPage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <ProductListing
          eyebrow="Camisas de seleções"
          title="Camisas de seleções para torcer em grande estilo."
          description="Veja modelos de seleções do mundo todo, dos lançamentos atuais às versões retrô mais marcantes."
          filters={filters}
          group="selections"
        />
      </main>

      <Footer />
    </div>
  )
}
