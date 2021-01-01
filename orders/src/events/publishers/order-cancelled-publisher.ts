import { Publisher, Subjects, OrderCancelledEvent } from '@zdtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.orderCancelled;
}
