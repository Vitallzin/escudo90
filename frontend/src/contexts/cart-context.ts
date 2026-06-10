import { createContext } from 'react'
import type { Product } from '../types/product'

export type CartItem = {
  product: Product
  size: string
  quantity: number
}

export type CartContextData = {
  items: CartItem[]
  addItem: (product: Product, size: string, quantity: number) => void
  removeItem: (productId: string, size: string) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
}

export const CartContext = createContext<CartContextData>({} as CartContextData)
