// CampoDeTexto.js
// Campo de entrada con etiqueta encima. Se usa en Login y en Vincular Bastón.

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { COLORES } from '../config/constantes';

export default function CampoDeTexto({
  etiqueta,
  valor,
  alCambiar,
  marcadorTexto,
  tipoTeclado = 'default',
  esContrasena = false,
  autoCapitalizar = 'none',
}) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        value={valor}
        onChangeText={alCambiar}
        placeholder={marcadorTexto}
        placeholderTextColor={COLORES.textoSecundario}
        keyboardType={tipoTeclado}
        secureTextEntry={esContrasena}
        autoCapitalize={autoCapitalizar}
        autoCorrect={false}
        style={estilos.campo}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginVertical: 8,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoPrincipal,
    marginBottom: 6,
  },
  campo: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORES.textoPrincipal,
  },
});
