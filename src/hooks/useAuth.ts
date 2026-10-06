import { useCallback } from 'react';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';
import { useAuthStore } from '../store/authStore';

/** Restaura la sesión guardada al abrir la app. */
export async function restoreSession() {
  const { loadToken, setUser, logout, markHydrated } = useAuthStore.getState();
  try {
    if (await loadToken()) setUser(await usersService.me());
  } catch {
    await logout();
  } finally {
    markHydrated();
  }
}

export function useAuth() {
  const { user, token, setSession, logout } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    await setSession(res.token, res.user);
  }, [setSession]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    await setSession(res.token, res.user);
  }, [setSession]);

  return { user, isAuthenticated: !!token && !!user, login, register, logout };
}
