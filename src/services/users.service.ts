import { UpdateUserInput, User } from '../types';
import { api } from './api';

export const usersService = {
  me: () => api<User>('/users/me'),
  updateMe: (data: UpdateUserInput) => api<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
};
