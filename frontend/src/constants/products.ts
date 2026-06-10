import type { Product } from '../types/product'

export const featuredProducts: Product[] = [
  {
    id: 'camisa-azul-1998',
    name: 'Camisa Azul Retro 1998',
    category: 'Retro',
    description: 'Modelo inspirado em uma era classica, com tecido leve.',
    price: 189.9,
    badge: '98',
  },
  {
    id: 'camisa-verde-home',
    name: 'Camisa Verde Home 2026',
    category: 'Clube',
    description: 'Camisa titular com acabamento premium e escudo bordado.',
    price: 249.9,
    badge: 'Home',
  },
  {
    id: 'camisa-branca-away',
    name: 'Camisa Branca Away',
    category: 'Selecao',
    description: 'Design limpo para colecionadores e uso no dia a dia.',
    price: 219.9,
    badge: 'Away',
  },
]
