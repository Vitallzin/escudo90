type RuntimeEnv = 'development' | 'test' | 'production'

function readString(name: string, fallback = '') {
  return process.env[name]?.trim() || fallback
}

function readPort() {
  const port = Number(process.env.PORT ?? 3333)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT deve ser um numero inteiro positivo')
  }

  return port
}

function readNodeEnv(): RuntimeEnv {
  const nodeEnv = readString('NODE_ENV', 'development')

  if (nodeEnv === 'development' || nodeEnv === 'test' || nodeEnv === 'production') {
    return nodeEnv
  }

  throw new Error('NODE_ENV deve ser development, test ou production')
}

function readJwtSecret(nodeEnv: RuntimeEnv) {
  const jwtSecret = readString('JWT_SECRET', nodeEnv === 'production' ? '' : 'dev-secret-change-me')

  if (nodeEnv === 'production' && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres em producao')
  }

  return jwtSecret
}

const nodeEnv = readNodeEnv()

export const env = {
  appName: readString('APP_NAME', 'Escudo Noventa API'),
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  port: readPort(),
  jwtSecret: readJwtSecret(nodeEnv),
  allowedOrigin: readString('ALLOWED_ORIGIN', 'http://localhost:5173'),
  databaseUrl: readString('DATABASE_URL'),
  supabaseUrl: readString('SUPABASE_URL'),
  supabaseAnonKey: readString('SUPABASE_ANON_KEY'),
  supabaseServiceKey: readString('SUPABASE_SERVICE_ROLE_KEY'),
} as const
