import { createRequire } from 'node:module'
import { env } from './env.ts'

type SupabaseClientOptions = {
  auth?: {
    persistSession?: boolean
    autoRefreshToken?: boolean
  }
}

type SupabaseModule = {
  createClient: (url: string, key: string, options?: SupabaseClientOptions) => unknown
}

function loadSupabaseModule() {
  const require = createRequire(import.meta.url)

  try {
    return require('@supabase/supabase-js') as SupabaseModule
  } catch {
    throw new Error('Instale @supabase/supabase-js com npm install antes de usar o Supabase')
  }
}

function requireSupabaseConfig() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY antes de usar o Supabase')
  }

  return {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
    serviceKey: env.supabaseServiceKey,
  }
}

const { createClient } = loadSupabaseModule()
const supabaseConfig = requireSupabaseConfig()
const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, clientOptions)

export const supabaseAdmin = supabaseConfig.serviceKey
  ? createClient(supabaseConfig.url, supabaseConfig.serviceKey, clientOptions)
  : null
