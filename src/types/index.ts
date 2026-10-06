export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl: string | null;
  headline: string | null;
  university: string | null;
  studies: string | null;
  experience: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateUserInput = Partial<Pick<User, 'name' | 'headline' | 'university' | 'studies' | 'experience'>>;

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Photo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  /** Duración en segundos. */
  duration: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  coverUrl: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
