import request from 'supertest';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import app from '../src/app';
import connection from '../src/models/connection';
import recreateDatabase from './recreateDatabase';

describe('Testa o endpoint de produtos', () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  });

  it('Será validado que é possível cadastrar um produto com sucesso', async () => {
    const product = {
      name: 'Arco Escudo Invejável',
      amount: '3 Gemas da Noite',
    };

    const result = await request(app).post('/products').send(product);
    expect(result.statusCode).toEqual(201);
    expect(result.body.id).toBeDefined();
    expect(result.body.name).toEqual(product.name);
    expect(result.body.amount).toEqual(product.amount);

    const [selected] = await connection.execute('SELECT * FROM Trybesmith.products');
    const products = selected as {
      id?: number
      name: string
      amount: string
      orderId?: number
    }[];

    expect(products).toEqual(
      expect.arrayContaining(
        [expect.objectContaining(product)],
      ),
    );
  });
  it('Será validado que é possível listar todos os produtos com sucesso', async () => {
    const result = await request(app).get('/products');

    expect(result.statusCode).toEqual(200);
    expect(result.body).toBeDefined();
    expect(result.body.length).toEqual(6);
    expect(result.body[0].id).toBeDefined();
    expect(result.body[0].name).toEqual('Espada curta');
    expect(result.body[0].amount).toEqual('10 peças de ouro');
    expect(result.body[1].id).toBeDefined();
    expect(result.body[1].name).toEqual('Escudo desnecessariamente grande');
    expect(result.body[1].amount).toEqual('20 peças de ouro');
  });
});