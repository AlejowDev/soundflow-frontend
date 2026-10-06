import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { User } from '../types';

const TOKEN_KEY = 'soundflow.token';

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  loadToken: () => Promise<string | null>;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setSession: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    set({ token, user });
  },
  setUser: (user) => set({ user }),
  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },
  loadToken: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    set({ token });
    return token;
  },
  markHydrated: () => set({ hydrated: true }),
}));
