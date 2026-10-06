export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** Agrega https:// si falta y valida que sea una URL web. Devuelve null si no es válida. */
export function normalizeUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return /^https?:\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}/i.test(withProtocol) ? withProtocol : null;
}

/** Puntaje de 0 a 4 según longitud y variedad de caracteres. */
export function passwordStrength(password: string): number {
  if (password.length < 6) return password.length ? 1 : 0;
  let score = 1;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  else if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 0.5;
  return Math.min(4, Math.floor(score));
}
