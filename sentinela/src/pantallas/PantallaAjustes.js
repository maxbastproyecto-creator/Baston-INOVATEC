// PantallaAjustes.js
// Pantalla para cerrar sesión, cambiar el bastón vinculado y ver la cuenta.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

import CampoDeTexto from '../componentes/CampoDeTexto';
import BotonPrincipal from '../componentes/BotonPrincipal';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import { useBaston } from '../contextos/ContextoBaston';
import { cerrarSesion } from '../servicios/autenticacion';
import { pareceCodigoBastonValido } from '../utilidades/validaciones';
import { COLORES } from '../config/constantes';

export default function PantallaAjustes() {
  const { usuario } = useAutenticacion();
  const { codigoBaston, guardarCodigoBaston } = useBaston();
  const [nuevoCodigo, setNuevoCodigo] = useState(codigoBaston || '');
  const [cargandoCodigo, setCargandoCodigo] = useState(false);
  const [cargandoCerrar, setCargandoCerrar] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function alGuardarNuevoCodigo() {
    setMensaje('');
    if (!pareceCodigoBastonValido(nuevoCodigo)) {
      setMensaje('El código del bastón no es válido');
      return;
    }
    setCargandoCodigo(true);
    try {
      await guardarCodigoBaston(nuevoCodigo);
      setMensaje('Bastón actualizado');
    } catch (error) {
      setMensaje('No pudimos actualizar el bastón');
    } finally {
      setCargandoCodigo(false);
    }
  }

  function alCerrarSesion() {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            setCargandoCerrar(true);
            await cerrarSesion();
            setCargandoCerrar(false);
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={estilos.titulo}>Ajustes</Text>

      <View style={estilos.bloque}>
        <Text style={estilos.subtitulo}>Cuenta</Text>
        <Text style={estilos.dato}>
          Correo: {usuario?.email || 'No disponible'}
        </Text>
      </View>

      <View style={estilos.bloque}>
        <Text style={estilos.subtitulo}>Bastón vinculado</Text>
        <CampoDeTexto
          etiqueta="Código del bastón"
          valor={nuevoCodigo}
          alCambiar={setNuevoCodigo}
          marcadorTexto="SENTI-001"
          autoCapitalizar="characters"
        />
        {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}
        <BotonPrincipal
          etiqueta="Guardar cambio"
          alPresionar={alGuardarNuevoCodigo}
          cargando={cargandoCodigo}
        />
      </View>

      <View style={estilos.bloque}>
        <Text style={estilos.subtitulo}>Sesión</Text>
        <BotonPrincipal
          etiqueta="Cerrar sesión"
          alPresionar={alCerrarSesion}
          cargando={cargandoCerrar}
          variante="alerta"
        />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    marginBottom: 12,
  },
  bloque: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.azulEstructura,
    marginBottom: 8,
  },
  dato: {
    fontSize: 14,
    color: COLORES.textoPrincipal,
  },
  mensaje: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 4,
    marginBottom: 4,
  },
});
