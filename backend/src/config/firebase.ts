import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { env } from './env.ts'

function isConfigured() {
  return Boolean(
    env.firebaseApiKey &&
      env.firebaseAuthDomain &&
      env.firebaseProjectId &&
      env.firebaseStorageBucket &&
      env.firebaseMessagingSenderId &&
      env.firebaseAppId,
  )
}

export const isFirebaseConfigured = isConfigured()

export const firebaseApp = isFirebaseConfigured
  ? getApps()[0] ??
    initializeApp({
      apiKey: env.firebaseApiKey,
      authDomain: env.firebaseAuthDomain,
      projectId: env.firebaseProjectId,
      storageBucket: env.firebaseStorageBucket,
      messagingSenderId: env.firebaseMessagingSenderId,
      appId: env.firebaseAppId,
      measurementId: env.firebaseMeasurementId || undefined,
    })
  : null

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null
