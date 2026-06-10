import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductDetailsPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  )
}
