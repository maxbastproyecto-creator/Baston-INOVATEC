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
    borderRadius: 14,
    padding: 18,
    marginVertical: 10,
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
