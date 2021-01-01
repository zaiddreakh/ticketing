import express, { Request, Response } from 'express';
import { NotFoundError } from '@zdtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  let ticket;
  try {
    console.log(JSON.stringify(req.params));
    ticket = await Ticket.findById(req.params.id);
  } catch (e) {
    console.log('we are  fucked!');
    console.error(e);
  }

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
