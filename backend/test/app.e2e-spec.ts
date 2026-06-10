import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/products (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toMatchObject({
      id: 'case-iphone-15',
      name: 'Capinha Silicone Transparente',
      model: 'iPhone 15',
      priceInCents: 3990,
      stock: 10,
    });
  });

  it('/checkout (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/checkout')
      .send({
        productId: 'case-iphone-15',
        quantity: 2,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      message: 'Compra realizada com sucesso.',
      productId: 'case-iphone-15',
      quantity: 2,
      totalInCents: 7980,
      remainingStock: 8,
    });
    expect(response.body.orderId).toMatch(/^ord_/);
  });

  afterEach(async () => {
    await app.close();
  });
});
