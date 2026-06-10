import { env } from './config/env.ts'
import { createApiServer, listRoutes } from './app.ts'

const server = createApiServer()

server.listen(env.port, () => {
  console.log(`${env.appName} rodando em http://localhost:${env.port}`)
  console.log(`Rotas carregadas: ${listRoutes().length}`)
})
