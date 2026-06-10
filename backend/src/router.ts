import type { IncomingMessage, ServerResponse } from 'node:http'
import { getUserFromRequest } from './services/auth-context.service.ts'
import type { HttpMethod, RequestContext, RouteDefinition } from './types.ts'
import { ApiError } from './utils/api-error.ts'
import { readJsonBody, sendJson } from './utils/http.ts'

type CompiledRoute = RouteDefinition & {
  regex: RegExp
  paramNames: string[]
}

function compileRoute(route: RouteDefinition): CompiledRoute {
  const paramNames: string[] = []
  const pattern = route.path
    .split('/')
    .map((part) => {
      if (part.startsWith(':')) {
        paramNames.push(part.slice(1))
        return '([^/]+)'
      }

      return part
    })
    .join('/')

  return {
    ...route,
    regex: new RegExp(`^${pattern}$`),
    paramNames,
  }
}

export function createRouter(routes: RouteDefinition[]) {
  const compiledRoutes = routes.map(compileRoute)

  return async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const method = (req.method ?? 'GET') as HttpMethod
    const requestUrl = new URL(req.url ?? '/', 'http://localhost')
    const route = compiledRoutes.find((item) => item.method === method && item.regex.test(requestUrl.pathname))

    if (!route) {
      sendJson(res, 404, {
        error: {
          message: 'Rota não encontrada',
        },
      })
      return
    }

    const match = requestUrl.pathname.match(route.regex)
    const params = route.paramNames.reduce<Record<string, string>>((acc, name, index) => {
      acc[name] = decodeURIComponent(match?.[index + 1] ?? '')
      return acc
    }, {})
    const body = method === 'GET' || method === 'DELETE' ? undefined : await readJsonBody(req)
    const user = getUserFromRequest(req)

    if (route.auth && !user) {
      throw new ApiError(401, 'Autenticação obrigatória')
    }

    if (route.admin && user?.role !== 'admin') {
      throw new ApiError(403, 'Acesso permitido apenas para administradores')
    }

    const context: RequestContext = {
      req,
      res,
      method,
      url: requestUrl,
      params,
      body,
      user,
    }
    const result = await route.handler(context)

    if (!res.writableEnded) {
      sendJson(res, 200, {
        data: result,
      })
    }
  }
}
