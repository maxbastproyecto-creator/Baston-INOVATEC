// PantallaMapa.js
// Muestra la última ubicación conocida del bastón en un mapa.
// Si hay alerta de pánico, el marcador y la tarjeta superior cambian a rojo.

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';

import BotonPrincipal from '../componentes/BotonPrincipal';
import TarjetaEstado from '../componentes/TarjetaEstado';
import { useBaston } from '../contextos/ContextoBaston';
import { REGION_INICIAL } from '../config/mapa';
import { COLORES } from '../config/constantes';
import { TEXTO_SIN_UBICACION } from '../utilidades/textos';

export default function PantallaMapa() {
  const { estadoActual } = useBaston();

  const tieneUbicacion =
    estadoActual &&
    typeof estadoActual.latitud === 'number' &&
    typeof estadoActual.longitud === 'number';

  const enAlerta = estadoActual?.botonPanico === true;

  const region = tieneUbicacion
    ? {
        latitude: estadoActual.latitud,
        longitude: estadoActual.longitud,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : REGION_INICIAL;

  async function abrirEnAppDeMapas() {
    if (!tieneUbicacion) {
      Alert.alert('Sentinela', TEXTO_SIN_UBICACION);
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${estadoActual.latitud},${estadoActual.longitud}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Sentinela', 'No pudimos abrir la aplicación de mapas.');
    }
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <TarjetaEstado
          enAlerta={enAlerta}
          titulo={enAlerta ? 'Alerta activa' : 'Ubicación del bastón'}
          subtitulo={
            tieneUbicacion
              ? `Lat ${estadoActual.latitud.toFixed(5)}, Lon ${estadoActual.longitud.toFixed(5)}`
              : TEXTO_SIN_UBICACION
          }
        />
      </View>

      <MapView style={estilos.mapa} region={region}>
        {tieneUbicacion ? (
          <Marker
            coordinate={{
              latitude: estadoActual.latitud,
              longitude: estadoActual.longitud,
            }}
            title={enAlerta ? 'Alerta activa' : 'Bastón'}
            description={
              enAlerta ? 'Botón de pánico activado' : 'Última ubicación conocida'
            }
            pinColor={enAlerta ? COLORES.rojoAlerta : COLORES.azulEstructura}
          />
        ) : null}
      </MapView>

      <View style={estilos.piePagina}>
        <BotonPrincipal
          etiqueta="Abrir en mapas del teléfono"
          alPresionar={abrirEnAppDeMapas}
          deshabilitado={!tieneUbicacion}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  encabezado: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mapa: {
    flex: 1,
    marginTop: 8,
  },
  piePagina: {
    padding: 16,
    backgroundColor: COLORES.fondo,
  },
});
