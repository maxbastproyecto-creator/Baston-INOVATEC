// ChipDato.js
// Chip pequeño con ícono, etiqueta y valor.
// Se usa para mostrar batería, GPS, conexión, etc. en la pantalla de Inicio.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES, SOMBRA_TARJETA } from '../config/constantes';

export default function ChipDato({
  icono,
  etiqueta,
  valor,
  colorIcono = COLORES.azulEstructura,
  colorFondoIcono = COLORES.azulSuave,
}) {
  return (
    <View style={estilos.chip}>
      <View style={[estilos.circuloIcono, { backgroundColor: colorFondoIcono }]}>
        <Ionicons name={icono} size={18} color={colorIcono} />
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.etiqueta}>{etiqueta}</Text>
        <Text style={estilos.valor} numberOfLines={1}>
          {valor}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    flex: 1,
    minWidth: '48%',
    ...SOMBRA_TARJETA,
  },
  circuloIcono: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  etiqueta: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginBottom: 2,
  },
  valor: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
});
