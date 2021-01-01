import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

process.env.STRIPE_KEY =
  'sk_test_51I2NVEKrO8VLLdjMGGP3AL5Wh3jvtVU85k8rM1qvq3VLEAuX5gVgot5x5HvdTScMH2yFcWrIuyK8vPvbmHeeyrwT00BZUUaAII';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'sdfgfd';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //fake a cookie that contains a jwt token:
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object { jwt: my_jwt }
  const session = { jwt: token };

  // turn that session into json
  const sessionJSON = JSON.stringify(session);

  // encode the json as base64
  const encoded = Buffer.from(sessionJSON).toString('base64');

  // return a string that is the encoded data (what you see in the browser)
  // (supertest expects it in an array)
  return [`express:sess=${encoded}`];
};
