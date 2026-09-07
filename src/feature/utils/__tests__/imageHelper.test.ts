import { describe, it, expect } from 'vitest';
import { getEventImageUrl } from '../imageHelper';

describe('getEventImageUrl', () => {
  it('retorna undefined si el evento es nulo o indefinido', () => {
    expect(getEventImageUrl(null)).toBeUndefined();
    expect(getEventImageUrl(undefined)).toBeUndefined();
  });

  it('retorna la imagen si viene en la propiedad images (string)', () => {
    expect(getEventImageUrl({ images: 'https://example.com/photo.jpg' })).toBe('https://example.com/photo.jpg');
  });

  it('retorna la imagen si viene en la propiedad image (singular)', () => {
    expect(getEventImageUrl({ image: 'https://example.com/single.png' })).toBe('https://example.com/single.png');
  });

  it('retorna el primer elemento si images es un array', () => {
    expect(getEventImageUrl({ images: ['https://example.com/first.jpg', 'https://example.com/second.jpg'] })).toBe(
      'https://example.com/first.jpg'
    );
  });

  it('parsea correctamente un string JSON con array de imágenes', () => {
    expect(getEventImageUrl({ images: '["https://example.com/json-img.jpg"]' })).toBe(
      'https://example.com/json-img.jpg'
    );
  });

  it('soporta data URLs en base64 generadas al subir un archivo', () => {
    const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    expect(getEventImageUrl({ images: base64Data })).toBe(base64Data);
  });

  it('retorna undefined si no hay imágenes o la cadena está vacía', () => {
    expect(getEventImageUrl({ images: '   ' })).toBeUndefined();
    expect(getEventImageUrl({})).toBeUndefined();
  });
});
