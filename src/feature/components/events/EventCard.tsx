import { Link } from 'react-router-dom';
import type { Event } from '../../interfaces/Product';
import { EventImage } from './EventImage';
import { FavoriteButton } from './FavoriteButton';
import { formatPrice } from '../../utils/formatPrice';
import { getEventImageUrl } from '../../utils/imageHelper';

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
      <Link to={`/events/${event.id}`}>
        <EventImage src={getEventImageUrl(event)} alt={event.name} className="h-40 w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/events/${event.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
            {event.name}
          </Link>
          <FavoriteButton eventId={event.id} />
        </div>
        <p className="text-sm font-semibold text-indigo-600">{formatPrice(event.price)}</p>
        <p className="text-xs text-slate-400">Capacidad: {event.capacity}</p>
        {event.date && <p className="text-xs text-slate-400">Fecha: {event.date}</p>}
        {event.location && <p className="text-xs text-slate-400">Lugar: {event.location}</p>}
      </div>
    </div>
  );
}
