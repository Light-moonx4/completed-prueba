import { Link } from 'react-router-dom';
import type { Category } from '../../interfaces/Category';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
    >
      <h3 className="font-medium text-slate-800">{category.name}</h3>
      {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
    </Link>
  );
}
