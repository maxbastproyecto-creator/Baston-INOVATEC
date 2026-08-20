// PantallaVincularBaston.js
// Pantalla donde el cuidador escribe el código del bastón por primera vez.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import CampoDeTexto from '../componentes/CampoDeTexto';
import BotonPrincipal from '../componentes/BotonPrincipal';
import { useBaston } from '../contextos/ContextoBaston';
import { pareceCodigoBastonValido } from '../utilidades/validaciones';
import { COLORES } from '../config/constantes';

export default function PantallaVincularBaston() {
  const { guardarCodigoBaston } = useBaston();
  const [codigo, setCodigo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function alPresionarGuardar() {
    setMensajeError('');
    if (!pareceCodigoBastonValido(codigo)) {
      setMensajeError('El código del bastón no es válido');
      return;
    }
    setCargando(true);
    try {
      await guardarCodigoBaston(codigo);
    } catch (error) {
      setMensajeError('No pudimos guardar el código');
    } finally {
      setCargando(false);
    }
  }

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={estilos.titulo}>Vincular bastón</Text>
      <Text style={estilos.subtitulo}>
        Escribe el código del bastón que vas a monitorear. Por ejemplo:
        SENTI-001.
      </Text>

      <CampoDeTexto
        etiqueta="Código del bastón"
        valor={codigo}
        alCambiar={setCodigo}
        marcadorTexto="SENTI-001"
        autoCapitalizar="characters"
      />

      {mensajeError ? (
        <Text style={estilos.error}>{mensajeError}</Text>
      ) : null}

      <BotonPrincipal
        etiqueta="Guardar bastón"
        alPresionar={alPresionarGuardar}
        cargando={cargando}
      />

      <Text style={estilos.nota}>
        Varios cuidadores pueden usar el mismo código para ver el mismo
        bastón.
      </Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    padding: 24,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORES.azulEstructura,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    marginBottom: 20,
  },
  error: {
    color: COLORES.rojoAlerta,
    marginTop: 4,
    marginBottom: 4,
    fontSize: 14,
  },
  nota: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 20,
  },
});
