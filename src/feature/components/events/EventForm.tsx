import { useEffect, useState } from 'react';
import type { Category } from '../../interfaces/Category';
import type { CreateEvent, Event } from '../../interfaces/Product';
import { FormField } from '../common/FormField';
import { getEventImageUrl } from '../../utils/imageHelper';

interface EventFormProps {
  categories: Category[];
  /** Si viene definido, el categoryId ya no es editable (entrada desde la vista de categoría). */
  fixedCategoryId?: string;
  initialEvent?: Event;
  submitLabel?: string;
  onSubmit: (data: CreateEvent) => Promise<void>;
}

type FormState = {
  name: string;
  description: string;
  price: string;
  capacity: string;
  date: string;
  location: string;
  categoryId: string;
  images: string;
};

const emptyState: FormState = { name: '', description: '', price: '', capacity: '', date: '', location: '', categoryId: '', images: '' };

/**
 * Un solo componente, reutilizado en dos entradas distintas (desde una categoría
 * con categoryId precargado, o desde la zona general de productos con el <select>
 * de categorías) y también para editar un producto existente.
 */
export function EventForm({ categories, fixedCategoryId, initialEvent, submitLabel = 'Guardar', onSubmit }: EventFormProps) {
  const [form, setForm] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sincroniza el formulario cuando llegan datos externos (producto cargado de forma
  // asíncrona para edición, o categoryId fijo al entrar desde una categoría).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialEvent) {
      setForm({
        name: initialEvent.name,
        description: initialEvent.description ?? '',
        price: String(initialEvent.price),
        capacity: String(initialEvent.capacity),
        date: initialEvent.date ? initialEvent.date.split('T')[0] : '',
        location: initialEvent.location ?? '',
        categoryId: initialEvent.categoryId,
        images: getEventImageUrl(initialEvent) ?? '',
      });
    } else if (fixedCategoryId) {
      setForm((prev) => ({ ...prev, categoryId: fixedCategoryId }));
    }
  }, [initialEvent, fixedCategoryId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const update = (field: keyof FormState) => (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.';
    if (!form.price || Number(form.price) <= 0) next.price = 'El precio debe ser mayor a 0.';
    if (!form.capacity || Number(form.capacity) < 0) next.capacity = 'La capacidad no puede ser negativa.';
    if (!form.date) next.date = 'La fecha es obligatoria.';
    if (!form.location.trim() || form.location.trim().length < 2)
      next.location = 'La ubicación debe tener al menos 2 caracteres.';
    if (!form.categoryId) next.categoryId = 'Selecciona una categoría.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, images: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      let imageVal = form.images.trim();
      if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
        try {
          imageVal = encodeURI(decodeURI(imageVal));
        } catch {
          // Mantener imageVal tal cual
        }
      }
      const imagesArray = imageVal ? [imageVal] : [];
      const dateFormatted = form.date.includes('T') ? form.date : new Date(`${form.date}T00:00:00.000Z`).toISOString();

      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        capacity: Number(form.capacity),
        date: dateFormatted,
        location: form.location.trim(),
        categoryId: form.categoryId,
        images: imagesArray,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo guardar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Nombre" name="name" value={form.name} onChange={update('name')} error={errors.name} required />
      <FormField label="Descripción" name="description" as="textarea" value={form.description} onChange={update('description')} />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Precio" name="price" type="number" value={form.price} onChange={update('price')} error={errors.price} required />
        <FormField label="Capacidad" name="capacity" type="number" value={form.capacity} onChange={update('capacity')} error={errors.capacity} required />
      </div>

      <FormField label="Fecha" name="date" type="date" value={form.date} onChange={update('date')} error={errors.date} required />
      <FormField label="Ubicación" name="location" value={form.location} onChange={update('location')} error={errors.location} required />

      {fixedCategoryId ? (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Categoría</span>
          <select
            disabled
            value={fixedCategoryId}
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
          >
            {categories
              .filter((c) => c.id === fixedCategoryId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => update('categoryId')(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.categoryId ? 'border-red-400' : 'border-slate-300'
            }`}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-600">{errors.categoryId}</p>}
        </div>
      )}

      {/* Sección de Imagen: Subida de archivo o URL */}
      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <label className="text-sm font-medium text-slate-700">Imagen del evento</label>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
            <span>Subir imagen desde equipo</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <span className="text-xs text-slate-400 text-center sm:text-left">o pega un enlace abajo</span>
        </div>

        <FormField label="URL directa de la imagen" name="images" value={form.images.startsWith('data:') ? '' : form.images} onChange={update('images')} />

        {form.images && (
          <div className="relative mt-2">
            <span className="text-xs font-medium text-slate-500">Vista previa:</span>
            <div className="relative mt-1 h-44 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={form.images} alt="Vista previa del evento" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, images: '' }))}
                className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow hover:bg-red-700"
              >
                Quitar imagen
              </button>
            </div>
          </div>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
