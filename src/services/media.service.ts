import { Photo, Song, Video } from '../types';
import { api } from './api';

export const mediaService = {
  photos: () => api<Photo[]>('/photos'),
  videos: () => api<Video[]>('/videos'),
  songs: (q?: string) => api<Song[]>(`/songs${q ? `?q=${encodeURIComponent(q)}` : ''}`),
};
