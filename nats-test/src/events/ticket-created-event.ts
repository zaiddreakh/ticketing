import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.ticketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
