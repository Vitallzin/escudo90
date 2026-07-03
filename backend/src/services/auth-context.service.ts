import { store } from '../database/store.ts'
import type { IncomingMessage } from 'node:http'
import { getBearerToken } from '../utils/http.ts'
import { verifyToken } from './token.service.ts'
import { env } from '../config/env.ts'
import type { User, UserRole } from '../types.ts'

type FirebaseLookupResponse = {
  users?: {
    localId: string
    email?: string
    displayName?: string
  }[]
}

type FirestoreValue = {
  stringValue?: string
  arrayValue?: {
    values?: FirestoreValue[]
  }
}

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>
}

export async function getUserFromRequest(req: IncomingMessage) {
  const token = getBearerToken(req)

  if (!token) {
    return undefined
  }

  const payload = verifyToken(token)

  if (payload) {
    return store.users.find((user) => user.id === payload.userId)
  }

  return getFirebaseUserFromToken(token)
}

async function getFirebaseUserFromToken(token: string) {
  if (!env.firebaseApiKey || !env.firebaseProjectId) {
    return undefined
  }

  try {
    const lookupResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.firebaseApiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      },
    )

    if (!lookupResponse.ok) {
      return undefined
    }

    const lookupPayload = (await lookupResponse.json()) as FirebaseLookupResponse
    const firebaseUser = lookupPayload.users?.[0]

    if (!firebaseUser?.localId) {
      return undefined
    }

    return (await getFirestoreUser(firebaseUser.localId, token)) ?? {
      id: firebaseUser.localId,
      name: firebaseUser.displayName ?? firebaseUser.email ?? 'Cliente',
      email: firebaseUser.email ?? '',
      password: '',
      role: 'customer',
      addresses: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      firebaseIdToken: token,
    }
  } catch {
    return undefined
  }
}

async function getFirestoreUser(userId: string, token: string) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      env.firebaseProjectId,
    )}/databases/(default)/documents/users/${encodeURIComponent(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    return null
  }

  const document = (await response.json()) as FirestoreDocument
  const fields = document.fields ?? {}

  return {
    id: userId,
    name: readString(fields.name) || readString(fields.email) || 'Cliente',
    email: readString(fields.email),
    password: '',
    role: readRole(fields.role),
    phone: readString(fields.phone) || undefined,
    document: readString(fields.document) || undefined,
    addresses: [],
    favorites: readStringArray(fields.favorites),
    createdAt: readString(fields.createdAt) || new Date().toISOString(),
    firebaseIdToken: token,
  } satisfies User
}

function readString(value: FirestoreValue | undefined) {
  return value?.stringValue ?? ''
}

function readRole(value: FirestoreValue | undefined): UserRole {
  return readString(value) === 'admin' ? 'admin' : 'customer'
}

function readStringArray(value: FirestoreValue | undefined) {
  return value?.arrayValue?.values?.map((item) => item.stringValue ?? '').filter(Boolean) ?? []
}
