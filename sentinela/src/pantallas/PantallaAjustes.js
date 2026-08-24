// PantallaAjustes.js
// Ajustes rediseñada estilo perfil.
// Estructura:
//   1. Avatar + correo arriba
//   2. Sección "Cuenta"
//   3. Sección "Bastón vinculado" (con modal para cambiarlo)
//   4. Sección "Sesión" con botón rojo suave

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Avatar from '../componentes/Avatar';
import SeccionAjustes from '../componentes/SeccionAjustes';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import { useBaston } from '../contextos/ContextoBaston';
import { cerrarSesion } from '../servicios/autenticacion';
import { pareceCodigoBastonValido } from '../utilidades/validaciones';
import { COLORES } from '../config/constantes';

export default function PantallaAjustes() {
  const { usuario } = useAutenticacion();
  const { codigoBaston, guardarCodigoBaston } = useBaston();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState(codigoBaston || '');
  const [mensajeModal, setMensajeModal] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function alGuardarNuevoCodigo() {
    setMensajeModal('');
    if (!pareceCodigoBastonValido(nuevoCodigo)) {
      setMensajeModal('El código del bastón no es válido');
      return;
    }
    setGuardando(true);
    try {
      await guardarCodigoBaston(nuevoCodigo);
      setModalAbierto(false);
    } catch (error) {
      setMensajeModal('No pudimos actualizar el bastón');
    } finally {
      setGuardando(false);
    }
  }

  function alCerrarSesion() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await cerrarSesion();
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabecera con avatar y correo */}
      <View style={estilos.cabecera}>
        <Avatar correo={usuario?.email} />
        <Text style={estilos.correo} numberOfLines={1}>
          {usuario?.email || 'Sin correo'}
        </Text>
        <Text style={estilos.rolCuidador}>Cuidador</Text>
      </View>

      <SeccionAjustes titulo="Cuenta">
        <FilaInfo
          icono="mail-outline"
          etiqueta="Correo"
          valor={usuario?.email || 'No disponible'}
        />
        <FilaInfo
          icono="person-outline"
          etiqueta="Rol"
          valor="Cuidador"
          sinLineaAbajo
        />
      </SeccionAjustes>

      <SeccionAjustes titulo="Bastón vinculado">
        <FilaInfo
          icono="hardware-chip-outline"
          etiqueta="Código"
          valor={codigoBaston || 'Sin bastón vinculado'}
        />
        <Pressable
          style={({ pressed }) => [
            estilos.filaAccion,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => {
            setNuevoCodigo(codigoBaston || '');
            setMensajeModal('');
            setModalAbierto(true);
          }}
        >
          <Ionicons name="swap-horizontal" size={20} color={COLORES.azulEstructura} />
          <Text style={estilos.textoAccion}>Cambiar bastón</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORES.textoSecundario} />
        </Pressable>
      </SeccionAjustes>

      <SeccionAjustes titulo="Sesión">
        <Pressable
          style={({ pressed }) => [
            estilos.botonCerrarSesion,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={alCerrarSesion}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORES.rojoAlerta} />
          <Text style={estilos.textoCerrarSesion}>Cerrar sesión</Text>
        </Pressable>
      </SeccionAjustes>

      <Text style={estilos.pieAplicacion}>Sentinela · v1.0</Text>

      {/* Modal para cambiar el código del bastón */}
      <Modal
        visible={modalAbierto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAbierto(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={estilos.overlayModal}
        >
          <View style={estilos.contenidoModal}>
            <Text style={estilos.tituloModal}>Cambiar bastón</Text>
            <Text style={estilos.textoModal}>
              Escribe el código del nuevo bastón que quieres monitorear.
            </Text>

            <TextInput
              value={nuevoCodigo}
              onChangeText={setNuevoCodigo}
              placeholder="SENTI-001"
              placeholderTextColor={COLORES.textoSecundario}
              autoCapitalize="characters"
              autoCorrect={false}
              style={estilos.campoModal}
            />

            {mensajeModal ? (
              <Text style={estilos.errorModal}>{mensajeModal}</Text>
            ) : null}

            <View style={estilos.botonesModal}>
              <Pressable
                style={({ pressed }) => [
                  estilos.botonModal,
                  estilos.botonModalCancelar,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => setModalAbierto(false)}
              >
                <Text style={estilos.textoBotonModalCancelar}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  estilos.botonModal,
                  estilos.botonModalGuardar,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={alGuardarNuevoCodigo}
                disabled={guardando}
              >
                <Text style={estilos.textoBotonModalGuardar}>
                  {guardando ? 'Guardando…' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

// Fila con ícono, etiqueta a la izquierda y valor a la derecha.
function FilaInfo({ icono, etiqueta, valor, sinLineaAbajo }) {
  return (
    <View style={[estilos.fila, sinLineaAbajo && { borderBottomWidth: 0 }]}>
      <View style={estilos.filaIzquierda}>
        <Ionicons name={icono} size={18} color={COLORES.azulEstructura} />
        <Text style={estilos.etiquetaFila}>{etiqueta}</Text>
      </View>
      <Text style={estilos.valorFila} numberOfLines={1}>
        {valor}
      </Text>
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
    paddingBottom: 40,
  },
  cabecera: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  correo: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    marginTop: 12,
  },
  rolCuidador: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 2,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.bordeSuave,
  },
  filaIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  etiquetaFila: {
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  valorFila: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoPrincipal,
    flexShrink: 1,
    marginLeft: 12,
    textAlign: 'right',
  },
  filaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  textoAccion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORES.azulEstructura,
  },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORES.rojoSuave,
    borderRadius: 12,
    paddingVertical: 14,
  },
  textoCerrarSesion: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.rojoAlerta,
  },
  pieAplicacion: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
  },
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
    marginBottom: 6,
  },
  textoModal: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginBottom: 16,
  },
  campoModal: {
    borderWidth: 1,
    borderColor: COLORES.bordeSuave,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORES.textoPrincipal,
    backgroundColor: COLORES.fondo,
  },
  errorModal: {
    color: COLORES.rojoAlerta,
    fontSize: 13,
    marginTop: 8,
  },
  botonesModal: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
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
    backgroundColor: COLORES.azulEstructura,
  },
  textoBotonModalCancelar: {
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
  textoBotonModalGuardar: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
