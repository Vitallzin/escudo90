import { store } from '../../database/store.ts'
import type { Product } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { createId } from '../../utils/id.ts'
import { firestore, isFirebaseConfigured } from '../../config/firebase.ts'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'

type ProductDocument = Partial<Product> & {
  category_id?: string
  old_price?: number | string | null
  reviews_count?: number
  created_at?: string
  product_images?: { url: string; position: number }[]
  product_sizes?: { size: string }[]
  product_colors?: { color: string }[]
}

export async function listProducts(query: URLSearchParams) {
  const firebaseProducts = await listFirebaseProducts()
  const source = firebaseProducts ?? store.products
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
  const firebaseProduct = await getFirebaseProductById(id)
  const product = firebaseProduct ?? store.products.find((item) => item.id === id && item.active)

  assert(product, 404, 'Produto nao encontrado')

  return product
}

export async function createProduct(input: Record<string, unknown>) {
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

  const savedInDatabase = await saveFirebaseProduct(product)

  if (!savedInDatabase) {
    store.products.push(product)
  }

  return product
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  const product = store.products.find((item) => item.id === id)
  const firebaseProduct = product ? null : await getFirebaseProductById(id)
  const currentProduct = product ?? firebaseProduct

  assert(currentProduct, 404, 'Produto nao encontrado')

  const updatedProduct = {
    ...currentProduct,
    ...input,
    price: input.price === undefined ? currentProduct.price : Number(input.price),
    oldPrice: input.oldPrice === undefined ? currentProduct.oldPrice : Number(input.oldPrice),
    stock: input.stock === undefined ? currentProduct.stock : Number(input.stock),
  } as Product

  const savedInDatabase = await updateFirebaseProduct(id, updatedProduct)

  if (product) {
    Object.assign(product, updatedProduct)
  } else if (!savedInDatabase) {
    store.products.push(updatedProduct)
  }

  return updatedProduct
}

async function listFirebaseProducts() {
  if (!isFirebaseConfigured || !firestore) {
    return null
  }

  try {
    const snapshot = await getDocs(collection(firestore, 'products'))
    const products = snapshot.docs
      .map((document) => mapProductDocument(document.id, document.data() as ProductDocument))
      .filter((product) => product.active)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return products.length > 0 ? products : null
  } catch {
    return null
  }
}

async function getFirebaseProductById(id: string) {
  if (!isFirebaseConfigured || !firestore) {
    return null
  }

  try {
    const snapshot = await getDoc(doc(firestore, 'products', id))

    if (!snapshot.exists()) {
      return null
    }

    const product = mapProductDocument(snapshot.id, snapshot.data() as ProductDocument)

    return product.active ? product : null
  } catch {
    return null
  }
}

async function saveFirebaseProduct(product: Product) {
  if (!isFirebaseConfigured || !firestore) {
    return false
  }

  try {
    await setDoc(doc(firestore, 'products', product.id), product)
    return true
  } catch {
    return false
  }
}

async function updateFirebaseProduct(id: string, product: Product) {
  if (!isFirebaseConfigured || !firestore) {
    return false
  }

  try {
    await updateDoc(doc(firestore, 'products', id), { ...product })
    return true
  } catch {
    return false
  }
}

function mapProductDocument(id: string, row: ProductDocument): Product {
  return {
    id: String(row.id ?? id),
    name: String(row.name ?? ''),
    club: String(row.club ?? ''),
    season: String(row.season ?? ''),
    categoryId: String(row.categoryId ?? row.category_id ?? ''),
    league: String(row.league ?? ''),
    country: String(row.country ?? ''),
    description: row.description ?? '',
    price: Number(row.price),
    oldPrice:
      row.oldPrice === undefined && row.old_price === undefined
        ? undefined
        : Number(row.oldPrice ?? row.old_price),
    rating: Number(row.rating ?? 0),
    reviewsCount: Number(row.reviewsCount ?? row.reviews_count ?? 0),
    stock: Number(row.stock ?? 0),
    badge: row.badge ?? 'Novo',
    colors: row.colors ?? row.product_colors?.map((item) => item.color) ?? [],
    sizes: row.sizes ?? row.product_sizes?.map((item) => item.size) ?? [],
    images:
      row.images ??
      row.product_images
        ?.slice()
        .sort((a, b) => a.position - b.position)
        .map((item) => item.url) ?? [],
    active: row.active ?? true,
    createdAt: String(row.createdAt ?? row.created_at ?? new Date().toISOString()),
  }
}
