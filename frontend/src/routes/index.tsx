import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { PromotionsPage } from '../pages/PromotionsPage'
import { RegisterPage } from '../pages/RegisterPage'
import { SearchPage } from '../pages/SearchPage'
import { SelectionsPage } from '../pages/SelectionsPage'
import { TeamsPage } from '../pages/TeamsPage'
import { ScrollToTop } from './ScrollToTop'

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<TeamsPage />} />
        <Route path="/times" element={<TeamsPage />} />
        <Route path="/selecoes" element={<SelectionsPage />} />
        <Route path="/promocoes" element={<PromotionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/produto/:id" element={<ProductDetailsPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/favoritos" element={<Navigate replace to="/carrinho#favoritos" />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </>
  )
}
