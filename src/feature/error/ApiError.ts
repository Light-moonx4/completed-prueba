import axios from 'axios';

export type ErrorType =
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'CONFLICT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error personalizado que distingue el tipo de fallo de una petición a la API.
 * Se justifica como clase (y no como objeto plano) porque necesita lógica propia
 * para resolver su `type` a partir del status HTTP, y para poder usar `instanceof`
 * en los bloques catch de toda la app.
 */
export class ApiError extends Error {
  public readonly type: ErrorType;
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = ApiError.resolveErrorType(status);
  }

  private static resolveErrorType(status: number): ErrorType {
    if (status === 0) return 'NETWORK_ERROR';
    if (status === 400) return 'VALIDATION_ERROR';
    if (status === 401 || status === 403) return 'AUTH_ERROR';
    if (status === 404) return 'NOT_FOUND_ERROR';
    if (status === 409) return 'CONFLICT_ERROR';
    return 'UNKNOWN_ERROR';
  }
}

/**
 * Normaliza cualquier error lanzado por Axios (o cualquier otro) a un ApiError,
 * distinguiendo: error de red (backend caído / sin respuesta), error de validación (400)
 * y no autorizado/prohibido (401/403), además de 404 y 409 para casos puntuales (favoritos).
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    // No hubo respuesta del servidor: backend caído, sin conexión, timeout, CORS, etc.
    if (!error.response) {
      return new ApiError(0, 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
    }

    const { status, data } = error.response;
    const backendMessage =
      (data && typeof data === 'object' && ('message' in data || 'error' in data)
        ? (data as { message?: string; error?: string }).message ?? (data as { error?: string }).error
        : undefined) ?? error.message;

    return new ApiError(status, backendMessage ?? 'Ocurrió un error inesperado.');
  }

  return new ApiError(0, 'Ocurrió un error inesperado.');
}
