import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import { ProductsService } from '../products/products.service';

describe('CheckoutService', () => {
  let checkoutService: CheckoutService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: ProductsService,
          useValue: {
            findById: jest.fn(),
            decreaseStock: jest.fn(),
          },
        },
      ],
    }).compile();

    checkoutService = module.get<CheckoutService>(CheckoutService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('deve realizar uma compra com sucesso', () => {
    const mockProduct = {
      id: 'case-iphone-15',
      name: 'Capinha Silicone Transparente',
      model: 'iPhone 15',
      priceInCents: 3990,
      stock: 10,
    };

    jest.spyOn(productsService, 'findById').mockReturnValue(mockProduct);
    jest.spyOn(productsService, 'decreaseStock').mockImplementation(() => {
      mockProduct.stock -= 2;
    });

    const result = checkoutService.processCheckout({
      productId: 'case-iphone-15',
      quantity: 2,
    });

    expect(result.message).toBe('Compra realizada com sucesso.');
    expect(result.productId).toBe('case-iphone-15');
    expect(result.quantity).toBe(2);
    expect(result.totalInCents).toBe(7980);
    expect(result.remainingStock).toBe(8);
    expect(result.orderId).toMatch(/^ord_/);
  });

  it('deve lançar BadRequestException quando productId não for enviado', () => {
    expect(() =>
      checkoutService.processCheckout({
        productId: '',
        quantity: 1,
      }),
    ).toThrow(BadRequestException);
  });

  it('deve lançar BadRequestException quando quantity for zero', () => {
    expect(() =>
      checkoutService.processCheckout({
        productId: 'case-iphone-15',
        quantity: 0,
      }),
    ).toThrow(BadRequestException);
  });

  it('deve lançar BadRequestException quando quantity for negativa', () => {
    expect(() =>
      checkoutService.processCheckout({
        productId: 'case-iphone-15',
        quantity: -1,
      }),
    ).toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException quando produto não existir', () => {
    jest.spyOn(productsService, 'findById').mockReturnValue(undefined);

    expect(() =>
      checkoutService.processCheckout({
        productId: 'produto-inexistente',
        quantity: 1,
      }),
    ).toThrow(NotFoundException);
  });

  it('deve lançar ConflictException quando estoque for insuficiente', () => {
    const mockProduct = {
      id: 'case-galaxy-s24',
      name: 'Capinha Anti Impacto',
      model: 'Galaxy S24',
      priceInCents: 4990,
      stock: 2,
    };

    jest.spyOn(productsService, 'findById').mockReturnValue(mockProduct);

    expect(() =>
      checkoutService.processCheckout({
        productId: 'case-galaxy-s24',
        quantity: 5,
      }),
    ).toThrow(ConflictException);
  });

  it('deve reduzir o estoque depois de uma compra bem-sucedida', () => {
    const mockProduct = {
      id: 'case-moto-g84',
      name: 'Capinha Fosca Preta',
      model: 'Moto G84',
      priceInCents: 2990,
      stock: 8,
    };

    jest.spyOn(productsService, 'findById').mockReturnValue(mockProduct);
    jest.spyOn(productsService, 'decreaseStock').mockImplementation(() => {
      mockProduct.stock -= 3;
    });

    const result = checkoutService.processCheckout({
      productId: 'case-moto-g84',
      quantity: 3,
    });

    expect(productsService.decreaseStock).toHaveBeenCalledWith(
      'case-moto-g84',
      3,
    );
    expect(result.remainingStock).toBe(5);
  });
});
