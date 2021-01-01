import request from 'supertest';
import { app } from '../../app';

it('returns 400 if email does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'zaid@test.com',
      password: 'password'
    })
    .expect(400);
});

it('returns 400 if password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'zaid@test.com',
      password: 'password'
    })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'zaid@test.com',
      password: 'wrongPass'
    })
    .expect(400);
});

it('responds with a cookie when given correct credentials ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'zaid@test.com',
      password: 'password'
    })
    .expect(201);


  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'zaid@test.com',
      password: 'password'
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});