// PantallaMapa.js
// Muestra la última ubicación conocida del bastón en un mapa.
// Si hay alerta de pánico, el marcador y la tarjeta superior cambian a rojo.
// Incluye botón rojo flotante para llamar a contactos de emergencia
// y opción de agregar un contacto desde el mismo modal.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

import BotonPrincipal from '../componentes/BotonPrincipal';
import TarjetaEstado from '../componentes/TarjetaEstado';
import { useBaston } from '../contextos/ContextoBaston';
import { useContactos } from '../contextos/ContextoContactos';
import { REGION_INICIAL } from '../config/mapa';
import { COLORES } from '../config/constantes';
import { TEXTO_SIN_UBICACION } from '../utilidades/textos';

export default function PantallaMapa() {
  const { estadoActual } = useBaston();
  const { contactos, agregarContacto, eliminarContacto } = useContactos();

  const [modalLlamadaVisible, setModalLlamadaVisible] = useState(false);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [errorContacto, setErrorContacto] = useState('');

  // Anillo pulsante del botón rojo
  const pulso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulso, {
          toValue: 0,
          duration: 1500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animacion.start();
    return () => animacion.stop();
  }, [pulso]);

  function llamarContacto(contacto) {
    Alert.alert(
      'Llamar a ' + contacto.nombre,
      '¿Marcar a ' + contacto.telefono + '?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar',
          onPress: () => Linking.openURL('tel:' + contacto.telefono),
        },
      ]
    );
  }

  function confirmarEliminarContacto(contacto) {
  Alert.alert(
    'Eliminar contacto',
    '¿Eliminar a ' + contacto.nombre + '?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => eliminarContacto(contacto.id),
      },
    ]
  );
  }

  function alAgregarContacto() {
    const nombre = nuevoNombre.trim();
    const telefono = nuevoTelefono.trim();
    if (!nombre || !telefono) {
      setErrorContacto('Escribe nombre y teléfono.');
      return;
    }
    agregarContacto(nombre, telefono);
    setNuevoNombre('');
    setNuevoTelefono('');
    setErrorContacto('');
    setMostrandoFormulario(false);
  }

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

  const escalaAnillo = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const opacidadAnillo = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

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

      {/* Botón rojo flotante con anillo pulsante */}
      <View style={estilos.contenedorBotonLlamar}>
        <Animated.View
          style={[
            estilos.anilloPulso,
            { transform: [{ scale: escalaAnillo }], opacity: opacidadAnillo },
          ]}
        />
        <Pressable
          style={({ pressed }) => [
            estilos.botonLlamar,
            pressed && { transform: [{ scale: 0.92 }] },
          ]}
          onPress={() => {
            setMostrandoFormulario(false);
            setModalLlamadaVisible(true);
          }}
        >
          <Ionicons name="call" size={30} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={estilos.piePagina}>
        <BotonPrincipal
          etiqueta="Abrir en mapas del teléfono"
          alPresionar={abrirEnAppDeMapas}
          deshabilitado={!tieneUbicacion}
        />
      </View>

      {/* Modal de llamada rápida + agregar contacto */}
      <Modal
        visible={modalLlamadaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLlamadaVisible(false)}
      >
        <View style={estilos.overlayModal}>
          <View style={estilos.contenidoModal}>
            <Text style={estilos.tituloModal}>
              {mostrandoFormulario ? 'Nuevo contacto' : 'Llamar a un contacto'}
            </Text>

            {mostrandoFormulario ? (
              <>
                <TextInput
                  value={nuevoNombre}
                  onChangeText={setNuevoNombre}
                  placeholder="Nombre"
                  placeholderTextColor={COLORES.textoSecundario}
                  autoCorrect={false}
                  style={estilos.campoModal}
                />
                <TextInput
                  value={nuevoTelefono}
                  onChangeText={setNuevoTelefono}
                  placeholder="Teléfono"
                  placeholderTextColor={COLORES.textoSecundario}
                  keyboardType="phone-pad"
                  style={[estilos.campoModal, { marginTop: 10 }]}
                />
                {errorContacto ? (
                  <Text style={estilos.errorModal}>{errorContacto}</Text>
                ) : null}
                <View style={estilos.botonesModal}>
                  <Pressable
                    style={({ pressed }) => [
                      estilos.botonModal,
                      estilos.botonModalCancelar,
                      { opacity: pressed ? 0.85 : 1 },
                    ]}
                    onPress={() => setMostrandoFormulario(false)}
                  >
                    <Text style={estilos.textoBotonModalCancelar}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      estilos.botonModal,
                      estilos.botonModalGuardar,
                      { opacity: pressed ? 0.85 : 1 },
                    ]}
                    onPress={alAgregarContacto}
                  >
                    <Text style={estilos.textoBotonModalGuardar}>Agregar</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {contactos.length === 0 ? (
                  <Text style={estilos.sinContactos}>
                    No tienes contactos. Agrégalos en Ajustes.
                  </Text>
                ) : (
                  contactos.map((contacto) => (
                    <Pressable
               key={contacto.id}
               style={estilos.filaLlamada}
               onPress={() => llamarContacto(contacto)}
                 >
                   <Ionicons name="call-outline" size={18} color={COLORES.rojoAlerta} />
                      <View style={estilos.textosContacto}>
                        <Text style={estilos.nombreContacto}>{contacto.nombre}</Text>
                        <Text style={estilos.telefonoContacto}>{contacto.telefono}</Text>
                      </View>
                    <Pressable hitSlop={10} onPress={() => confirmarEliminarContacto(contacto)}>
                    <Ionicons name="trash-outline" size={18} color={COLORES.rojoAlerta} />
                  </Pressable>
                </Pressable>
                  ))
                )}

                <Pressable
                  style={({ pressed }) => [
                    estilos.filaAccion,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() => {
                    setNuevoNombre('');
                    setNuevoTelefono('');
                    setErrorContacto('');
                    setMostrandoFormulario(true);
                  }}
                >
                  <Ionicons name="add" size={20} color={COLORES.azulEstructura} />
                  <Text style={estilos.textoAccion}>Agregar contacto</Text>
                </Pressable>
              </>
            )}

            <Pressable
              style={({ pressed }) => [
                estilos.botonCerrarModal,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => setModalLlamadaVisible(false)}
            >
              <Text style={estilos.textoBotonCerrarModal}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  // Botón rojo flotante
  contenedorBotonLlamar: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonLlamar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORES.rojoAlerta,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  anilloPulso: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORES.rojoAlerta,
  },
  // Modal
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contenidoModal: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 400,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    marginBottom: 14,
  },
  sinContactos: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginBottom: 16,
  },
  filaLlamada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.bordeSuave,
  },
  textosContacto: {
    flex: 1,
  },
  nombreContacto: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORES.textoPrincipal,
  },
  telefonoContacto: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 2,
  },
  // Formulario dentro del modal
  campoModal: {
    backgroundColor: COLORES.fondo,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORES.textoPrincipal,
  },
  errorModal: {
    fontSize: 13,
    color: COLORES.rojoAlerta,
    marginTop: 8,
  },
  botonesModal: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  botonModal: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonModalCancelar: {
    backgroundColor: COLORES.grisChip,
  },
  botonModalGuardar: {
    backgroundColor: COLORES.rojoAlerta,
  },
  textoBotonModalCancelar: {
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
  textoBotonModalGuardar: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Acción "Agregar contacto"
  filaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  textoAccion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORES.azulEstructura,
  },
  botonCerrarModal: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORES.grisChip,
  },
  textoBotonCerrarModal: {
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
});
