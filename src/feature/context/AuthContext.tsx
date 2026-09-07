import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../interfaces/user';
import type { LoginCredentials, RegisterData } from '../interfaces/auth';
import { authService } from '../services/authService';
import { ApiError } from '../error/ApiError';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearLocalSession = useCallback(() => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  }, []);

  // Al montar (o al recargar la página), si hay token guardado validamos que siga
  // vigente consultando /users/me. Si falla, cerramos sesión localmente.
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await authService.me();
        setUser(userData);
      } catch {
        clearLocalSession();
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, [token, clearLocalSession]);

  // El interceptor de Axios dispara este evento global cuando una petición
  // responde 401, para que la sesión se limpie sin importar desde qué
  // componente vino la llamada.
  useEffect(() => {
    const handleUnauthorized = () => clearLocalSession();
    window.addEventListener('auth-logout', handleUnauthorized);
    return () => window.removeEventListener('auth-logout', handleUnauthorized);
  }, [clearLocalSession]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al iniciar sesión.');
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    try {
      const response = await authService.register(data);
      localStorage.setItem('accessToken', response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al registrarse.');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Aunque falle en red, la sesión se limpia localmente igual.
    } finally {
      clearLocalSession();
    }
  }, [clearLocalSession]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- se mantiene junto al provider por simplicidad
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
