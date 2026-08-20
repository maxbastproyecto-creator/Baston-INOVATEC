// autenticacion.js
// Funciones de inicio y cierre de sesión, aisladas de la interfaz.
// Traduce los errores técnicos de Firebase a mensajes humanos.

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { autenticacion } from './firebase';

// Iniciar sesión con correo y contraseña.
// Devuelve un objeto con { ok, mensaje }.
export async function iniciarSesion(correo, contrasena) {
  try {
    await signInWithEmailAndPassword(autenticacion, correo, contrasena);
    return { ok: true, mensaje: 'Sesión iniciada' };
  } catch (error) {
    return { ok: false, mensaje: traducirErrorAuth(error.code) };
  }
}

// Cerrar sesión.
export async function cerrarSesion() {
  try {
    await signOut(autenticacion);
    return { ok: true };
  } catch (error) {
    return { ok: false, mensaje: 'No pudimos cerrar la sesión' };
  }
}

// Escuchar el estado de sesión.
// Devuelve la función para dejar de escuchar (limpieza).
export function observarSesion(callback) {
  return onAuthStateChanged(autenticacion, callback);
}

// Traduce códigos de error de Firebase a mensajes claros para el usuario.
function traducirErrorAuth(codigo) {
  if (codigo === 'auth/invalid-email') {
    return 'Correo incorrecto';
  }
  if (codigo === 'auth/user-not-found') {
    return 'Correo incorrecto';
  }
  if (codigo === 'auth/wrong-password' || codigo === 'auth/invalid-credential') {
    return 'Contraseña incorrecta';
  }
  if (codigo === 'auth/network-request-failed') {
    return 'No pudimos entrar. Revisa tu conexión';
  }
  return 'No pudimos entrar. Intenta de nuevo';
}
