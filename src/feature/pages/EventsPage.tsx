import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { EventService } from '../services/eventService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/events/EventCard';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

const PAGE_SIZE = 12;

export function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const { data: categories } = useFetch(() => categoryService.getAll(), []);

  const {
    data: productsPage,
    loading,
    error,
    refetch,
  } = useFetch(
    () => EventService.getAll({ search: search || undefined, categoryId: categoryId || undefined, page, limit: PAGE_SIZE }),
    [search, categoryId, page]
  );

  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in next)) params.delete('page');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Eventos</h1>
        {isAuthenticated && (
          <Link
            to="/events/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Nuevo evento
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 min-w-[200px] gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Buscar
          </button>
        </form>

        <select
          value={categoryId}
          onChange={(e) => updateParams({ categoryId: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas las categorías</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {!loading && !error && productsPage && productsPage.data.length === 0 && (
        <EmptyState message="No se encontraron productos con esos filtros." />
      )}
      {!loading && !error && productsPage && productsPage.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productsPage.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateParams({ page: String(page - 1) })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-500">
              Página {productsPage.page} de {productsPage.totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= (productsPage.totalPages || 1)}
              onClick={() => updateParams({ page: String(page + 1) })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
