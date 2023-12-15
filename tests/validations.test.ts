/* trazer todas as validações para este arquivo */
import { expect, jest, describe, it } from '@jest/globals';

import request from 'supertest';
import app from '../src/app';

jest.mock('mysql2/promise', () => {
  const connectionError = new
  Error('Neste requisito de validação, não é necessário conectar com o banco de dados');
  const connectionMock = jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockRejectedValue(connectionError),
    query: jest.fn().mockRejectedValue(connectionError),
  }));

  return {
    createPool: connectionMock,
    createConnection: connectionMock,
    createPoolCluster: connectionMock,
  };
});

describe('Testa as validacoes', () => {
  it('Será validado que o campo "name" é obrigatório', async () => {
    const result = await request(app).post('/products').send({
      amount: 'amount',
    });

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"name" is required');
  });

  it('Será validado que o campo "name" tem o tipo string', async () => {
    const result = await request(app).post('/products').send({
      name: 1,
      amount: 'amount',
    });

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"name" must be a string');
  });

  it('Será validado que o campo "name" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post('/products').send({
      name: '1',
      amount: 'amount',
    });

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"name" length must be at least 3 characters long');
  });

  it('Será validado que o campo "amount" é obrigatório', async () => {
    const result = await request(app).post('/products').send({
      name: 'name',
    });

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"amount" is required');
  });

  it('Será validado que o campo "amount" tem o tipo string', async () => {
    const result = await request(app).post('/products').send({
      name: 'name',
      amount: 1,
    });

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"amount" must be a string');
  });

  it('Será validado que o campo "amount" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post('/products').send({
      name: 'name',
      amount: '1',
    });

    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"amount" length must be at least 3 characters long');
  });
  it('Será validado que o campo "username" é obrigatório', async () => {
    const result = await request(app).post('/users').send({
      level: 2,
      vocation: 'vocation',
      password: 'senha1234',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"username" is required');
  });

  it('Será validado que o campo "username" tem o tipo string', async () => {
    const result = await request(app).post('/users').send({
      username: 1,
      password: 'senha1234',
      level: 2,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"username" must be a string');
  });

  it('Será validado que o campo "username" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post('/users').send({
      username: 'Lê',
      password: 'senha1234',
      level: 2,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"username" length must be at least 3 characters long');
  });

  it('Será validado que o campo "vocation" é obrigatório', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"vocation" is required');
  });

  it('Será validado que o campo "vocation" tem o tipo string', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
      vocation: 1,
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"vocation" must be a string');
  });

  it('Será validado que o campo "vocation" é uma string com mais de 2 caracteres', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 2,
      vocation: 'vo',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"vocation" length must be at least 3 characters long');
  });

  it('Será validado que o campo "level" é obrigatório', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"level" is required');
  });

  it('Será validado que o campo "level" tem o tipo number', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 'um',
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"level" must be a number');
  });

  it('Será validado que o campo "level" deve ser um número maior que 0', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 'senha1234',
      level: 0,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"level" must be greater than or equal to 1');
  });

  it('Será validado que o campo "password" é obrigatório', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      level: 2,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('"password" is required');
  });

  it('Será validado que o campo "password" tem o tipo string', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: 12345678,
      level: 2,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"password" must be a string');
  });

  it('Será validado que o campo "password" é uma string com 8 ou mais caracteres', async () => {
    const result = await request(app).post('/users').send({
      username: 'username',
      password: '1234567',
      level: 2,
      vocation: 'vocation',
    });
    expect(result.statusCode).toEqual(422);
    expect(result.body.message).toEqual('"password" length must be at least 8 characters long');
  });
});