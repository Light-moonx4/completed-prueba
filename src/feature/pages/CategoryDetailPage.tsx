import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { categoryService } from '../services/categoryService';
import { EventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/events/EventCard';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const {
    data: category,
    loading: loadingCategory,
    error: categoryError,
    refetch: refetchCategory,
  } = useFetch(() => categoryService.getById(id!), [id]);

  const {
    data: productsPage,
    loading: loadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useFetch(() => EventService.getAll({ categoryId: id }), [id]);

  if (loadingCategory) return <Spinner label="Cargando categoría..." />;
  if (categoryError) return <ErrorState message={categoryError.message} onRetry={refetchCategory} />;
  if (!category) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{category.name}</h1>
          {category.description && <p className="mt-1 text-slate-500">{category.description}</p>}
        </div>
        {isAuthenticated && (
          <Link
            to={`/events/new?categoryId=${category.id}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Agregar producto a esta categoría
          </Link>
        )}
      </div>

      {loadingProducts && <Spinner label="Cargando productos..." />}
      {productsError && <ErrorState message={productsError.message} onRetry={refetchProducts} />}
      {!loadingProducts && !productsError && productsPage && productsPage.data.length === 0 && (
        <EmptyState message="Esta categoría todavía no tiene productos." />
      )}
      {!loadingProducts && !productsError && productsPage && productsPage.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productsPage.data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
