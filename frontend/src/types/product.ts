export type Product = {
  id: string
  name: string
  club: string
  season: string
  category: string
  league: string
  country: string
  description: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  stock: number
  badge: string
  colors: string[]
  sizes: string[]
  image: string
}

export type CategoryCard = {
  id: string
  name: string
  description: string
  count: number
  color: string
}
