// LineaTiempoEvento.js
// Cada evento del historial se pinta como un punto de color en una línea vertical.
// El resultado parece una "línea del tiempo" moderna.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORES, SOMBRA_TARJETA } from '../config/constantes';
import { formatearFechaHora, tiempoRelativoDesde } from '../utilidades/fechas';

export default function LineaTiempoEvento({ evento, esUltimo }) {
  const info = describirEvento(evento);

  return (
    <View style={estilos.fila}>
      {/* Columna izquierda: punto de color + línea vertical */}
      <View style={estilos.columnaIzquierda}>
        <View
          style={[
            estilos.punto,
            { backgroundColor: info.colorFondo, borderColor: info.color },
          ]}
        >
          <Ionicons name={info.icono} size={14} color={info.color} />
        </View>
        {!esUltimo && <View style={estilos.linea} />}
      </View>

      {/* Columna derecha: tarjeta con el contenido */}
      <View style={estilos.tarjeta}>
        <View style={estilos.filaTitulo}>
          <Text style={estilos.titulo}>{info.titulo}</Text>
          <Text style={estilos.tiempoRelativo}>
            {tiempoRelativoDesde(evento.fechaHora)}
          </Text>
        </View>
        {evento.resumen ? (
          <Text style={estilos.resumen}>{evento.resumen}</Text>
        ) : null}
        <Text style={estilos.fechaExacta}>
          {formatearFechaHora(evento.fechaHora)}
        </Text>
      </View>
    </View>
  );
}

// Devuelve el color, ícono y título que corresponden al tipo de evento.
function describirEvento(evento) {
  const esPanico = evento.tipo === 'panico' || evento.botonPanico === true;
  if (esPanico) {
    return {
      titulo: 'Botón de pánico activado',
      icono: 'alert-circle',
      color: COLORES.rojoAlerta,
      colorFondo: COLORES.rojoSuave,
    };
  }
  if (evento.tipo === 'ubicacion') {
    return {
      titulo: 'Ubicación actualizada',
      icono: 'location',
      color: COLORES.azulEstructura,
      colorFondo: COLORES.azulSuave,
    };
  }
  if (evento.tipo === 'bateria_baja') {
    return {
      titulo: 'Batería baja',
      icono: 'battery-dead',
      color: COLORES.ambarAviso,
      colorFondo: COLORES.ambarSuave,
    };
  }
  if (evento.tipo === 'conexion') {
    return {
      titulo: 'Cambio de conexión',
      icono: 'wifi',
      color: COLORES.azulEstructura,
      colorFondo: COLORES.azulSuave,
    };
  }
  return {
    titulo: evento.tipo || 'Evento del bastón',
    icono: 'ellipse',
    color: COLORES.textoSecundario,
    colorFondo: COLORES.grisChip,
  };
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  columnaIzquierda: {
    width: 40,
    alignItems: 'center',
  },
  punto: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  linea: {
    flex: 1,
    width: 2,
    backgroundColor: COLORES.bordeSuave,
    marginTop: 2,
  },
  tarjeta: {
    flex: 1,
    backgroundColor: COLORES.tarjeta,
    borderRadius: 14,
    padding: 14,
    marginLeft: 10,
    marginBottom: 12,
    elevation: 2.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    flex: 1,
  },
  tiempoRelativo: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginLeft: 8,
  },
  resumen: {
    fontSize: 14,
    color: COLORES.textoPrincipal,
    marginBottom: 6,
  },
  fechaExacta: {
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
});
