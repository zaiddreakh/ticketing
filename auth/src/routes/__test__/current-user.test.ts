import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../app';

it('responds with details about current user', async () => {
    const cookie = await global.signin();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual('zaid@test.com');
});

it('responds with null when not authenticated', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    expect(res.body.currentUser).toEqual(null);
});