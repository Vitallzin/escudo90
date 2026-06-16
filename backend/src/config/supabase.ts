import { createClient } from '@supabase/supabase-js'
import { env } from './env.ts'

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn(
    'WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in the environment variables.\n' +
    'Please verify your .env file.'
  )
}

// Cliente público/padrão (Anon Key)
// Usado para a grande maioria das operações com RLS habilitado.
export const supabase = createClient(
  env.supabaseUrl || 'https://placeholder.supabase.co',
  env.supabaseAnonKey || 'placeholder-anon-key'
)

// Cliente administrativo (Service Role Key)
// ATENÇÃO: Ignora as regras do RLS. Use com extrema cautela apenas no backend para tarefas administrativas.
export const supabaseAdmin = env.supabaseServiceKey
  ? createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null
