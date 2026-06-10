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
          title="Seleções nacionais separadas dos clubes."
          description="Veja camisas de seleções do mundo todo e filtre entre modelos atuais e versões retrô."
          filters={filters}
          group="selections"
        />
      </main>

      <Footer />
    </div>
  )
}
