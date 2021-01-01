import { Publisher, Subjects, TicketCreatedEvent } from '@zdtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.ticketCreated;
}
