import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { favoriteService } from '../services/favoriteService';
import type { Favorite } from '../interfaces/Favorite';
import { ApiError } from '../error/ApiError';
import { useAuth } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components -- utilidades compartidas con FavoritesContext.test.ts
export function normalizeFavoriteList(res: unknown): Favorite[] {
  if (!res) return [];
  if (Array.isArray(res)) return res as Favorite[];
  if (typeof res === 'object') {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Favorite[];
    if (Array.isArray(obj.favorites)) return obj.favorites as Favorite[];
    if (Array.isArray(obj.items)) return obj.items as Favorite[];
    if (Array.isArray(obj.results)) return obj.results as Favorite[];
  }
  return [];
}

// eslint-disable-next-line react-refresh/only-export-components -- utilidades compartidas con FavoritesContext.test.ts
export function extractEventId(f: Favorite): string | undefined {
  if (!f) return undefined;
  const id =
    f.eventId ??
    (f as { event_id?: string | number }).event_id ??
    (f as { productId?: string | number }).productId ??
    f.event?.id ??
    f.events?.id;
  if (id !== undefined && id !== null) return String(id);
  if (f.id !== undefined && f.id !== null && ((f as unknown as Record<string, unknown>).name || (f as unknown as Record<string, unknown>).price)) {
    return String(f.id);
  }
  return undefined;
}

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteIds: Set<string>;
  isFavorite: (eventId: string | number) => boolean;
  toggleFavorite: (eventId: string | number) => Promise<void>;
  refetchFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * Mantiene en memoria el conjunto de eventos favoritos del usuario actual,
 * para que el ícono de favorito y la vista "Mis favoritos" se actualicen sin
 * recargar la página al agregar/quitar.
 */
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const response = await favoriteService.getMine();
      const safeList = normalizeFavoriteList(response);
      setFavorites(safeList);
      const ids = new Set<string>();
      for (const item of safeList) {
        const eid = extractEventId(item);
        if (eid) ids.add(eid);
      }
      setFavoriteIds(ids);
    } catch {
      // Si falla la carga inicial de favoritos, simplemente empezamos vacíos.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isFavorite = useCallback((eventId: string | number) => favoriteIds.has(String(eventId)), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (eventId: string | number) => {
      const idStr = String(eventId);
      const currentlyFavorite = favoriteIds.has(idStr);
      try {
        if (currentlyFavorite) {
          const fav = favorites.find((f) => extractEventId(f) === idStr);
          const targetId = fav?.id ? String(fav.id) : idStr;
          try {
            await favoriteService.remove(targetId);
          } catch (err) {
            if (targetId !== idStr) {
              await favoriteService.remove(idStr);
            } else {
              throw err;
            }
          }
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(idStr);
            return next;
          });
          setFavorites((prev) => prev.filter((f) => extractEventId(f) !== idStr));
        } else {
          const added = await favoriteService.add(idStr);
          setFavoriteIds((prev) => new Set(prev).add(idStr));
          if (added) {
            setFavorites((prev) => [...prev, added]);
          }
        }
      } catch (err) {
        // 409 (ya estaba en favoritos): sincronizar estado
        if (err instanceof ApiError && err.type === 'CONFLICT_ERROR') {
          setFavoriteIds((prev) => new Set(prev).add(idStr));
          return;
        }
        // 404 al quitar (ya no existía en el servidor): sincronizar estado
        if (err instanceof ApiError && err.type === 'NOT_FOUND_ERROR' && currentlyFavorite) {
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(idStr);
            return next;
          });
          return;
        }
        throw err;
      }
    },
    [favoriteIds, favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteIds, isFavorite, toggleFavorite, refetchFavorites: loadFavorites, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- se mantiene junto al provider por simplicidad
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  return context;
};
