import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { CategoryForm } from '../components/categories/CategoryForm';
import type { CreateCategory } from '../interfaces/Category';

/** Ruta ya protegida por <AdminRoute /> a nivel de router. */
export function CategoryFormPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateCategory) => {
    const category = await categoryService.create(data);
    navigate(`/categories/${category.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Nueva categoría</h1>
      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}
