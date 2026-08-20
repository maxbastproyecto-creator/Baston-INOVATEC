// BotonPrincipal.js
// Botón grande y cómodo de tocar, reutilizado en varias pantallas.

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { COLORES } from '../config/constantes';

export default function BotonPrincipal({
  etiqueta,
  alPresionar,
  cargando = false,
  variante = 'principal',
  deshabilitado = false,
}) {
  const colorFondo =
    variante === 'alerta' ? COLORES.rojoAlerta : COLORES.azulEstructura;

  const estaInactivo = cargando || deshabilitado;

  return (
    <Pressable
      onPress={alPresionar}
      disabled={estaInactivo}
      style={({ pressed }) => [
        estilos.boton,
        { backgroundColor: colorFondo, opacity: estaInactivo ? 0.6 : pressed ? 0.85 : 1 },
      ]}
    >
      {cargando ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={estilos.etiqueta}>{etiqueta}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  etiqueta: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
