import { request } from './api';
import type { Category, CreateCategory, UpdateCategory } from '../interfaces/Category';

export const categoryService = {
  getAll() {
    return request<Category[]>({ url: '/categories', method: 'GET' });
  },
  getById(id: string) {
    return request<Category>({ url: `/categories/${id}`, method: 'GET' });
  },
  create(data: CreateCategory) {
    return request<Category>({ url: '/categories', method: 'POST', data });
  },
  update(id: string, data: UpdateCategory) {
    return request<Category>({ url: `/categories/${id}`, method: 'PATCH', data });
  },
  remove(id: string) {
    return request<void>({ url: `/categories/${id}`, method: 'DELETE' });
  },
};
