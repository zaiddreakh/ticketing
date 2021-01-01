import { Publisher, Subjects, TicketUpdatedEvent } from '@zdtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.ticketUpdated;
}
