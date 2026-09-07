import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800">Iniciar sesión</h1>
      <LoginForm />
      <p className="text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
