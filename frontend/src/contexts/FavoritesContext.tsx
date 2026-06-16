import { useState, type ReactNode } from 'react'
import { FavoritesContext } from './favorites-context'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId)
  }

  function toggleFavorite(productId: string) {
    setFavoriteIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
  }

  function removeFavorite(productId: string) {
    setFavoriteIds((current) => current.filter((id) => id !== productId))
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
