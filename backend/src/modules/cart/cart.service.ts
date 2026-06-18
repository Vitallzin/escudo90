import { isSupabaseConfigured, supabase, supabaseAdmin } from '../../config/supabase.ts'
import { store } from '../../database/store.ts'
import type { CartItem, Product, User } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { getProductById } from '../products/products.service.ts'

type CartItemRow = {
  product_id: string
  size: string
  quantity: number
}

export type CartItemWithProduct = {
  product: Product
  size: string
  quantity: number
}

function getClient() {
  return (supabaseAdmin ?? supabase) as any
}

function getStoreCartItems(userId: string) {
  return store.cartItems.filter((item) => item.userId === userId)
}

async function getDatabaseCartItems(userId: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return null
  }

  const { data, error } = await client
    .from('user_cart_items')
    .select('product_id, size, quantity')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error || !data) {
    return null
  }

  return (data as CartItemRow[]).map(mapCartRow)
}

async function upsertDatabaseCartItem(userId: string, item: CartItem) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return false
  }

  const currentItems = await getDatabaseCartItems(userId)
  const currentItem = currentItems?.find(
    (candidate) => candidate.productId === item.productId && candidate.size === item.size,
  )
  const nextQuantity = (currentItem?.quantity ?? 0) + item.quantity

  const { error } = await client.from('user_cart_items').upsert(
    {
      user_id: userId,
      product_id: item.productId,
      size: item.size,
      quantity: nextQuantity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,product_id,size' },
  )

  return !error
}

async function removeDatabaseCartItem(userId: string, productId: string, size: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return false
  }

  const { error } = await client
    .from('user_cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)

  return !error
}

async function clearDatabaseCart(userId: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return false
  }

  const { error } = await client.from('user_cart_items').delete().eq('user_id', userId)

  return !error
}

function mapCartRow(row: CartItemRow): CartItem {
  return {
    productId: row.product_id,
    size: row.size,
    quantity: Number(row.quantity),
  }
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

async function getCartItems(userId: string) {
  return (await getDatabaseCartItems(userId)) ?? getStoreCartItems(userId)
}

export async function getCart(user: User) {
  return {
    items: await hydrateCartItems(await getCartItems(user.id)),
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

  const savedInDatabase = await upsertDatabaseCartItem(user.id, item)

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
  const removedFromDatabase = await removeDatabaseCartItem(user.id, productId, size)

  if (!removedFromDatabase) {
    store.cartItems = store.cartItems.filter(
      (item) => !(item.userId === user.id && item.productId === productId && item.size === size),
    )
  }
}

export async function clearCart(user: User) {
  const clearedFromDatabase = await clearDatabaseCart(user.id)

  if (!clearedFromDatabase) {
    store.cartItems = store.cartItems.filter((item) => item.userId !== user.id)
  }
}
