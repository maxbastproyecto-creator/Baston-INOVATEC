// PantallaLogin.js
// Pantalla de inicio de sesión con correo y contraseña.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import CampoDeTexto from '../componentes/CampoDeTexto';
import BotonPrincipal from '../componentes/BotonPrincipal';
import { iniciarSesion } from '../servicios/autenticacion';
import { pareceCorreoValido } from '../utilidades/validaciones';
import { COLORES } from '../config/constantes';

export default function PantallaLogin() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function alPresionarEntrar() {
    setMensajeError('');

    if (!pareceCorreoValido(correo)) {
      setMensajeError('Correo incorrecto');
      return;
    }
    if (!contrasena) {
      setMensajeError('Contraseña incorrecta');
      return;
    }

    setCargando(true);
    const resultado = await iniciarSesion(correo, contrasena);
    setCargando(false);

    if (!resultado.ok) {
      setMensajeError(resultado.mensaje);
    }
    // Si es correcto, el ContextoAutenticacion detecta el cambio
    // y la navegación cambia sola.
  }

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>Sentinela</Text>
        <Text style={estilos.subtitulo}>
          Ingresa con tu cuenta de cuidador
        </Text>

        <CampoDeTexto
          etiqueta="Correo"
          valor={correo}
          alCambiar={setCorreo}
          marcadorTexto="tu@correo.com"
          tipoTeclado="email-address"
        />

        <CampoDeTexto
          etiqueta="Contraseña"
          valor={contrasena}
          alCambiar={setContrasena}
          marcadorTexto="Tu contraseña"
          esContrasena
        />

        {mensajeError ? (
          <Text style={estilos.error}>{mensajeError}</Text>
        ) : null}

        <BotonPrincipal
          etiqueta="Entrar"
          alPresionar={alPresionarEntrar}
          cargando={cargando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    padding: 24,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORES.azulEstructura,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORES.textoSecundario,
    marginBottom: 24,
  },
  error: {
    color: COLORES.rojoAlerta,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
  },
});
