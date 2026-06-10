import { Injectable } from '@nestjs/common';
import { Product } from './products.types';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
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
  ];

  findAll(): Product[] {
    return this.products;
  }
}
