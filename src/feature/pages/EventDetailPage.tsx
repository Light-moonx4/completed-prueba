import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { EventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { EventImage } from '../components/events/EventImage';
import { FavoriteButton } from '../components/events/FavoriteButton';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { formatPrice } from '../utils/formatPrice';
import { ApiError } from '../error/ApiError';
import { getEventImageUrl } from '../utils/imageHelper';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: event, loading, error, refetch } = useFetch(() => EventService.getById(id!), [id]);

  const handleDelete = async () => {
    if (!event) return;
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await EventService.remove(event.id);
      navigate('/');
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'No se pudo eliminar el producto.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Cargando producto..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!event) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EventImage src={getEventImageUrl(event)} alt={event.name} className="h-72 w-full rounded-xl object-cover" />
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{event.name}</h1>
            <FavoriteButton eventId={event.id} />
          </div>
          <p className="text-xl font-semibold text-indigo-600">{formatPrice(event.price)}</p>
          <p className="text-sm text-slate-500">Capacity disponible: {event.capacity}</p>
          <p className="text-sm text-slate-500">Fecha: {event.date}</p>
          <p className="text-sm text-slate-500">Lugar: {event.location}</p>
          {event.description && <p className="text-slate-600">{event.description}</p>}

          {isAuthenticated && (
            <div className="mt-4 flex gap-3">
              <Link
                to={`/events/${event.id}/edit`}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          )}
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
        </div>
      </div>
    </div>
  );
}
