// App.js
// Punto de entrada de la aplicación SENTINELA.
// Aquí se envuelven los contextos globales y se carga la navegación.

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProveedorAutenticacion } from './src/contextos/ContextoAutenticacion';
import { ProveedorBaston } from './src/contextos/ContextoBaston';
import { ProveedorContactos } from './src/contextos/ContextoContactos';
import NavegacionPrincipal from './src/navegacion/NavegacionPrincipal';

export default function App() {
  // El orden importa: primero autenticación, luego bastón,
  // porque saber quién está logueado permite decidir qué bastón mostrar.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProveedorAutenticacion>
          <ProveedorContactos>
           <ProveedorBaston>
            <NavegacionPrincipal />
            <StatusBar style="light" />
           </ProveedorBaston>
          </ProveedorContactos>
        </ProveedorAutenticacion>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
