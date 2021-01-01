import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'LiverpoolxTottenham',
    price: 50,
  });
  await ticket.save();

  const cookie = global.signin();

  const createdOrder = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const retreivedOrder = await request(app)
    .get(`/api/orders/${createdOrder.body.id}`)
    .set('Cookie', cookie)
    .expect(200);
  expect(retreivedOrder.body.id).toEqual(createdOrder.body.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'LiverpoolxTottenham',
    price: 50,
  });
  await ticket.save();

  const createdOrder = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${createdOrder.body.id}`)
    .set('Cookie', global.signin())
    .expect(401);
});
