import request from 'supertest';
import app from '../server.js'; // Import the configured app

describe('User Authentication API', () => {

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.username).toBe('testuser');
  });

  it('should log in an existing user successfully', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail to log in with an incorrect password', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'failuser',
        email: 'fail@example.com',
        password: 'correctpassword',
      });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'fail@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });
});