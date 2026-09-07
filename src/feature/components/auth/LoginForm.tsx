import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormField } from '../common/FormField';

export function LoginForm() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const next: typeof fieldErrors = {};
    if (!email.trim()) next.email = 'El correo es obligatorio.';
    if (!password) next.password = 'La contraseña es obligatoria.';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch {
      // El mensaje de error (400/401/409 de la API) ya queda expuesto vía `error` del contexto.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Correo" name="email" type="email" value={email} onChange={setEmail} error={fieldErrors.email} required />
      <FormField label="Contraseña" name="password" type="password" value={password} onChange={setPassword} error={fieldErrors.password} required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
