// URL del backend sin "/api". En un celular físico usa la IP o dominio público, no "localhost".
const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5006').replace(/\/+$/, '');

export const environment = {
  apiOrigin: API_ORIGIN,
  apiUrl: `${API_ORIGIN}/api`,
};

/** Convierte una ruta "/media/..." del backend en URL absoluta. */
export function mediaUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}
