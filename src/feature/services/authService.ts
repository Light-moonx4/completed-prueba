import { request } from './api';
import type { AuthResponse, LoginCredentials, RegisterData } from '../interfaces/auth';
import type { User } from '../interfaces/user';

export const authService = {
  register(data: RegisterData) {
    return request<AuthResponse>({ url: '/auth/register', method: 'POST', data });
  },
  login(credentials: LoginCredentials) {
    return request<AuthResponse>({ url: '/auth/login', method: 'POST', data: credentials });
  },
  logout() {
    return request<void>({ url: '/auth/logout', method: 'POST' });
  },
  me() {
    return request<User>({ url: '/users/me', method: 'GET' });
  },
};
