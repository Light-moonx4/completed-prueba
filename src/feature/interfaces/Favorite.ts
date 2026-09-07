import type { Event } from './Product';

export interface Favorite {
  id: string;
  eventId: string;
  userId?: string;
  event?: Event;
  events?: Event;
  name?: string;
  price?: number;
  createdAt?: string;
}
