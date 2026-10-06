export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** Agrega https:// si falta y valida que sea una URL web. Devuelve null si no es válida. */
export function normalizeUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return /^https?:\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}/i.test(withProtocol) ? withProtocol : null;
}
