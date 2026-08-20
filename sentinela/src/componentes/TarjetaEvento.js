// TarjetaEvento.js
// Tarjeta de un evento en la lista de historial.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORES } from '../config/constantes';
import { formatearFechaHora } from '../utilidades/fechas';

export default function TarjetaEvento({ evento }) {
  const esAlerta = evento.tipo === 'panico' || evento.botonPanico === true;

  return (
    <View
      style={[
        estilos.tarjeta,
        esAlerta && { borderLeftColor: COLORES.rojoAlerta },
      ]}
    >
      <Text style={estilos.tipo}>
        {resumirTipo(evento)}
      </Text>
      <Text style={estilos.fecha}>{formatearFechaHora(evento.fechaHora)}</Text>
      {evento.resumen ? (
        <Text style={estilos.resumen}>{evento.resumen}</Text>
      ) : null}
    </View>
  );
}

// Convierte el tipo técnico del evento en un texto claro.
function resumirTipo(evento) {
  if (evento.tipo === 'panico' || evento.botonPanico === true) {
    return 'Botón de pánico activado';
  }
  if (evento.tipo === 'ubicacion') {
    return 'Ubicación actualizada';
  }
  if (evento.tipo === 'bateria_baja') {
    return 'Batería baja';
  }
  if (evento.tipo === 'conexion') {
    return 'Cambio de conexión';
  }
  return evento.tipo || 'Evento del bastón';
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.azulEstructura,
    padding: 14,
    marginVertical: 6,
  },
  tipo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.textoPrincipal,
  },
  fecha: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 4,
  },
  resumen: {
    fontSize: 14,
    color: COLORES.textoPrincipal,
    marginTop: 6,
  },
});
