import { createContext } from 'react'

export type FavoritesContextData = {
  favoriteIds: string[]
  totalFavorites: number
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
}

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData)
