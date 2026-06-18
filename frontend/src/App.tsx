import { BrowserRouter } from 'react-router-dom'
import { AddressProvider } from './contexts/AddressContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AddressProvider>
          <FavoritesProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </FavoritesProvider>
        </AddressProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
