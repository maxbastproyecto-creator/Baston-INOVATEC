// firebase.js
// Configuración central de Firebase.
// Todo el proyecto lee Firebase desde este único archivo.
//
// Esta aplicacion ya esta conectada al proyecto SentinelaHackaton.
// No reemplaces esta configuracion por el correo o la contrasena de
// Firebase Authentication: son datos de inicio de sesion, no del SDK.

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
const firebaseConfig = {
  apiKey: "AIzaSyAZFE7ICktJzO1HA_BFhA-GlRDOZt9ZxjE",
  authDomain: "sentinelahackaton.firebaseapp.com",
  databaseURL: "https://sentinelahackaton-default-rtdb.firebaseio.com",
  projectId: "sentinelahackaton",
  storageBucket: "sentinelahackaton.firebasestorage.app",
  messagingSenderId: "163280788532",
  appId: "1:163280788532:web:9d795cc48ca8c883a53e61"
};

// Inicializamos la app solo una vez, aunque el archivo se importe
// desde varios lugares.
const appFirebase = getApps().length === 0
  ? initializeApp(firebaseConfig)
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
