// validaciones.js
// Validaciones sencillas de formularios.

// Comprueba que un correo tenga forma básica.
export function pareceCorreoValido(texto) {
  if (!texto) return false;
  const limpio = texto.trim();
  // Regla simple: algo, arroba, algo, punto, algo.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio);
}

// Comprueba que un código de bastón no esté vacío.
export function pareceCodigoBastonValido(texto) {
  if (!texto) return false;
  return texto.trim().length >= 3;
}
