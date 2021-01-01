import { Publisher, Subjects, OrderCreatedEvent } from '@zdtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.orderCreated;
}
