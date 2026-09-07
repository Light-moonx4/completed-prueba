import { describe, it, expect } from 'vitest';
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  it('formatea un número entero como precio en USD', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('formatea decimales redondeando a dos dígitos', () => {
    expect(formatPrice(19.999)).toBe('$20.00');
  });

  it('formatea el cero correctamente', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
