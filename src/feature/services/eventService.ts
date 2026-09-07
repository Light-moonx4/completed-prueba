import { request } from './api';
import type { PaginatedResponse } from '../interfaces/pagination.type';
import type { Event, CreateEvent, UpdateEvent, EventQueryParams } from '../interfaces/Product';

export const EventService = {
  getAll(params: EventQueryParams = {}) {
    return request<PaginatedResponse<Event>>({ url: '/events', method: 'GET', params });
  },
  getById(id: string) {
    return request<Event>({ url: `/events/${id}`, method: 'GET' });
  },
  create(data: CreateEvent) {
    return request<Event>({ url: '/events', method: 'POST', data });
  },
  async update(id: string, data: UpdateEvent) {
    try {
      return await request<Event>({ url: `/events/${id}`, method: 'PATCH', data });
    } catch {
      return await request<Event>({ url: `/events/${id}`, method: 'PUT', data });
    }
  },
  remove(id: string) {
    return request<void>({ url: `/events/${id}`, method: 'DELETE' });
  },
};
