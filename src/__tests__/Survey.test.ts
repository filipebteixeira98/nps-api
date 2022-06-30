import request from 'supertest';

import createConnection from '../database';

import { app } from '../app';

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Title example',
      description: 'Description example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
