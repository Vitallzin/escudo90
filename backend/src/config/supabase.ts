import { createRequire } from 'node:module'
import { env } from './env.ts'

type SupabaseClientOptions = {
  auth?: {
    persistSession?: boolean
    autoRefreshToken?: boolean
  }
}

type SupabaseResult<TData> = {
  data: TData | null
  error: { message: string } | null
}

type SupabaseQueryBuilder<TData> = PromiseLike<SupabaseResult<TData>> & {
  select: (columns: string) => SupabaseQueryBuilder<TData>
  eq: (column: string, value: string | number | boolean) => SupabaseQueryBuilder<TData>
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder<TData>
  single: () => Promise<SupabaseResult<TData>>
}

export type SupabaseClient = {
  from: <TData = unknown>(table: string) => SupabaseQueryBuilder<TData>
}

type SupabaseModule = {
  createClient: (url: string, key: string, options?: SupabaseClientOptions) => SupabaseClient
}

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}

function isConfigured() {
  return (
    env.supabaseUrl.startsWith('https://') &&
    env.supabaseUrl.includes('.supabase.co') &&
    !env.supabaseUrl.includes('seu-projeto') &&
    Boolean(env.supabaseAnonKey) &&
    env.supabaseAnonKey !== 'sua-anon-key-aqui'
  )
}

function loadSupabaseModule() {
  const require = createRequire(import.meta.url)

  try {
    return require('@supabase/supabase-js') as SupabaseModule
  } catch {
    return null
  }
}

function createSupabaseClients() {
  if (!isConfigured()) {
    return {
      supabase: null,
      supabaseAdmin: null,
      isSupabaseConfigured: false,
    }
  }

  const supabaseModule = loadSupabaseModule()

  if (!supabaseModule) {
    return {
      supabase: null,
      supabaseAdmin: null,
      isSupabaseConfigured: false,
    }
  }

  return {
    supabase: supabaseModule.createClient(env.supabaseUrl, env.supabaseAnonKey, clientOptions),
    supabaseAdmin:
      env.supabaseServiceKey && env.supabaseServiceKey !== 'sua-service-role-key-aqui'
        ? supabaseModule.createClient(env.supabaseUrl, env.supabaseServiceKey, clientOptions)
        : null,
    isSupabaseConfigured: true,
  }
}

export const { supabase, supabaseAdmin, isSupabaseConfigured } = createSupabaseClients()
