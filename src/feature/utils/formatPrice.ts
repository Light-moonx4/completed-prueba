/** Función pura: formatea un número como precio en USD. Usada en tarjetas y detalle de evento. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}
