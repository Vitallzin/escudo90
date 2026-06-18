import type { CartItem } from '../contexts/cart-context'
import { ProductService } from './productService'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

type ApiProduct = {
  id: string
}

type ApiCartItem = {
  product: ApiProduct
  size: string
  quantity: number
}

type CartResponse = {
  items: ApiCartItem[]
}

type ApiResponse<TData> = {
  data?: TData
  error?: { message?: string }
}

async function request<TData>(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (response.status === 204) {
    return undefined as TData
  }

  const payload = (await response.json()) as ApiResponse<TData>

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Nao foi possivel sincronizar o carrinho')
  }

  return payload.data as TData
}

async function mapCartItems(items: ApiCartItem[]): Promise<CartItem[]> {
  const products = await ProductService.getProducts()

  return items
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.product.id)

      if (!product) {
        return null
      }

      return {
        product,
        size: item.size,
        quantity: item.quantity,
      }
    })
    .filter(Boolean) as CartItem[]
}

export const CartService = {
  async getCart(token: string) {
    const cart = await request<CartResponse>('/cart', token)
    return mapCartItems(cart.items)
  },

  async addItem(productId: string, size: string, quantity: number, token: string) {
    const cart = await request<CartResponse>('/cart/items', token, {
      method: 'POST',
      body: JSON.stringify({ productId, size, quantity }),
    })

    return mapCartItems(cart.items)
  },

  async removeItem(productId: string, size: string, token: string) {
    await request<void>(`/cart/items/${encodeURIComponent(productId)}/${encodeURIComponent(size)}`, token, {
      method: 'DELETE',
    })
  },

  async clearCart(token: string) {
    await request<void>('/cart', token, {
      method: 'DELETE',
    })
  },
}
