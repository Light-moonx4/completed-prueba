import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Envuelve la aplicación (ver App.tsx) y captura errores de renderizado que
 * escapen a los try/catch de las peticiones a la API, mostrando un fallback
 * amigable en vez de dejar una pantalla en blanco.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de renderizado capturado por ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Algo salió mal</h1>
          <p className="max-w-md text-slate-600">
            Ocurrió un error inesperado al mostrar esta parte de la aplicación. Puedes
            intentar recargar la página.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
