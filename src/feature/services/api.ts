import type { AxiosRequestConfig } from 'axios';
import { axiosClient } from '../lib/axiosClient';
import { toApiError } from '../error/ApiError';

/**
 * Función genérica reutilizable: tipa la respuesta según lo que le pida el que la llama.
 * Todos los servicios (auth, categorías, productos, favoritos) pasan por acá,
 * así que el try/catch/finally que normaliza errores queda en un solo lugar.
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  } finally {
    // Punto único para logging/telemetría futura de cada petición, sin importar el resultado.
  }
}
