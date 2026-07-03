import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseAuth, firestore } from '../config/firebase'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  document?: string
  createdAt: string
}

export type RegisterPayload = {
  name: string
  email: string
  phone?: string
  document?: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export const AuthService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (payload.password !== payload.confirmPassword) {
      throw new Error('As senhas nao conferem')
    }

    if (!payload.acceptTerms) {
      throw new Error('Aceite os termos para criar sua conta')
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
    const createdAt = new Date().toISOString()

    await updateProfile(credential.user, { displayName: payload.name })

    const user: AuthUser = {
      id: credential.user.uid,
      name: payload.name,
      email: credential.user.email ?? payload.email,
      role: 'customer',
      phone: payload.phone,
      document: payload.document,
      createdAt,
    }

    await setDoc(doc(firestore, 'users', credential.user.uid), {
      ...user,
      favorites: [],
      addresses: [],
    })

    return {
      user,
      token: await credential.user.getIdToken(),
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const credential = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
    const profileSnapshot = await getDoc(doc(firestore, 'users', credential.user.uid))
    const profile = profileSnapshot.data() as Partial<AuthUser> | undefined

    const user: AuthUser = {
      id: credential.user.uid,
      name: profile?.name ?? credential.user.displayName ?? credential.user.email ?? '',
      email: credential.user.email ?? payload.email,
      role: profile?.role ?? 'customer',
      phone: profile?.phone,
      document: profile?.document,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    }

    if (!profileSnapshot.exists()) {
      await setDoc(doc(firestore, 'users', credential.user.uid), {
        ...user,
        favorites: [],
        addresses: [],
      })
    }

    return {
      user,
      token: await credential.user.getIdToken(),
    }
  },

  async logout() {
    await signOut(firebaseAuth)
  },
}
