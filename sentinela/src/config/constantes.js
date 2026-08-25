// constantes.js
// Valores fijos usados en toda la aplicación.
// Centralizar aquí evita que los colores o textos aparezcan repetidos.

export const COLORES = {
  rojoAlerta: '#B7131A',
  rojoContenedor: '#DB322F',
  azulEstructura: '#F88030',
  ambarAviso: '#7B5500',
  fondo: '#F9F9F9',
  tarjeta: '#FFFFFF',
  textoPrincipal: '#1A1C1C',
  textoSecundario: '#767676',
  bordeSuave: '#E4BEB9',
  ventanaLuz: '#F9F9F9',
  activo: '#1f1f1f'
};

// Claves que usamos para guardar datos en el teléfono con AsyncStorage.
export const CLAVES_ALMACENAMIENTO = {
  codigoBaston: 'sentinela:codigoBaston',
};

// Ruta base en Firebase Realtime Database donde el bastón escribe.
// El bastón real ya usa esta convención.
export const RUTAS_FIREBASE = {
  estadoActual: (idBaston) => `bastones/${idBaston}/estadoActual`,
  historial: (idBaston) => `historial/${idBaston}`,
};
