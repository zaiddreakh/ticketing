import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorisedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@zdtickets/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('orderId').not().isEmpty().withMessage('orderId is required'),
    body('token').not().isEmpty().withMessage('token is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('cannot pay for a cancelled order');
    }

    const stripeResponse = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: stripeResponse.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
