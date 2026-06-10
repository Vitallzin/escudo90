import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductDetailsPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
