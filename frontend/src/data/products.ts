export type Product = {
  id: string
  name: string
  model: string
  priceInCents: number
  stock: number
}

export const products: Product[] = [
  {
    id: 'case-iphone-15',
    name: 'Capinha Silicone Transparente',
    model: 'iPhone 15',
    priceInCents: 3990,
    stock: 10,
  },
  {
    id: 'case-galaxy-s24',
    name: 'Capinha Anti Impacto',
    model: 'Galaxy S24',
    priceInCents: 4990,
    stock: 5,
  },
  {
    id: 'case-moto-g84',
    name: 'Capinha Fosca Preta',
    model: 'Moto G84',
    priceInCents: 2990,
    stock: 8,
  },
]
