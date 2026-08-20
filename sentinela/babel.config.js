// Configuración mínima de Babel para un proyecto Expo.
// Solo utiliza el preset por defecto de Expo. En SDK 54 no hacen falta
// plugins adicionales para este proyecto.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
