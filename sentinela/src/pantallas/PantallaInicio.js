// PantallaInicio.js
// Pantalla principal rediseñada.
// Muestra el estado del bastón con jerarquía visual clara:
//   1. Tarjeta grande de estado (lo más importante)
//   2. Chips con los datos secundarios (batería, GPS, conexión)
//   3. Botón para saltar al mapa

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import TarjetaEstadoGrande from '../componentes/TarjetaEstadoGrande';
import ChipDato from '../componentes/ChipDato';
import { useBaston } from '../contextos/ContextoBaston';
import { COLORES } from '../config/constantes';
import { tiempoRelativoDesde } from '../utilidades/fechas';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PantallaInicio() {
  const { codigoBaston, estadoActual } = useBaston();
  const navegacion = useNavigation();
  const [refrescando, setRefrescando] = useState(false);

  // Firebase ya actualiza en tiempo real. El "refrescar" solo da
  // sensación de control al usuario: espera un momento y termina.
  function alTirarParaRefrescar() {
    setRefrescando(true);
    setTimeout(() => setRefrescando(false), 500);
  }

  const enAlerta = estadoActual?.botonPanico === true;

  // Calculamos los colores del chip de batería según el nivel.
  const bateria = estadoActual?.nivelBateria;
  const infoBateria = obtenerInfoBateria(bateria);

  // Y del chip de GPS según la precisión.
  const precision = estadoActual?.precisionGps;
  const infoGps = obtenerInfoGps(precision);

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={alTirarParaRefrescar} />
      }
    >
      {/* Saludo pequeño arriba */}
      <View style={estilos.encabezado}>
        <Text style={estilos.saludo}>Bastón  <View style={[estilos.bastorFalsoCss, { backgroundColor: '#959595'}]} /> <View style={[estilos.bastorFalso2Css, {backgroundColor: '#959595'}]}/></Text>
        <Text style={estilos.codigoBaston}>{codigoBaston}</Text>
      </View>

      {/* Tarjeta principal de estado */}
      <TarjetaEstadoGrande
        enAlerta={enAlerta}
        textoRelativo={
          estadoActual?.fechaHora
            ? tiempoRelativoDesde(estadoActual.fechaHora)
            : null
        }
      />

      {/* Título de la sección de detalles */}
      <Text style={estilos.tituloSeccion}>Datos del bastón</Text>

      {/* Grilla de chips (2 columnas) */}
      <View style={estilos.grilla}>
        <ChipDato
          icono={infoBateria.icono}
          etiqueta="Batería"
          valor={bateria !== undefined && bateria !== null ? `${bateria} %` : '—'}
          colorIcono={infoBateria.color}
          colorFondoIcono={infoBateria.colorFondo}
        />
        <ChipDato
          icono="location"
          etiqueta="Precisión GPS"
          valor={precision !== undefined && precision !== null ? `${precision} m` : '—'}
          colorIcono={infoGps.color}
          colorFondoIcono={infoGps.colorFondo}
        />
        <ChipDato
          icono="wifi"
          etiqueta="Conexión"
          valor={estadoActual?.estadoConexion || '—'}
          colorIcono={COLORES.azulEstructura}
          colorFondoIcono={COLORES.azulSuave}
        />
        <ChipDato
          icono="pulse"
          etiqueta="Pánico"
          valor={enAlerta ? 'Activo' : 'Inactivo'}
          colorIcono={enAlerta ? COLORES.rojoAlerta : COLORES.verdeOk}
          colorFondoIcono={enAlerta ? COLORES.rojoSuave : COLORES.verdeSuave}
        />
      </View>

      {/* Botón para saltar al mapa */}
      <Pressable
        style={({ pressed }) => [
          estilos.botonMapa,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => navegacion.navigate('Mapa')}
      >
        <Ionicons name="map" size={20} color={COLORES.azulEstructura} />
        <Text style={estilos.textoBotonMapa}>Ver ubicación en el mapa</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORES.azulEstructura} />
      </Pressable>
    </ScrollView>
  );
}

// Devuelve ícono y colores según el nivel de batería.
function obtenerInfoBateria(nivel) {
  if (nivel === undefined || nivel === null) {
    return {
      icono: 'battery-half',
      color: COLORES.textoSecundario,
      colorFondo: COLORES.grisChip,
    };
  }
  if (nivel < 20) {
    return {
      icono: 'battery-dead',
      color: COLORES.rojoAlerta,
      colorFondo: COLORES.rojoSuave,
    };
  }
  if (nivel < 50) {
    return {
      icono: 'battery-half',
      color: COLORES.ambarAviso,
      colorFondo: COLORES.ambarSuave,
    };
  }
  return {
    icono: 'battery-full',
    color: COLORES.verdeOk,
    colorFondo: COLORES.verdeSuave,
  };
}

// Devuelve colores según la precisión de GPS (en metros).
function obtenerInfoGps(precision) {
  if (precision === undefined || precision === null) {
    return { color: COLORES.textoSecundario, colorFondo: COLORES.grisChip };
  }
  if (precision > 30) {
    return { color: COLORES.ambarAviso, colorFondo: COLORES.ambarSuave };
  }
  return { color: COLORES.verdeOk, colorFondo: COLORES.verdeSuave };
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  encabezado: {
    marginBottom: 16,
  },
  saludo: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  codigoBaston: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    marginTop: 24,
    marginBottom: 12,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  botonMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.azulSuave,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    gap: 10,
  },
  textoBotonMapa: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.azulEstructura,
  },
    bastorFalsoCss: {
    width: 2,            
    height: 20,            
    borderRadius: 3,     
    transform: [{ rotate: '-25deg' }],
  },
   bastorFalso2Css: {
    width: 2,
    height: 2,
    borderRadius: 4,
    paddingBottom: 4,
   }
});
