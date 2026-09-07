import type { Event } from '../interfaces/Product';

/**
 * Extrae la URL o data-URL válida de la imagen de un evento,
 * soportando `image`, `images` (string, array o JSON string) e `imageUrl`.
 */
export function getEventImageUrl(event?: Partial<Event> | null): string | undefined {
  if (!event) return undefined;
  const raw = event.image || event.images || (event as { imageUrl?: string }).imageUrl;

  if (!raw) return undefined;

  if (Array.isArray(raw)) {
    const first = raw[0];
    return typeof first === 'string' ? first.trim() || undefined : undefined;
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
          return parsed[0].trim() || undefined;
        }
      } catch {
        // En caso de que no sea un JSON válido, usar trimmed
      }
    }
    return trimmed || undefined;
  }

  return undefined;
}
