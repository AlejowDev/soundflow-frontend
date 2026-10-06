import { environment } from '../config/environment';
import { useAuthStore } from '../store/authStore';

export class ApiRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  let res: Response;
  try {
    res = await fetch(`${environment.apiUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiRequestError('No se pudo conectar con el servidor', 0);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // Token vencido o inválido: cerramos sesión para volver al login.
    if (res.status === 401 && token) await useAuthStore.getState().logout();
    throw new ApiRequestError(body?.message ?? 'Ocurrió un error inesperado', res.status);
  }
  return body as T;
}
