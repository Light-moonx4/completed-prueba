import { useState } from 'react';

/**
 * Una URL de imagen inválida o rota no debe romper el diseño de la página:
 * si falla la carga, mostramos un placeholder en vez del icono roto del navegador.
 *
 * El "failed" se resetea automáticamente al cambiar `src` porque este componente
 * se remonta con `key={src}` desde donde se usa (ver EventImageKeyed más abajo).
 */
function EventImageInner({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-xs text-slate-400 ${className ?? ''}`}
      >
        Sin imagen
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export function EventImage(props: { src?: string; alt: string; className?: string }) {
  return <EventImageInner key={props.src ?? 'no-image'} {...props} />;
}
