// TarjetaEstadoGrande.js
// Tarjeta principal de la pantalla de Inicio.
// Ocupa buena parte de la pantalla y comunica de golpe:
//   - si hay o no una alerta,
//   - hace cuánto llegó la última señal.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES, SOMBRA_TARJETA } from '../config/constantes';

export default function TarjetaEstadoGrande({ enAlerta, textoRelativo }) {
  // Cuando hay alerta, cambia todo: color de fondo, ícono y texto.
  const colorFondo = enAlerta ? COLORES.rojoAlerta : COLORES.verdeOk;
  const nombreIcono = enAlerta ? 'alert-circle' : 'shield-checkmark';
  const titulo = enAlerta ? 'Alerta activa' : 'Todo en orden';
  const subtitulo = enAlerta
    ? 'El botón de pánico está activado'
    : 'No hay alerta en este momento';

  return (
    <View style={[estilos.tarjeta, { backgroundColor: colorFondo }]}>
      {/* Círculo blanco semitransparente con el ícono dentro */}
      <View style={estilos.circuloIcono}>
        <Ionicons name={nombreIcono} size={56} color="#FFFFFF" />
      </View>

      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>

      {/* Línea inferior con la última actualización */}
      <View style={estilos.pieTarjeta}>
        <Ionicons name="time-outline" size={16} color="#FFFFFF" />
        <Text style={estilos.textoPie}>
          {textoRelativo || 'Sin datos aún'}
        </Text>
      </View>
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
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  circuloIcono: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 18,
    textAlign: 'center',
  },
  pieTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  textoPie: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
