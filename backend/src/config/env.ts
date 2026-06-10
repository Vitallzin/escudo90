export const env = {
  appName: process.env.APP_NAME ?? 'Escudo Noventa API',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
}
