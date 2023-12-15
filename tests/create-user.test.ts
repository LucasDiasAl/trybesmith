import request from 'supertest';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import app from '../src/app';
import connection from '../src/models/connection';
import recreateDatabase from './recreateDatabase';

describe('Testa o endpoint para o cadastro de pessoas usuárias', () => {
  beforeAll(async () => {
    await recreateDatabase(connection);
  });
  afterAll(() => {
    connection.end();
  });

  it('Será validado que é possível cadastrar a pessoa usuária com sucesso', async () => {
    const user = {
      username: 'catiau',
      password: 'senha1234',
      level: 2,
      vocation: 'vocation',
    };
    const result = await request(app).post('/users').send(user);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toBeDefined();
    expect(result.body.token).toBeDefined();
    const [selected] = await connection.execute('SELECT * FROM Trybesmith.users');
    const users = selected as {
      id?: number
      username: string
      vocation: string
      level: 1
      password: string
    }[];

    expect(users).toEqual(
      expect.arrayContaining(
        [expect.objectContaining(user)],
      ),
    );
  });
});
