import { Publisher, Subjects, PaymentCreatedEvent } from '@zdtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.paymentCreated;
}
