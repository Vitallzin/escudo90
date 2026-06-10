import { store } from '../../database/store.ts'
import type { RouteDefinition } from '../../types.ts'
import { asRecord } from '../../utils/http.ts'
import { createProduct, getProductById, listProducts, updateProduct } from './products.service.ts'

export const productRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/products',
    handler: ({ url }) => listProducts(url.searchParams),
  },
  {
    method: 'GET',
    path: '/products/:id',
    handler: ({ params }) => getProductById(params.id),
  },
  {
    method: 'POST',
    path: '/admin/products',
    auth: true,
    admin: true,
    handler: ({ body }) => createProduct(asRecord(body)),
  },
  {
    method: 'PATCH',
    path: '/admin/products/:id',
    auth: true,
    admin: true,
    handler: ({ params, body }) => updateProduct(params.id, asRecord(body)),
  },
  {
    method: 'GET',
    path: '/admin/inventory',
    auth: true,
    admin: true,
    handler: () =>
      store.products.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        status: product.stock <= 10 ? 'low_stock' : 'healthy',
      })),
  },
]
