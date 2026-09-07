import { useEffect, useState } from 'react';
import { ApiError } from '../error/ApiError';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Gancho genérico reutilizable: dispara una petición (via `fetcher`) dentro de un
 * useEffect y tipa la respuesta según T. `deps` controla cuándo se vuelve a disparar,
 * para no generar peticiones infinitas. `refetch` incrementa un contador interno que
 * se agrega a la lista de dependencias para forzar una nueva petición bajo demanda.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, loading: true, error: null });
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetcher();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (err) {
        if (!cancelled) {
          const apiError = err instanceof ApiError ? err : new ApiError(0, 'Ocurrió un error inesperado.');
          setState({ data: null, loading: false, error: apiError });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadIndex]);

  const refetch = () => setReloadIndex((i) => i + 1);

  return { ...state, refetch };
}
