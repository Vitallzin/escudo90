import { env } from '../config/env.ts'

type FirestoreValue = {
  stringValue?: string
  integerValue?: string
  doubleValue?: number
  booleanValue?: boolean
  arrayValue?: {
    values?: FirestoreValue[]
  }
}

type FirestoreDocument = {
  name?: string
  fields?: Record<string, FirestoreValue>
}

type RunQueryRow = {
  document?: FirestoreDocument
}

function getBaseUrl() {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    env.firebaseProjectId,
  )}/databases/(default)/documents`
}

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

function encodeValue(value: unknown): FirestoreValue {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value }
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } }
  }

  return { stringValue: String(value ?? '') }
}

function decodeValue(value: FirestoreValue | undefined): unknown {
  if (!value) return undefined
  if (value.stringValue !== undefined) return value.stringValue
  if (value.integerValue !== undefined) return Number(value.integerValue)
  if (value.doubleValue !== undefined) return value.doubleValue
  if (value.booleanValue !== undefined) return value.booleanValue
  if (value.arrayValue) return value.arrayValue.values?.map(decodeValue) ?? []

  return undefined
}

function encodeFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encodeValue(value)]))
}

function decodeDocument(document: FirestoreDocument) {
  return Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeValue(value)]),
  )
}

export async function setFirestoreDocument(
  collectionId: string,
  documentId: string,
  token: string,
  data: Record<string, unknown>,
) {
  if (!env.firebaseProjectId) return false

  const response = await fetch(`${getBaseUrl()}/${collectionId}/${encodeURIComponent(documentId)}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ fields: encodeFields(data) }),
  })

  return response.ok
}

export async function deleteFirestoreDocument(collectionId: string, documentId: string, token: string) {
  if (!env.firebaseProjectId) return false

  const response = await fetch(`${getBaseUrl()}/${collectionId}/${encodeURIComponent(documentId)}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  })

  return response.ok
}

export async function listFirestoreDocumentsByUser(collectionId: string, userId: string, token: string) {
  if (!env.firebaseProjectId) return null

  const response = await fetch(`${getBaseUrl()}:runQuery`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: userId },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    return null
  }

  const rows = (await response.json()) as RunQueryRow[]

  return rows
    .map((row) => row.document)
    .filter((document): document is FirestoreDocument => Boolean(document))
    .map((document) => ({
      id: document.name?.split('/').pop() ?? '',
      data: decodeDocument(document),
    }))
}
