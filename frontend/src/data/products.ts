export type Product = {
  id: string
  name: string
  model: string
  priceInCents: number
  stock: number
  imageUrl: string
}

export type ApiProduct = Omit<Product, 'imageUrl'>

export const products: Product[] = [
  {
    id: 'case-iphone-15',
    name: 'Capinha Silicone Transparente',
    model: 'iPhone 15',
    priceInCents: 3990,
    stock: 10,
    imageUrl: '/silicone.jpeg',
  },
  {
    id: 'case-galaxy-s24',
    name: 'Capinha Anti Impacto',
    model: 'Galaxy S24',
    priceInCents: 4990,
    stock: 5,
    imageUrl: '/s24.jpg',
  },
  {
    id: 'case-moto-g84',
    name: 'Capinha Fosca Preta',
    model: 'Moto G84',
    priceInCents: 2990,
    stock: 8,
    imageUrl: '/fosca%20preta.jpg',
  },
]

const imageByProductId = products.reduce<Record<string, string>>(
  (images, product) => ({
    ...images,
    [product.id]: product.imageUrl,
  }),
  {},
)

export function addProductImages(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map((product) => ({
    ...product,
    imageUrl: imageByProductId[product.id] ?? '/favicon.svg',
  }))
}
