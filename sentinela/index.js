// index.js
// Punto de entrada del bundler.
// Registra el componente principal (App) para que Expo / React Native
// sepan qué renderizar al arrancar la aplicación.

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
