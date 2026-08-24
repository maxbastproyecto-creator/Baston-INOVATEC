// Avatar.js
// Círculo con las iniciales del correo del usuario.
// Se muestra arriba en la pantalla de Ajustes.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORES } from '../config/constantes';

export default function Avatar({ correo }) {
  const iniciales = obtenerIniciales(correo);

  return (
    <View style={estilos.circulo}>
      <Text style={estilos.texto}>{iniciales}</Text>
    </View>
  );
}

// Saca dos letras del correo para usarlas como iniciales.
// Ejemplo: "cuidador1@sentinela.com" → "CU"
function obtenerIniciales(correo) {
  if (!correo) return '?';
  const parteAntesDelArroba = correo.split('@')[0];
  const limpio = parteAntesDelArroba.replace(/[^a-zA-Z]/g, '');
  return limpio.substring(0, 2).toUpperCase() || '?';
}

const estilos = StyleSheet.create({
  circulo: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: COLORES.azulEstructura,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
});
