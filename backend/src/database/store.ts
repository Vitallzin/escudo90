import { seedStore } from './seed.ts'
import type { AppStore } from '../types.ts'

function cloneStore(): AppStore {
  return structuredClone(seedStore)
}

export const store = cloneStore()
