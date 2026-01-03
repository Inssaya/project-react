import request from 'supertest';
import app from '../app.js';

describe('Auth endpoints', () => {
  const email = `test+${Date.now()}@example.com`;
  let token;

  test('register user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      full_name: 'Test User',
      role: 'student',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('login user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    token = res.body.data.token;
    expect(token).toBeTruthy();
  });
});
