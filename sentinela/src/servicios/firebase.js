// firebase.js
// Configuración central de Firebase.
// Todo el proyecto lee Firebase desde este único archivo.
//
// IMPORTANTE:
// Reemplaza los valores de configuracionFirebase con los datos
// reales de tu propio proyecto Firebase. Los pasos exactos están
// en el archivo 04_CONFIGURAR_FIREBASE_GRATIS.md.

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Datos del proyecto Firebase. Estos valores NO son secretos:
// Firebase los expone en el cliente. La seguridad real está en
// las reglas de la base de datos, no en ocultar estas claves.
const configuracionFirebase = {
  apiKey: 'AIzaSyDQNZHlLR6LvAe84w1Lem4NUER2x8GdZNY',
  authDomain: 'sentinela-escolar-a4103.firebaseapp.com',
  databaseURL: 'https://sentinela-escolar-a4103-default-rtdb.firebaseio.com',
  projectId: "sentinela-escolar-a4103",
  storageBucket: "sentinela-escolar-a4103.firebasestorage.app",
  messagingSenderId: "727390488606",
  appId: "1:727390488606:web:c2cee518f634be3435c60f"
};

// Inicializamos la app solo una vez, aunque el archivo se importe
// desde varios lugares.
const appFirebase = getApps().length === 0
  ? initializeApp(configuracionFirebase)
  : getApp();

// Inicializamos Auth guardando la sesión en el teléfono.
// De este modo, al cerrar y abrir la app, el cuidador sigue logueado.
// En Firebase 11 esta función a veces no está tipada como export,
// por eso comprobamos si existe antes de usarla.
let autenticacion;
try {
  if (typeof getReactNativePersistence === 'function') {
    autenticacion = initializeAuth(appFirebase, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    // Si por alguna razón la persistencia nativa no está disponible,
    // la app sigue funcionando. Solo perdería la sesión al cerrarla.
    autenticacion = initializeAuth(appFirebase);
  }
} catch (error) {
  // Si Auth ya se inicializó antes (por recarga en caliente),
  // simplemente lo reutilizamos.
  autenticacion = getAuth(appFirebase);
}

const baseDeDatos = getDatabase(appFirebase);

export { appFirebase, autenticacion, baseDeDatos };
