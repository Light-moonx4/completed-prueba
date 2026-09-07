import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

/** Visible solo para usuarios autenticados; refleja si el producto ya está guardado. */
export function FavoriteButton({ eventId }: { eventId: string }) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);

  if (!isAuthenticated) return null;

  const active = isFavorite(eventId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      await toggleFavorite(eventId);
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
      alert(`No se pudo actualizar favoritos: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`rounded-full border p-2 text-lg transition ${
        active ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-300 text-slate-400 hover:text-rose-400'
      } disabled:opacity-50`}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}
