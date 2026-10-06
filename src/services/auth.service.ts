import { AuthResponse } from '../types';
import { api } from './api';

export const authService = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    api<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
};
