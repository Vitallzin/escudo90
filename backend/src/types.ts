import type { IncomingMessage, ServerResponse } from 'node:http'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS'

export type UserRole = 'customer' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  document?: string
  addresses: Address[]
  favorites: string[]
  createdAt: string
}

export type Address = {
  id: string
  label: string
  zipCode: string
  street: string
  number: string
  district: string
  city: string
  state: string
}

export type Product = {
  id: string
  name: string
  club: string
  season: string
  categoryId: string
  league: string
  country: string
  description: string
  price: number
  oldPrice?: number
  rating: number
  reviewsCount: number
  stock: number
  badge: string
  colors: string[]
  sizes: string[]
  images: string[]
  active: boolean
  createdAt: string
}

export type Category = {
  id: string
  name: string
  description: string
  slug: string
  active: boolean
}

export type CartItem = {
  productId: string
  size: string
  quantity: number
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'separating'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  userId: string
  items: CartItem[]
  couponCode?: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: PaymentMethod
  trackingCode?: string
  createdAt: string
}

export type PaymentMethod = 'credit_card' | 'pix' | 'mercado_pago'

export type Payment = {
  id: string
  orderId: string
  method: PaymentMethod
  status: 'created' | 'approved' | 'rejected' | 'refunded'
  amount: number
  provider: string
  createdAt: string
}

export type Coupon = {
  id: string
  code: string
  description: string
  percent: number
  active: boolean
  expiresAt: string
}

export type Review = {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}

export type AppStore = {
  users: User[]
  products: Product[]
  categories: Category[]
  orders: Order[]
  payments: Payment[]
  coupons: Coupon[]
  reviews: Review[]
}

export type RequestContext = {
  req: IncomingMessage
  res: ServerResponse
  method: HttpMethod
  url: URL
  params: Record<string, string>
  body: unknown
  user?: User
}

export type RouteHandler = (context: RequestContext) => Promise<unknown> | unknown

export type RouteDefinition = {
  method: HttpMethod
  path: string
  handler: RouteHandler
  auth?: boolean
  admin?: boolean
}

export type ApiErrorShape = {
  statusCode: number
  message: string
  details?: unknown
}
