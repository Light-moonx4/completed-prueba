import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClasses} end>
            Eventos
          </NavLink>
          <NavLink to="/categories" className={linkClasses}>
            Categorías
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={linkClasses}>
              Mis favoritos
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/categories/new" className={linkClasses}>
              Nueva categoría
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-500">
                {user?.name} <span className="text-xs text-slate-400">({user?.role})</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/register" className={linkClasses}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
