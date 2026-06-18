import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { roundMoney } from '../../utils/money.ts'

const adminLogs = [
  {
    id: 'LOG-1008',
    type: 'admin_action',
    actor: 'Administrador Escudo Noventa',
    action: 'Alterou preco em massa: categoria Champions +5%',
    ip: '192.168.0.12',
    createdAt: '2026-06-18T03:10:00.000Z',
    severity: 'high',
  },
  {
    id: 'LOG-1007',
    type: 'access',
    actor: 'admin@escudonoventa.com',
    action: 'Login administrativo confirmado',
    ip: '192.168.0.12',
    createdAt: '2026-06-18T03:02:00.000Z',
    severity: 'low',
  },
  {
    id: 'LOG-1006',
    type: 'system_error',
    actor: 'Sistema',
    action: 'Falha temporaria no webhook de pagamento',
    ip: 'supabase-edge',
    createdAt: '2026-06-17T22:44:00.000Z',
    severity: 'medium',
  },
]

function toCsvRow(values: string[]) {
  return values.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')
}

export const adminRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/admin/dashboard',
    auth: true,
    admin: true,
    handler: () => {
      const revenue = store.orders
        .filter((order) => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0)
      const lowStock = store.products.filter((product) => product.stock <= 10)

      return {
        revenue: roundMoney(revenue),
        orders: store.orders.length,
        customers: store.users.filter((user) => user.role === 'customer').length,
        products: store.products.length,
        lowStock,
        topProducts: store.products
          .slice()
          .sort((a, b) => b.reviewsCount - a.reviewsCount)
          .slice(0, 5),
        security: {
          exclusiveAdmin: store.users.filter((user) => user.role === 'admin').length === 1,
          maxLoginAttempts: 5,
          sessionTimeoutMinutes: 30,
          strongPasswordPolicy: '12+ caracteres com letras, numeros e simbolos',
          twoFactorRecommended: true,
        },
      }
    },
  },
  {
    method: 'GET',
    path: '/admin/logs',
    auth: true,
    admin: true,
    handler: ({ url }) => {
      const type = url.searchParams.get('type')

      return {
        logs: type ? adminLogs.filter((log) => log.type === type) : adminLogs,
        filters: ['admin_action', 'system_error', 'access'],
      }
    },
  },
  {
    method: 'GET',
    path: '/admin/logs/export',
    auth: true,
    admin: true,
    handler: ({ res }) => {
      const header = 'id,tipo,quem,quando,o_que,ip,severidade'
      const rows = adminLogs.map((log) =>
        toCsvRow([log.id, log.type, log.actor, log.createdAt, log.action, log.ip, log.severity]),
      )
      const csv = [header, ...rows].join('\n')

      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="escudo90-admin-logs.csv"')
      res.end(csv)

      return null
    },
  },
]
