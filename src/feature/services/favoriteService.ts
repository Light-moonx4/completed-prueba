import { request } from './api';
import type { Favorite } from '../interfaces/Favorite';
import { ApiError } from '../error/ApiError';

export const favoriteService = {
  async getMine() {
    try {
      return await request<Favorite[] | { data: Favorite[] }>({ url: '/favorites', method: 'GET' });
    } catch (err) {
      try {
        return await request<Favorite[] | { data: Favorite[] }>({ url: '/favorites/my', method: 'GET' });
      } catch {
        throw err;
      }
    }
  },
  async add(eventId: string | number) {
    const idStr = String(eventId);
    const num = Number(eventId);
    const isNum = !isNaN(num) && !idStr.includes('-');
    const primary = isNum ? num : idStr;
    const fallback = isNum ? idStr : num;

    // 1. Intentar POST /favorites con body { eventId }
    try {
      return await request<Favorite>({ url: '/favorites', method: 'POST', data: { eventId: primary } });
    } catch (err) {
      // Si fue 404, la ruta puede ser POST /favorites/:id o POST /events/:id/favorite
      if (err instanceof ApiError && err.status === 404) {
        try {
          return await request<Favorite>({ url: `/favorites/${idStr}`, method: 'POST' });
        } catch (err2) {
          if (err2 instanceof ApiError && err2.status === 404) {
            try {
              return await request<Favorite>({ url: `/events/${idStr}/favorite`, method: 'POST' });
            } catch {
              throw err;
            }
          }
          throw err2;
        }
      }

      // Si fue 400 (error de validación en DTO)
      if (err instanceof ApiError && err.status === 400) {
        try {
          return await request<Favorite>({ url: '/favorites', method: 'POST', data: { eventId: fallback } });
        } catch (err2) {
          if (err2 instanceof ApiError && err2.status === 400) {
            // En caso de que el backend espere productId en vez de eventId
            try {
              return await request<Favorite>({ url: '/favorites', method: 'POST', data: { productId: primary } });
            } catch (err3) {
              if (err3 instanceof ApiError && err3.status === 400) {
                try {
                  return await request<Favorite>({ url: '/favorites', method: 'POST', data: { productId: fallback } });
                } catch {
                  throw err;
                }
              }
              throw err3;
            }
          }
          throw err2;
        }
      }

      throw err;
    }
  },
  async remove(id: string | number) {
    const idStr = String(id);
    try {
      return await request<void>({ url: `/favorites/${idStr}`, method: 'DELETE' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        try {
          return await request<void>({ url: `/events/${idStr}/favorite`, method: 'DELETE' });
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },
};
