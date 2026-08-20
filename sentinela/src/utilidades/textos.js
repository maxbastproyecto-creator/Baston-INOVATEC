// textos.js
// Textos amables para cuando falta información.
// Evitamos mostrar mensajes técnicos al cuidador.

export const TEXTO_SIN_DATO = 'Aún no disponible';
export const TEXTO_SIN_UBICACION = 'Todavía no hemos recibido una ubicación del bastón';
export const TEXTO_SIN_HISTORIAL = 'Todavía no hay eventos registrados';

// Devuelve el valor si existe; si no, un mensaje amable.
export function mostrarOAunNoDisponible(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return TEXTO_SIN_DATO;
  }
  return valor;
}
