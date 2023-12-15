import request from 'supertest';
import { expect, describe, it, beforeEach, afterAll } from '@jest/globals';
import app from '../src/app';
import connection from '../src/models/connection';
import recreateDatabase from './recreateDatabase';

describe('Testa o endpoint de pedidos', () => {
  let token: string;
  beforeEach(async () => {
    await recreateDatabase(connection);

    const result = await request(app).post('/login').send({
      username: 'yraa',
      password: 'valarmorg',
    });
    token = result.body.token;
  });
  afterAll(() => {
    connection.end();
  });

  it('Será validado que é possível listar todos os pedidos com sucesso', async () => {
    const result = await request(app).get('/orders');

    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(3);
    expect(result.body).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ id: 1, userId: 1, productsIds: expect.arrayContaining([2]) })],
      ),
    );
    expect(result.body).toEqual(
      expect.arrayContaining(
        [expect
          .objectContaining({ id: 2, userId: 3, productsIds: expect.arrayContaining([3, 4]) })],
      ),
    );
    expect(result.body).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ id: 3, userId: 2, productsIds: expect.arrayContaining([5]) })],
      ),
    );
  });
  it('Será validado que não é possível cadastrar pedidos sem token', async () => {
    const result = await request(app).post('/orders').send({
      productsIds: [1, 2],
    });

    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toEqual('Token not found');
  });

  it('Será validado que não é possível cadastrar um pedido com token inválido', async () => {
    const result = await request(app).post('/orders').send({
      productsIds: 'amount',
    }).set('Authorization', 'Bearer 123');

    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toEqual('Invalid token');
  });

  it('Será validado que o campo "productsIds" é obrigatório"', async () => {
    const result = await request(app).post('/orders').send({
    }).set('Authorization', token);

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"productsIds" is required');
  });

  it(
    'Será validado que não é possível criar um pedido com o campo "productsIds" não sendo um array',
    async () => {
      const result = await request(app).post('/orders').send({
        productsIds: 'products',
      }).set('Authorization', token);

      expect(result.statusCode).toEqual(422);
      expect(result.body.message).toEqual('"productsIds" must be an array');
    },
  );

  it(
    'Será validado que não é possível criar um pedido com o campo "productsIds" vazio',
    async () => {
      const result = await request(app).post('/orders').send({
        productsIds: [],
      }).set('Authorization', token);

      expect(result.statusCode).toEqual(422);
      expect(result.body.message).toEqual('"productsIds" must include only numbers');
    },
  );

  it('Será validado que é possível criar um pedido com sucesso com 1', async () => {
    const loggedUserId = 3;
    const fakeProductId = 6;
    const fakeProduct = {
      name: 'café sem açúcar daquele naipão',
      amount: 'meio pão de queijo',
    };

    await request(app).post('/products').send(fakeProduct).set('Authorization', token);

    const result = await request(app).post('/orders').send({
      productsIds: [fakeProductId],
    }).set('Authorization', token);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    expect(result.body.userId).toBeDefined();
    expect(result.body.userId).toBe(3);
    expect(result.body.productsIds).toBeDefined();
    expect(result.body.productsIds).toEqual([fakeProductId]);

    const [selected] = await connection
      .execute('SELECT id, user_id as "userId" FROM Trybesmith.orders');
    const orders = selected as {
      id?: number
      userId: number
    }[];

    expect(orders).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ userId: loggedUserId, id: 4 })],
      ),
    );

    const [selectedProducts] = await connection
      .execute('SELECT id, name, amount, order_id as "orderId" FROM Trybesmith.products');
    const products = selectedProducts as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ ...fakeProduct, id: fakeProductId, orderId: 4 })],
      ),
    );
  });

  it('Será validado que é possível criar um pedido com sucesso com vários itens', async () => {
    const loggedUserId = 3;
    const orderId = 4;
    const fakeProductId = 6;
    const fakeProduct2Id = 7;
    const fakeProduct = {
      name: 'Mate Couro em garrafa de ouro',
      amount: '0.5 diamante',
    };
    const fakeProduct2 = {
      name: 'Porção de Falafel +7',
      amount: '1 moeda de prata',
    };
  
    await request(app).post('/products').send(fakeProduct).set('Authorization', token);
    await request(app).post('/products').send(fakeProduct2).set('Authorization', token);

    const result = await request(app).post('/orders').send({
      productsIds: [fakeProductId, fakeProduct2Id],
    }).set('Authorization', token);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    expect(result.body.userId).toBeDefined();
    expect(result.body.userId).toBe(loggedUserId);
    expect(result.body.productsIds).toBeDefined();
    expect(result.body.productsIds).toEqual([fakeProductId, fakeProduct2Id]);

    const [selected] = await connection
      .execute('SELECT id, user_id as "userId" FROM Trybesmith.orders');
    const orders = selected as {
      id?: number
      userId: number
    }[];

    expect(orders).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({ userId: loggedUserId, id: orderId })],
      ),
    );

    const [selectedProducts] = await connection
      .execute('SELECT id, name, amount, order_id as "orderId" FROM Trybesmith.products');
    const products = selectedProducts as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [
          expect.objectContaining({ ...fakeProduct, id: fakeProductId, orderId }),
          expect.objectContaining({ ...fakeProduct2, id: fakeProduct2Id, orderId }),
        ],
      ),
    );
  });
});
