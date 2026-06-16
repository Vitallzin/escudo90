import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
