import type { Product } from '../types/product'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

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
    throw new Error(payload.error?.message ?? 'Nao foi possivel sincronizar os favoritos')
  }

  return payload.data as TData
}

export const FavoriteService = {
  async getFavorites(token: string) {
    return request<Product[]>('/favorites', token)
  },

  async addFavorite(productId: string, token: string) {
    return request<{ favorites: string[] }>(`/favorites/${encodeURIComponent(productId)}`, token, {
      method: 'POST',
    })
  },

  async removeFavorite(productId: string, token: string) {
    return request<void>(`/favorites/${encodeURIComponent(productId)}`, token, {
      method: 'DELETE',
    })
  },
}
