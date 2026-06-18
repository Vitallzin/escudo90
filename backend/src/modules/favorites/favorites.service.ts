import { isSupabaseConfigured, supabase, supabaseAdmin } from '../../config/supabase.ts'
import type { Product, User } from '../../types.ts'
import { getProductById } from '../products/products.service.ts'

type FavoriteRow = {
  product_id: string
}

function getClient() {
  return (supabaseAdmin ?? supabase) as any
}

async function getFavoriteIdsFromDatabase(userId: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return null
  }

  const { data, error } = await client.from('user_favorites').select('product_id').eq('user_id', userId)

  if (error || !data) {
    return null
  }

  return (data as FavoriteRow[]).map((row) => row.product_id)
}

async function addFavoriteToDatabase(userId: string, productId: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return false
  }

  const { error } = await client.from('user_favorites').upsert(
    {
      user_id: userId,
      product_id: productId,
    },
    { onConflict: 'user_id,product_id' },
  )

  return !error
}

async function removeFavoriteFromDatabase(userId: string, productId: string) {
  const client = getClient()

  if (!isSupabaseConfigured || !client) {
    return false
  }

  const { error } = await client
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  return !error
}

export async function listFavorites(user: User) {
  const databaseFavoriteIds = await getFavoriteIdsFromDatabase(user.id)
  const favoriteIds = databaseFavoriteIds ?? user.favorites
  const products = await Promise.all(
    favoriteIds.map(async (productId) => {
      try {
        return await getProductById(productId)
      } catch {
        return null
      }
    }),
  )

  return products.filter(Boolean) as Product[]
}

export async function addFavorite(user: User, productId: string) {
  await getProductById(productId)

  const savedInDatabase = await addFavoriteToDatabase(user.id, productId)

  if (!savedInDatabase && !user.favorites.includes(productId)) {
    user.favorites.push(productId)
  }

  return {
    favorites: await getFavoriteIds(user),
  }
}

export async function removeFavorite(user: User, productId: string) {
  const removedFromDatabase = await removeFavoriteFromDatabase(user.id, productId)

  if (!removedFromDatabase) {
    user.favorites = user.favorites.filter((id) => id !== productId)
  }
}

export async function getFavoriteIds(user: User) {
  return (await getFavoriteIdsFromDatabase(user.id)) ?? user.favorites
}
