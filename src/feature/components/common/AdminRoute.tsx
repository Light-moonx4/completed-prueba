import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './Spinner';

/**
 * Solo deja pasar a usuarios con role: "admin". Un usuario autenticado pero sin
 * el rol necesario es redirigido (no solo se le oculta el botón), igual que un
 * usuario sin autenticar que intente entrar por URL directa.
 */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return <Spinner label="Verificando permisos..." />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace state={{ forbidden: true }} />;

  return <Outlet />;
}
