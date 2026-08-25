// SeccionAjustes.js
// Bloque agrupador para la pantalla de Ajustes.
// Tiene un título pequeño arriba y una tarjeta blanca abajo con el contenido.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORES, SOMBRA_TARJETA } from '../config/constantes';

export default function SeccionAjustes({ titulo, children }) {
  return (
    <View style={estilos.bloque}>
      <Text style={estilos.titulo}>{titulo.toUpperCase()}</Text>
      <View style={estilos.tarjeta}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloque: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORES.textoSecundario,
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 8,
  },
  tarjeta: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 16,
    elevation: 2.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
});
