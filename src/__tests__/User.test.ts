import request from 'supertest';

import createConnection from '../database';

import { app } from '../app';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a user with existing e-mail', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
    });

    expect(response.status).toBe(400);
  });
});
