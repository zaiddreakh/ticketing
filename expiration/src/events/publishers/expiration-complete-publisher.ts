import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@zdtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.expirationComplete;
}
