import { useState } from 'react';
import type { CreateCategory } from '../../interfaces/Category';
import { FormField } from '../common/FormField';

interface CategoryFormProps {
  onSubmit: (data: CreateCategory) => Promise<void>;
}

/** Accesible únicamente para admin (protegido a nivel de ruta, ver AdminRoute). */
export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setNameError('El nombre es obligatorio.');
      return;
    }
    setNameError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la categoría.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <FormField label="Nombre" name="name" value={name} onChange={setName} error={nameError ?? undefined} required />
      <FormField label="Descripción" name="description" as="textarea" value={description} onChange={setDescription} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Creando...' : 'Crear categoría'}
      </button>
    </form>
  );
}
