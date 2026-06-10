import { store } from '../../database/store.ts'
import type { Review, RouteDefinition } from '../../types.ts'
import { assert } from '../../utils/api-error.ts'
import { asRecord } from '../../utils/http.ts'
import { createId } from '../../utils/id.ts'

export const reviewRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/products/:productId/reviews',
    handler: ({ params }) => store.reviews.filter((review) => review.productId === params.productId),
  },
  {
    method: 'POST',
    path: '/products/:productId/reviews',
    auth: true,
    handler: ({ params, body, user }) => {
      const product = store.products.find((item) => item.id === params.productId)
      const input = asRecord(body)
      const rating = Number(input.rating ?? 0)

      assert(product, 404, 'Produto não encontrado')
      assert(rating >= 1 && rating <= 5, 422, 'Avaliação deve ser entre 1 e 5')

      const review: Review = {
        id: createId('rev'),
        productId: params.productId,
        userId: user!.id,
        rating,
        comment: String(input.comment ?? ''),
        createdAt: new Date().toISOString(),
      }

      store.reviews.push(review)
      product.reviewsCount += 1
      product.rating =
        store.reviews
          .filter((item) => item.productId === product.id)
          .reduce((sum, item) => sum + item.rating, 0) / product.reviewsCount

      return review
    },
  },
]
