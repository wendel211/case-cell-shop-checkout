import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CreateCheckoutDto } from './checkout.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CheckoutService {
  constructor(private readonly productsService: ProductsService) {}

  processCheckout(dto: CreateCheckoutDto) {
    const { productId, quantity } = dto;

    // Validar se productId foi enviado
    if (!productId) {
      throw new BadRequestException('productId é obrigatório.');
    }

    // Validar se quantity é número inteiro maior que zero
    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException(
        'quantity deve ser um número inteiro maior que zero.',
      );
    }

    // Buscar produto
    const product = this.productsService.findById(productId);

    if (!product) {
      throw new NotFoundException(`Produto "${productId}" não encontrado.`);
    }

    // Validar estoque
    if (product.stock < quantity) {
      throw new ConflictException(
        `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}, solicitado: ${quantity}.`,
      );
    }

    // Reduzir estoque
    this.productsService.decreaseStock(productId, quantity);

    const totalInCents = product.priceInCents * quantity;
    const orderId = `ord_${randomUUID().split('-')[0]}`;

    return {
      message: 'Compra realizada com sucesso.',
      orderId,
      productId,
      quantity,
      totalInCents,
      remainingStock: product.stock,
    };
  }
}
