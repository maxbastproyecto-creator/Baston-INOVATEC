// TarjetaEstado.js
// Tarjeta grande que muestra el estado actual del bastón.
// Cambia a rojo cuando hay una alerta de pánico activa.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORES } from '../config/constantes';

export default function TarjetaEstado({ enAlerta, titulo, subtitulo }) {
  const colorFondo = enAlerta ? COLORES.rojoAlerta : COLORES.azulEstructura;

  return (
    <View style={[estilos.tarjeta, { backgroundColor: colorFondo }]}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitulo: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 6,
    opacity: 0.95,
  },
});
