import brasilImage from '../assets/jersey-brasil.jpg'
import redImage from '../assets/jersey-red.jpg'
import blaugranaImage from '../assets/jersey-blaugrana.jpg'
import whiteImage from '../assets/jersey-white.jpg'
import skyblueImage from '../assets/jersey-skyblue.jpg'
import stripesImage from '../assets/jersey-stripes.jpg'
import { categories as fallbackCategories, products as fallbackProducts } from '../constants/products'
import type { CategoryCard, Product } from '../types/product'

type ProductFilters = {
  category?: string
  query?: string
  promotions?: boolean
  group?: 'teams' | 'selections'
}

type ApiProduct = {
  id: string
  name: string
  club: string
  season: string
  categoryId: string
  league: string
  country: string
  description: string
  price: number
  oldPrice?: number
  rating: number
  reviewsCount: number
  stock: number
  badge: string
  colors: string[]
  sizes: string[]
  images: string[]
}

type ApiCategory = {
  id: string
  name: string
  description?: string
  slug: string
}

type ApiResponse<TData> = {
  data: TData
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

const imageByProductId: Record<string, string> = {
  'brasil-1970-retro': brasilImage,
  'chelsea-home-2026': skyblueImage,
  'boca-juniors-home': redImage,
  'real-madrid-away': whiteImage,
  'manchester-city-third': skyblueImage,
  'milan-champions': stripesImage,
  'psg-special-gold': blaugranaImage,
  'corinthians-retro-1990': stripesImage,
}

let productsCache: Product[] | null = null
let categoriesCache: CategoryCard[] | null = null

async function request<TData>(path: string) {
  const response = await fetch(`${API_URL}${path}`)
  const payload = (await response.json()) as ApiResponse<TData>

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os dados do catalogo')
  }

  return payload.data
}

async function loadProducts() {
  const products = await request<ApiProduct[]>('/products')

  return products.map(mapApiProduct)
}

async function loadCategories() {
  const [products, categories] = await Promise.all([
    ProductService.getProducts(),
    request<ApiCategory[]>('/categories'),
  ])

  return categories.map((category) => ({
    id: category.slug,
    name: category.name,
    description: category.description ?? '',
    count: products.filter((product) => normalizeFilter(product.category) === category.slug).length,
    color: getCategoryColor(category.slug),
  }))
}

function mapApiProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    club: product.club,
    season: product.season,
    category: getCategoryName(product.categoryId),
    league: product.league,
    country: product.country,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    rating: product.rating,
    reviews: product.reviewsCount,
    stock: product.stock,
    badge: product.badge,
    colors: product.colors,
    sizes: product.sizes,
    image: imageByProductId[product.id] ?? getImageByCategory(product.categoryId),
  }
}

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    productsCache ??= await loadProducts()
    return productsCache
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await ProductService.getProducts()
    return products.find((product) => product.id === id)
  },

  async getCategories(): Promise<CategoryCard[]> {
    categoriesCache ??= await loadCategories()
    return categoriesCache
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await ProductService.getProducts()
    return products.slice(0, 6)
  },

  async filterProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let filtered = await ProductService.getProducts()

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

function getCategoryName(categoryId: string) {
  const categoryById: Record<string, string> = {
    cat_brasileirao: 'Brasileirao',
    cat_premier: 'Premier League',
    cat_laliga: 'La Liga',
    cat_champions: 'Champions League',
    cat_selecoes: 'Selecoes',
    cat_retro: 'Retro',
  }

  return categoryById[categoryId] ?? categoryId.replace('cat_', '')
}

function getCategoryColor(slug: string) {
  return fallbackCategories.find((category) => category.id === slug)?.color ?? '#0047A1'
}

function getImageByCategory(categoryId: string) {
  if (categoryId === 'cat_selecoes') return brasilImage
  if (categoryId === 'cat_laliga') return whiteImage
  if (categoryId === 'cat_premier') return skyblueImage
  if (categoryId === 'cat_champions') return stripesImage
  if (categoryId === 'cat_retro') return stripesImage

  return fallbackProducts[0]?.image ?? brasilImage
}
