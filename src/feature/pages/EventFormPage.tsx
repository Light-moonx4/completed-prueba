import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { categoryService } from '../services/categoryService';
import { EventService } from '../services/eventService';
import { EventForm } from '../components/events/EventForm';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import type { CreateEvent } from '../interfaces/Product';

/**
 * Un solo formulario (EventForm) reutilizado en dos entradas y también para editar:
 * - /events/new                     -> creación general, con <select> de categorías
 * - /events/new?categoryId=xxx      -> creación desde una categoría, categoryId fijo
 * - /events/:id/edit                -> edición de un evento existente
 */
export function EventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const fixedCategoryId = searchParams.get('categoryId') ?? undefined;
  const isEditing = Boolean(id);

  const { data: categories, loading: loadingCategories, error: categoriesError } = useFetch(
    () => categoryService.getAll(),
    []
  );

  const { data: product, loading: loadingProduct, error: productError } = useFetch(
    () => (id ? EventService.getById(id) : Promise.resolve(undefined)),
    [id]
  );

  const handleSubmit = async (data: CreateEvent) => {
    const saved = isEditing && id ? await EventService.update(id, data) : await EventService.create(data);
    const targetId = saved?.id ?? (saved as { data?: { id?: string } })?.data?.id ?? id;
    navigate(`/events/${targetId}`);
  };

  if (loadingCategories || (isEditing && loadingProduct)) return <Spinner label="Cargando formulario..." />;
  if (categoriesError) return <ErrorState message={categoriesError.message} />;
  if (isEditing && productError) return <ErrorState message={productError.message} />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">{isEditing ? 'Editar evento' : 'Nuevo evento'}</h1>
      <EventForm
        categories={categories ?? []}
        fixedCategoryId={!isEditing ? fixedCategoryId : undefined}
        initialEvent={product ?? undefined}
        submitLabel={isEditing ? 'Guardar cambios' : 'Crear evento'}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
