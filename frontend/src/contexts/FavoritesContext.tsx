import { useEffect, useState, type ReactNode } from 'react'
import { FavoriteService } from '../services/favoriteService'
import { useAuth } from '../hooks/useAuth'
import { FavoritesContext } from './favorites-context'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const { isAuthenticated, token } = useAuth()

  useEffect(() => {
    let shouldUpdate = true

    async function loadFavorites() {
      if (!isAuthenticated || !token) {
        setFavoriteIds([])
        return
      }

      const favorites = await FavoriteService.getFavorites(token)

      if (shouldUpdate) {
        setFavoriteIds(favorites.map((product) => product.id))
      }
    }

    void loadFavorites()

    return () => {
      shouldUpdate = false
    }
  }, [isAuthenticated, token])

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId)
  }

  function toggleFavorite(productId: string) {
    const shouldRemove = favoriteIds.includes(productId)
    const nextFavorites = shouldRemove ? favoriteIds.filter((id) => id !== productId) : [...favoriteIds, productId]

    setFavoriteIds(nextFavorites)

    if (!token) {
      return
    }

    void (shouldRemove
      ? FavoriteService.removeFavorite(productId, token)
      : FavoriteService.addFavorite(productId, token).then((response) => setFavoriteIds(response.favorites)))
  }

  function removeFavorite(productId: string) {
    setFavoriteIds((current) => current.filter((id) => id !== productId))

    if (token) {
      void FavoriteService.removeFavorite(productId, token)
    }
  }

  return (
    <FavoritesContext
      value={{
        favoriteIds,
        totalFavorites: favoriteIds.length,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext>
  )
}
