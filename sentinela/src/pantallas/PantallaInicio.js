// PantallaInicio.js
// Pantalla principal. Muestra de un vistazo el estado del bastón.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import TarjetaEstado from '../componentes/TarjetaEstado';
import { useBaston } from '../contextos/ContextoBaston';
import { COLORES } from '../config/constantes';
import {
  formatearFechaHora,
  tiempoRelativoDesde,
} from '../utilidades/fechas';
import { mostrarOAunNoDisponible } from '../utilidades/textos';

export default function PantallaInicio() {
  const { codigoBaston, estadoActual } = useBaston();
  const [refrescando, setRefrescando] = React.useState(false);

  // Firebase ya actualiza en tiempo real. El "refrescar" solo da
  // sensación de control al usuario: espera un momento y termina.
  function alTirarParaRefrescar() {
    setRefrescando(true);
    setTimeout(() => setRefrescando(false), 500);
  }

  const enAlerta = estadoActual?.botonPanico === true;

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={alTirarParaRefrescar} />
      }
    >
      <Text style={estilos.titulo}>Bastón {codigoBaston}</Text>

      <TarjetaEstado
        enAlerta={enAlerta}
        titulo={enAlerta ? 'Hay una alerta activa' : 'No hay alerta activa'}
        subtitulo={
          estadoActual?.fechaHora
            ? `Última actualización ${tiempoRelativoDesde(estadoActual.fechaHora).toLowerCase()}`
            : 'Aún no hemos recibido datos del bastón'
        }
      />

      <View style={estilos.tarjetaInfo}>
        <FilaInfo etiqueta="Botón de pánico" valor={enAlerta ? 'Activo' : 'Inactivo'} />
        <FilaInfo
          etiqueta="Última hora"
          valor={formatearFechaHora(estadoActual?.fechaHora)}
        />
        <FilaInfo
          etiqueta="Nivel de batería"
          valor={
            estadoActual?.nivelBateria !== undefined && estadoActual?.nivelBateria !== null
              ? `${estadoActual.nivelBateria}%`
              : mostrarOAunNoDisponible(null)
          }
        />
        <FilaInfo
          etiqueta="Estado de conexión"
          valor={mostrarOAunNoDisponible(estadoActual?.estadoConexion)}
        />
        <FilaInfo
          etiqueta="Precisión GPS"
          valor={
            estadoActual?.precisionGps !== undefined && estadoActual?.precisionGps !== null
              ? `${estadoActual.precisionGps} m`
              : mostrarOAunNoDisponible(null)
          }
        />
      </View>
    </ScrollView>
  );
}

// Fila simple etiqueta / valor.
function FilaInfo({ etiqueta, valor }) {
  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
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
    marginBottom: 8,
  },
  tarjetaInfo: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.bordeSuave,
  },
  etiqueta: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  valor: {
    fontSize: 14,
    color: COLORES.textoPrincipal,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 10,
  },
});
