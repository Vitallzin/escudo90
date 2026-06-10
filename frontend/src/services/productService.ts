import { categories, featuredProducts, products } from '../constants/products'
import type { CategoryCard, Product } from '../types/product'

type ProductFilters = {
  category?: string
  query?: string
  promotions?: boolean
  group?: 'teams' | 'selections'
}

export const ProductService = {
  getProducts(): Product[] {
    return products
  },

  getProductById(id: string): Product | undefined {
    return products.find((product) => product.id === id)
  },

  getCategories(): CategoryCard[] {
    return categories
  },

  getFeaturedProducts(): Product[] {
    return featuredProducts
  },

  filterProducts(filters: ProductFilters = {}): Product[] {
    let filtered = products

    if (filters.group === 'teams') {
      filtered = filtered.filter((product) => !isSelectionProduct(product))
    }

    if (filters.group === 'selections') {
      filtered = filtered.filter(isSelectionProduct)
    }

    if (filters.category && filters.category !== 'todos') {
      filtered = filtered.filter((product) => productMatchesFilter(product, filters.category!))
    }

    if (filters.promotions) {
      filtered = filtered.filter((product) => Boolean(product.oldPrice))
    }

    if (filters.query) {
      const lowQuery = filters.query.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowQuery) ||
          product.description.toLowerCase().includes(lowQuery),
      )
    }

    return filtered
  },
}

function productMatchesFilter(product: Product, filter: string) {
  if (filter === 'times') {
    return !isSelectionProduct(product)
  }

  if (filter === 'selecoes') {
    return isSelectionProduct(product)
  }

  if (filter === 'retro') {
    return isRetroProduct(product)
  }

  if (filter === 'atuais') {
    return !isRetroProduct(product)
  }

  return normalizeFilter(product.category) === filter || normalizeFilter(product.league) === filter
}

function isSelectionProduct(product: Product) {
  return normalizeFilter(product.category) === 'selecoes' || normalizeFilter(product.club).includes('selecao')
}

function isRetroProduct(product: Product) {
  return (
    normalizeFilter(product.category) === 'retro' ||
    normalizeFilter(product.season).includes('retro') ||
    normalizeFilter(product.name).includes('retro')
  )
}

function normalizeFilter(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}
