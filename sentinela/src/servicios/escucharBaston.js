// escucharBaston.js
// Lógica de lectura en tiempo real desde Firebase Realtime Database.
// Vive aquí, separada de las pantallas, para que la UI no sepa
// cómo se conecta a Firebase.

import { ref, onValue, off, query, limitToLast } from 'firebase/database';

import { baseDeDatos } from './firebase';
import { RUTAS_FIREBASE } from '../config/constantes';

// Escucha el estado actual del bastón.
// Cada vez que Firebase cambia, se llama a "alRecibir" con los datos.
// Devuelve una función para dejar de escuchar cuando ya no se necesite.
export function escucharEstadoActual(idBaston, alRecibir) {
  const referencia = ref(baseDeDatos, RUTAS_FIREBASE.estadoActual(idBaston));

  const cancelador = onValue(
    referencia,
    (snapshot) => {
      const datos = snapshot.val();
      alRecibir(datos || null);
    },
    (error) => {
      // Si hay un error de lectura, avisamos con datos nulos.
      // La UI decide cómo mostrarlo.
      console.log('Error al leer estado actual:', error.message);
      alRecibir(null);
    }
  );

  return () => {
    off(referencia, 'value', cancelador);
  };
}

// Escucha los últimos eventos del historial del bastón.
// Devuelve una función para dejar de escuchar.
export function escucharHistorial(idBaston, alRecibir, cantidad = 50) {
  const referencia = ref(baseDeDatos, RUTAS_FIREBASE.historial(idBaston));
  const consulta = query(referencia, limitToLast(cantidad));

  const cancelador = onValue(
    consulta,
    (snapshot) => {
      const datos = snapshot.val();
      if (!datos) {
        alRecibir([]);
        return;
      }
      // Firebase entrega un objeto: lo convertimos a lista.
      const lista = Object.keys(datos).map((clave) => ({
        id: clave,
        ...datos[clave],
      }));
      // Del más reciente al más antiguo.
      lista.sort((a, b) => {
        const fa = a.fechaHora || '';
        const fb = b.fechaHora || '';
        return fa < fb ? 1 : -1;
      });
      alRecibir(lista);
    },
    (error) => {
      console.log('Error al leer historial:', error.message);
      alRecibir([]);
    }
  );

  return () => {
    off(referencia, 'value', cancelador);
  };
}
