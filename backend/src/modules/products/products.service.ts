import { store } from '../../database/store.ts'
import { isSupabaseConfigured, supabaseAdmin, supabase } from '../../config/supabase.ts'
import type { Product } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'

type ProductRow = {
  id: string
  name: string
  club: string
  season: string
  category_id: string
  league: string
  country: string
  description: string | null
  price: number | string
  old_price: number | string | null
  rating: number | string
  reviews_count: number
  stock: number
  badge: string | null
  active: boolean
  created_at: string
  product_images?: { url: string; position: number }[]
  product_sizes?: { size: string }[]
  product_colors?: { color: string }[]
}

export async function listProducts(query: URLSearchParams) {
  const supabaseProducts = await listSupabaseProducts()
  const source = supabaseProducts ?? store.products
  const search = query.get('search')?.toLowerCase()
  const category = query.get('category')
  const league = query.get('league')
  const onlyPromotions = query.get('promotions') === 'true'

  return source.filter((product) => {
    const matchesActive = product.active
    const matchesSearch = search
      ? [product.name, product.club, product.country, product.league].some((value) => value.toLowerCase().includes(search))
      : true
    const matchesCategory = category ? product.categoryId === category || product.categoryId.endsWith(category) : true
    const matchesLeague = league ? product.league.toLowerCase() === league.toLowerCase() : true
    const matchesPromotion = onlyPromotions ? Boolean(product.oldPrice) : true

    return matchesActive && matchesSearch && matchesCategory && matchesLeague && matchesPromotion
  })
}

export async function getProductById(id: string) {
  const supabaseProduct = await getSupabaseProductById(id)
  const product = supabaseProduct ?? store.products.find((item) => item.id === id && item.active)

  assert(product, 404, 'Produto nao encontrado')

  return product
}

export function createProduct(input: Record<string, unknown>) {
  const product: Product = {
    id: String(input.id ?? createId('prd')),
    name: String(input.name ?? '').trim(),
    club: String(input.club ?? '').trim(),
    season: String(input.season ?? '').trim(),
    categoryId: String(input.categoryId ?? '').trim(),
    league: String(input.league ?? '').trim(),
    country: String(input.country ?? '').trim(),
    description: String(input.description ?? '').trim(),
    price: Number(input.price ?? 0),
    oldPrice: input.oldPrice ? Number(input.oldPrice) : undefined,
    rating: 0,
    reviewsCount: 0,
    stock: Number(input.stock ?? 0),
    badge: String(input.badge ?? 'Novo'),
    colors: Array.isArray(input.colors) ? input.colors.map(String) : ['#0047A1', '#FFD700'],
    sizes: Array.isArray(input.sizes) ? input.sizes.map(String) : ['P', 'M', 'G', 'GG'],
    images: Array.isArray(input.images) ? input.images.map(String) : [],
    active: true,
    createdAt: new Date().toISOString(),
  }

  assert(product.name.length >= 3, 422, 'Nome do produto obrigatorio')
  assert(product.price > 0, 422, 'Preco deve ser maior que zero')
  assert(product.stock >= 0, 422, 'Estoque nao pode ser negativo')

  store.products.push(product)
  return product
}

export function updateProduct(id: string, input: Record<string, unknown>) {
  const product = store.products.find((item) => item.id === id)
  assert(product, 404, 'Produto nao encontrado')

  Object.assign(product, {
    ...input,
    price: input.price === undefined ? product.price : Number(input.price),
    oldPrice: input.oldPrice === undefined ? product.oldPrice : Number(input.oldPrice),
    stock: input.stock === undefined ? product.stock : Number(input.stock),
  })

  return product
}

async function listSupabaseProducts() {
  const client = supabaseAdmin ?? supabase

  if (!isSupabaseConfigured || !client) {
    return null
  }

  const { data, error } = await client
    .from<ProductRow[]>('products')
    .select(
      '*, product_images(url, position), product_sizes(size), product_colors(color)',
    )
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return null
  }

  return data.map(mapProductRow)
}

async function getSupabaseProductById(id: string) {
  const client = supabaseAdmin ?? supabase

  if (!isSupabaseConfigured || !client) {
    return null
  }

  const { data, error } = await client
    .from<ProductRow>('products')
    .select(
      '*, product_images(url, position), product_sizes(size), product_colors(color)',
    )
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error || !data) {
    return null
  }

  return mapProductRow(data)
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    club: row.club,
    season: row.season,
    categoryId: row.category_id,
    league: row.league,
    country: row.country,
    description: row.description ?? '',
    price: Number(row.price),
    oldPrice: row.old_price === null ? undefined : Number(row.old_price),
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    stock: row.stock,
    badge: row.badge ?? 'Novo',
    colors: row.product_colors?.map((item) => item.color) ?? [],
    sizes: row.product_sizes?.map((item) => item.size) ?? [],
    images:
      row.product_images
        ?.slice()
        .sort((a, b) => a.position - b.position)
        .map((item) => item.url) ?? [],
    active: row.active,
    createdAt: row.created_at,
  }
}
