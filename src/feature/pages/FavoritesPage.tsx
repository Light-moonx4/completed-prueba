import { useEffect, useState, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';
import { EventService } from '../services/eventService';
import { useFavorites, normalizeFavoriteList, extractEventId } from '../context/FavoritesContext';
import { EventCard } from '../components/events/EventCard';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import type { Event } from '../interfaces/Product';

/** Requiere sesión (protegida por <ProtectedRoute />). Lista los eventos guardados. */
export function FavoritesPage() {
  const { favoriteIds, loading: contextLoading } = useFavorites();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavoritesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await favoriteService.getMine();
      const list = normalizeFavoriteList(response);

      const resolvedEvents: Event[] = [];
      const missingEventIds: string[] = [];

      for (const fav of list) {
        // 1. Si viene en fav.event (estándar singular) o fav.events (posible typo del backend)
        const candidate =
          fav.event ||
          fav.events ||
          (('name' in fav && 'price' in fav) ? (fav as unknown as Event) : null);

        if (candidate && candidate.id !== undefined) {
          resolvedEvents.push(candidate);
        } else {
          const eid = extractEventId(fav);
          if (eid) {
            missingEventIds.push(eid);
          }
        }
      }

      // 2. Si el backend solo retornó los IDs sin el objeto del evento anidado, los cargamos
      if (missingEventIds.length > 0) {
        const fetched = await Promise.allSettled(
          missingEventIds.map((eid) => EventService.getById(eid))
        );
        for (const item of fetched) {
          if (item.status === 'fulfilled' && item.value) {
            resolvedEvents.push(item.value);
          }
        }
      }

      // 3. Respaldo: si el servidor retornó lista vacía pero hay favoritos marcados en la sesión, los resolvemos directamente
      if (resolvedEvents.length === 0 && favoriteIds.size > 0) {
        const fallbackFetched = await Promise.allSettled(
          Array.from(favoriteIds).map((eid) => EventService.getById(eid))
        );
        for (const item of fallbackFetched) {
          if (item.status === 'fulfilled' && item.value) {
            resolvedEvents.push(item.value);
          }
        }
      }

      setEvents(resolvedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los favoritos');
    } finally {
      setLoading(false);
    }
  }, [favoriteIds]);

  const favoriteKey = Array.from(favoriteIds).sort().join(',');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadFavoritesData();
  }, [loadFavoritesData, favoriteKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (loading || contextLoading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={loadFavoritesData} />;

  // Mantener visibles los eventos que sigan marcados como favoritos
  const visibleEvents =
    favoriteIds.size > 0
      ? events.filter((e) => favoriteIds.has(String(e.id)))
      : events;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Mis favoritos</h1>
      {visibleEvents.length === 0 ? (
        <EmptyState message="Todavía no has guardado eventos como favoritos." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
