// metro.config.js
// Configuración del bundler de React Native (Metro).
// En Expo 54, Firebase requiere una pequeña ayuda: hay que decirle a
// Metro que acepte archivos ".cjs" (los módulos internos de Firebase
// vienen en ese formato). Sin esto, aparecen errores del tipo
// "Component auth has not been registered yet" o "Unable to resolve
// module ... firebase/auth".

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Aceptar los archivos ".cjs" que usa Firebase.
config.resolver.sourceExts.push('cjs');

// Desactivar el "package exports" experimental. En algunos entornos,
// esta opción hace que Metro no encuentre el submódulo firebase/auth.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
