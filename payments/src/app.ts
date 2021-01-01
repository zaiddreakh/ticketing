import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@zdtickets/common';

import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); //so Express trusts traffic even though it's coming from ingress proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
// secure: process.env.NODE_ENV !== 'test',
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
