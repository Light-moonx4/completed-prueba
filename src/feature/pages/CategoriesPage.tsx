import { useFetch } from '../hooks/useFetch';
import { categoryService } from '../services/categoryService';
import { CategoryCard } from '../components/categories/CategoryCard';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

/** Listado público de categorías: visible sin iniciar sesión. */
export function CategoriesPage() {
  const { data: categories, loading, error, refetch } = useFetch(() => categoryService.getAll(), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Categorías</h1>

      {loading && <Spinner />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {!loading && !error && categories && categories.length === 0 && (
        <EmptyState message="Todavía no hay categorías creadas." />
      )}
      {!loading && !error && categories && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
