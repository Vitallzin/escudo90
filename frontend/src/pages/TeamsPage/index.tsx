import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'
import { ProductListing } from '../../features/products'
import '../CatalogPage/CatalogPage.css'

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Brasileirão', value: 'brasileirao' },
  { label: 'Premier League', value: 'premier-league' },
  { label: 'La Liga', value: 'la-liga' },
  { label: 'Champions League', value: 'champions-league' },
  { label: 'Libertadores', value: 'libertadores' },
  { label: 'Retrô', value: 'retro' },
]

export function TeamsPage() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <ProductListing
          eyebrow="Camisas de times"
          title="Todos os times em um só catálogo."
          description="Encontre camisas de clubes nacionais e internacionais, com filtros por campeonato, coleção e modelos retrô."
          filters={filters}
          group="teams"
        />
      </main>

      <Footer />
    </div>
  )
}
