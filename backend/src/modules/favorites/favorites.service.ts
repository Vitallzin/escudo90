import type { Product, User } from '../../types.ts'
import { getProductById } from '../products/products.service.ts'
import {
  deleteFirestoreDocument,
  listFirestoreDocumentsByUser,
  setFirestoreDocument,
} from '../../services/firestore-rest.service.ts'

type FavoriteRow = {
  productId?: string
  product_id?: string
}

async function getFavoriteIdsFromDatabase(user: User) {
  if (!user.firebaseIdToken) {
    return null
  }

  const documents = await listFirestoreDocumentsByUser('userFavorites', user.id, user.firebaseIdToken)

  if (!documents) {
    return null
  }

  return documents.map((document) => {
    const row = document.data as FavoriteRow

    return String(row.productId ?? row.product_id ?? '')
  })
}

async function addFavoriteToDatabase(user: User, productId: string) {
  if (!user.firebaseIdToken) {
    return false
  }

  return setFirestoreDocument('userFavorites', createUserProductDocumentId(user.id, productId), user.firebaseIdToken, {
    userId: user.id,
    productId,
    user_id: user.id,
    product_id: productId,
    createdAt: new Date().toISOString(),
  })
}

async function removeFavoriteFromDatabase(user: User, productId: string) {
  if (!user.firebaseIdToken) {
    return false
  }

  return deleteFirestoreDocument('userFavorites', createUserProductDocumentId(user.id, productId), user.firebaseIdToken)
}

export async function listFavorites(user: User) {
  const databaseFavoriteIds = await getFavoriteIdsFromDatabase(user)
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

  const savedInDatabase = await addFavoriteToDatabase(user, productId)

  if (!savedInDatabase && !user.favorites.includes(productId)) {
    user.favorites.push(productId)
  }

  return {
    favorites: await getFavoriteIds(user),
  }
}

export async function removeFavorite(user: User, productId: string) {
  const removedFromDatabase = await removeFavoriteFromDatabase(user, productId)

  if (!removedFromDatabase) {
    user.favorites = user.favorites.filter((id) => id !== productId)
  }
}

export async function getFavoriteIds(user: User) {
  return (await getFavoriteIdsFromDatabase(user)) ?? user.favorites
}

function createUserProductDocumentId(userId: string, productId: string) {
  return `${userId}_${productId}`.replace(/[^a-zA-Z0-9_-]/g, '_')
}
