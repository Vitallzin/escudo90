import { store } from '../../database/store.ts'
import type { CartItem, Product, User } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { getProductById } from '../products/products.service.ts'
import {
  deleteFirestoreDocument,
  listFirestoreDocumentsByUser,
  setFirestoreDocument,
} from '../../services/firestore-rest.service.ts'

type CartItemRow = {
  productId?: string
  product_id?: string
  size: string
  quantity: number
  updatedAt?: string
}

export type CartItemWithProduct = {
  product: Product
  size: string
  quantity: number
}

function getStoreCartItems(userId: string) {
  return store.cartItems.filter((item) => item.userId === userId)
}

async function getDatabaseCartItems(user: User) {
  if (!user.firebaseIdToken) {
    return null
  }

  const documents = await listFirestoreDocumentsByUser('userCartItems', user.id, user.firebaseIdToken)

  if (!documents) {
    return null
  }

  return documents
    .map((document) => document.data as CartItemRow)
    .sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')))
    .map(mapCartRow)
}

async function upsertDatabaseCartItem(user: User, item: CartItem) {
  if (!user.firebaseIdToken) {
    return false
  }

  const currentItems = await getDatabaseCartItems(user)
  const currentItem = currentItems?.find(
    (candidate) => candidate.productId === item.productId && candidate.size === item.size,
  )
  const nextQuantity = (currentItem?.quantity ?? 0) + item.quantity

  return setFirestoreDocument(
    'userCartItems',
    createUserProductDocumentId(user.id, item.productId, item.size),
    user.firebaseIdToken,
    {
      userId: user.id,
      product_id: item.productId,
      productId: item.productId,
      size: item.size,
      quantity: nextQuantity,
      updatedAt: new Date().toISOString(),
    },
  )
}

async function removeDatabaseCartItem(user: User, productId: string, size: string) {
  if (!user.firebaseIdToken) {
    return false
  }

  return deleteFirestoreDocument(
    'userCartItems',
    createUserProductDocumentId(user.id, productId, size),
    user.firebaseIdToken,
  )
}

async function clearDatabaseCart(user: User) {
  if (!user.firebaseIdToken) {
    return false
  }

  const documents = await listFirestoreDocumentsByUser('userCartItems', user.id, user.firebaseIdToken)

  if (!documents) {
    return false
  }

  await Promise.all(
    documents.map((document) => deleteFirestoreDocument('userCartItems', document.id, user.firebaseIdToken!)),
  )

  return true
}

function mapCartRow(row: CartItemRow): CartItem {
  return {
    productId: String(row.productId ?? row.product_id ?? ''),
    size: row.size,
    quantity: Number(row.quantity),
  }
}

function createUserProductDocumentId(userId: string, productId: string, size: string) {
  return `${userId}_${productId}_${size}`.replace(/[^a-zA-Z0-9_-]/g, '_')
}

async function hydrateCartItems(items: CartItem[]) {
  const hydratedItems = await Promise.all(
    items.map(async (item) => {
      try {
        const product = await getProductById(item.productId)

        return {
          product,
          size: item.size,
          quantity: item.quantity,
        }
      } catch {
        return null
      }
    }),
  )

  return hydratedItems.filter(Boolean) as CartItemWithProduct[]
}

async function getCartItems(user: User) {
  return (await getDatabaseCartItems(user)) ?? getStoreCartItems(user.id)
}

export async function getCart(user: User) {
  return {
    items: await hydrateCartItems(await getCartItems(user)),
  }
}

export async function addCartItem(user: User, input: Record<string, unknown>) {
  const item = {
    productId: String(input.productId ?? ''),
    size: String(input.size ?? ''),
    quantity: Number(input.quantity ?? 1),
  }
  const product = await getProductById(item.productId)

  assert(item.productId, 422, 'Produto obrigatorio')
  assert(item.size, 422, 'Tamanho obrigatorio')
  assert(Number.isInteger(item.quantity) && item.quantity > 0, 422, 'Quantidade invalida')
  assert(product.sizes.includes(item.size), 422, `Tamanho indisponivel para ${product.name}`)
  assert(product.stock >= item.quantity, 422, `Estoque insuficiente para ${product.name}`)

  const savedInDatabase = await upsertDatabaseCartItem(user, item)

  if (!savedInDatabase) {
    const currentItem = store.cartItems.find(
      (candidate) =>
        candidate.userId === user.id && candidate.productId === item.productId && candidate.size === item.size,
    )

    if (currentItem) {
      currentItem.quantity += item.quantity
    } else {
      store.cartItems.push({
        userId: user.id,
        ...item,
      })
    }
  }

  return getCart(user)
}

export async function removeCartItem(user: User, productId: string, size: string) {
  const removedFromDatabase = await removeDatabaseCartItem(user, productId, size)

  if (!removedFromDatabase) {
    store.cartItems = store.cartItems.filter(
      (item) => !(item.userId === user.id && item.productId === productId && item.size === size),
    )
  }
}

export async function clearCart(user: User) {
  const clearedFromDatabase = await clearDatabaseCart(user)

  if (!clearedFromDatabase) {
    store.cartItems = store.cartItems.filter((item) => item.userId !== user.id)
  }
}
