// PantallaHistorial.js
// Muestra la lista de eventos que el bastón ha registrado.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import TarjetaEvento from '../componentes/TarjetaEvento';
import { useBaston } from '../contextos/ContextoBaston';
import { escucharHistorial } from '../servicios/escucharBaston';
import { COLORES } from '../config/constantes';
import { TEXTO_SIN_HISTORIAL } from '../utilidades/textos';

export default function PantallaHistorial() {
  const { codigoBaston } = useBaston();
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    if (!codigoBaston) {
      setEventos([]);
      return;
    }
    const dejarDeEscuchar = escucharHistorial(codigoBaston, (lista) => {
      setEventos(lista);
    });
    return () => {
      dejarDeEscuchar();
    };
  }, [codigoBaston]);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Historial de eventos</Text>

      {eventos.length === 0 ? (
        <Text style={estilos.vacio}>{TEXTO_SIN_HISTORIAL}</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TarjetaEvento evento={item} />}
          contentContainerStyle={estilos.lista}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
    marginBottom: 8,
  },
  vacio: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginTop: 12,
  },
  lista: {
    paddingBottom: 16,
  },
});
