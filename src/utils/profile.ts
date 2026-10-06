export interface ProfileEntry {
  title: string;
  place: string;
  detail: string;
}

/** "Título | Lugar | Detalle" por línea → entradas; una línea sin "|" queda solo como título. */
export function parseEntries(text: string | null): ProfileEntry[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, place = '', ...rest] = line.split('|').map((p) => p.trim());
      return { title, place, detail: rest.join(' | ') };
    });
}
