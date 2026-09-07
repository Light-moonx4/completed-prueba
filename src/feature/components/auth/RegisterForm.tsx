import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormField } from '../common/FormField';

export function RegisterForm() {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const next: typeof fieldErrors = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio.';
    if (!email.trim()) next.email = 'El correo es obligatorio.';
    if (!password || password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres.';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/', { replace: true });
    } catch {
      // El mensaje de error (400/409, ej. correo repetido) ya queda expuesto vía `error`.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Nombre" name="name" value={name} onChange={setName} error={fieldErrors.name} required />
      <FormField label="Correo" name="email" type="email" value={email} onChange={setEmail} error={fieldErrors.email} required />
      <FormField label="Contraseña" name="password" type="password" value={password} onChange={setPassword} error={fieldErrors.password} required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>
  );
}
