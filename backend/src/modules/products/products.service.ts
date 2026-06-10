import { store } from '../../database/store.ts'
import type { Product } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'

export function listProducts(query: URLSearchParams) {
  const search = query.get('search')?.toLowerCase()
  const category = query.get('category')
  const league = query.get('league')
  const onlyPromotions = query.get('promotions') === 'true'

  return store.products.filter((product) => {
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

export function getProductById(id: string) {
  const product = store.products.find((item) => item.id === id && item.active)
  assert(product, 404, 'Produto não encontrado')

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

  assert(product.name.length >= 3, 422, 'Nome do produto obrigatório')
  assert(product.price > 0, 422, 'Preço deve ser maior que zero')
  assert(product.stock >= 0, 422, 'Estoque não pode ser negativo')

  store.products.push(product)
  return product
}

export function updateProduct(id: string, input: Record<string, unknown>) {
  const product = store.products.find((item) => item.id === id)
  assert(product, 404, 'Produto não encontrado')

  Object.assign(product, {
    ...input,
    price: input.price === undefined ? product.price : Number(input.price),
    oldPrice: input.oldPrice === undefined ? product.oldPrice : Number(input.oldPrice),
    stock: input.stock === undefined ? product.stock : Number(input.stock),
  })

  return product
}
