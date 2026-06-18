import { useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CartService } from '../services/cartService'
import { CartContext, type CartItem } from './cart-context'
import type { Product } from '../types/product'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated, token } = useAuth()

  useEffect(() => {
    let shouldUpdate = true

    async function loadCart() {
      if (!isAuthenticated || !token) {
        setItems([])
        return
      }

      const nextItems = await CartService.getCart(token)

      if (shouldUpdate) {
        setItems(nextItems)
      }
    }

    void loadCart()

    return () => {
      shouldUpdate = false
    }
  }, [isAuthenticated, token])

  function addItem(product: Product, size: string, quantity: number) {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      )

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += quantity
        return newItems
      }

      return [...prevItems, { product, size, quantity }]
    })

    if (token) {
      void CartService.addItem(product.id, size, quantity, token).then(setItems)
    }
  }

  function removeItem(productId: string, size: string) {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.size === size))
    )

    if (token) {
      void CartService.removeItem(productId, size, token)
    }
  }

  function clearCart() {
    setItems([])

    if (token) {
      void CartService.clearCart(token)
    }
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext value={{ items, addItem, removeItem, clearCart, totalCount, subtotal }}>
      {children}
    </CartContext>
  )
}
