import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
      <RegisterForm />
      <p className="text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
