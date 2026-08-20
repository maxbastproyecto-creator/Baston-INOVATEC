// fechas.js
// Utilidades para mostrar fechas y horas en formato humano.
// Nunca mostramos formatos técnicos crudos al cuidador.

// Convierte una fecha ISO ("2026-08-07T15:42:00Z") en algo legible.
// Ejemplo devuelto: "07/08/2026 15:42".
export function formatearFechaHora(cadenaFechaIso) {
  if (!cadenaFechaIso) {
    return 'Aún no disponible';
  }
  const fecha = new Date(cadenaFechaIso);
  if (isNaN(fecha.getTime())) {
    return 'Aún no disponible';
  }
  const dia = dosDigitos(fecha.getDate());
  const mes = dosDigitos(fecha.getMonth() + 1);
  const anio = fecha.getFullYear();
  const hora = dosDigitos(fecha.getHours());
  const minuto = dosDigitos(fecha.getMinutes());
  return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
}

// Devuelve un texto como "hace 12 segundos" o "hace 3 minutos".
export function tiempoRelativoDesde(cadenaFechaIso) {
  if (!cadenaFechaIso) {
    return 'Aún no disponible';
  }
  const fecha = new Date(cadenaFechaIso);
  if (isNaN(fecha.getTime())) {
    return 'Aún no disponible';
  }
  const ahora = new Date();
  const diferenciaSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

  if (diferenciaSegundos < 0) {
    return 'Hace un momento';
  }
  if (diferenciaSegundos < 60) {
    return `Hace ${diferenciaSegundos} segundos`;
  }
  const minutos = Math.floor(diferenciaSegundos / 60);
  if (minutos < 60) {
    return `Hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
  }
  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
  }
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
}

function dosDigitos(numero) {
  return numero < 10 ? `0${numero}` : `${numero}`;
}
