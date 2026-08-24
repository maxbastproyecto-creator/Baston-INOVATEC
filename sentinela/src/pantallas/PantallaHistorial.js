// PantallaHistorial.js
// Historial rediseñado como "línea del tiempo".
// Cada evento es un punto de color conectado a los demás por una línea vertical.
// Se agrupan los eventos por día (Hoy / Ayer / fecha exacta).

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LineaTiempoEvento from '../componentes/LineaTiempoEvento';
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

  // Agrupamos los eventos por día para poner un encabezado ("Hoy",
  // "Ayer" o la fecha exacta) antes de cada grupo.
  const itemsConEncabezados = useMemo(
    () => agruparPorDia(eventos),
    [eventos]
  );

  return (
    <View style={estilos.contenedor}>
      {/* Encabezado con ícono y título */}
      <View style={estilos.encabezado}>
        <View style={estilos.circuloIcono}>
          <Ionicons name="time" size={22} color={COLORES.azulEstructura} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>Historial</Text>
          <Text style={estilos.subtitulo}>
            {eventos.length === 0
              ? 'Sin eventos todavía'
              : `${eventos.length} evento${eventos.length === 1 ? '' : 's'} registrado${eventos.length === 1 ? '' : 's'}`}
          </Text>
        </View>
      </View>

      {eventos.length === 0 ? (
        <View style={estilos.contenedorVacio}>
          <Ionicons name="documents-outline" size={48} color={COLORES.textoSecundario} />
          <Text style={estilos.textoVacio}>{TEXTO_SIN_HISTORIAL}</Text>
          <Text style={estilos.pistaVacio}>
            Los eventos del bastón aparecerán aquí en cuanto lleguen.
          </Text>
        </View>
      ) : (
        <FlatList
          data={itemsConEncabezados}
          keyExtractor={(item) => item.claveUnica}
          renderItem={({ item, index }) => {
            if (item.tipo === 'encabezado') {
              return <Text style={estilos.encabezadoDia}>{item.texto}</Text>;
            }
            // Buscamos si el siguiente item es de otro día o es el fin de la lista.
            const siguiente = itemsConEncabezados[index + 1];
            const esUltimoDelGrupo =
              !siguiente || siguiente.tipo === 'encabezado';
            return (
              <LineaTiempoEvento
                evento={item.evento}
                esUltimo={esUltimoDelGrupo}
              />
            );
          }}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// Convierte la lista de eventos en una lista con encabezados de día.
// Ejemplo de salida:
//   [{tipo:'encabezado', texto:'Hoy'}, {tipo:'evento', evento:{...}}, ...]
function agruparPorDia(eventos) {
  const resultado = [];
  let diaAnterior = null;

  eventos.forEach((evento, indice) => {
    const dia = obtenerEtiquetaDia(evento.fechaHora);
    if (dia !== diaAnterior) {
      resultado.push({
        claveUnica: `enc-${dia}-${indice}`,
        tipo: 'encabezado',
        texto: dia,
      });
      diaAnterior = dia;
    }
    resultado.push({
      claveUnica: evento.id || `ev-${indice}`,
      tipo: 'evento',
      evento,
    });
  });

  return resultado;
}

// Devuelve "Hoy", "Ayer" o "10 de agosto de 2026" según la fecha.
function obtenerEtiquetaDia(cadenaFechaIso) {
  if (!cadenaFechaIso) return 'Sin fecha';
  const fecha = new Date(cadenaFechaIso);
  if (isNaN(fecha.getTime())) return 'Sin fecha';

  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  if (mismasFechas(fecha, hoy)) return 'Hoy';
  if (mismasFechas(fecha, ayer)) return 'Ayer';

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

function mismasFechas(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    padding: 20,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  circuloIcono: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: COLORES.azulSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORES.textoPrincipal,
  },
  subtitulo: {
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  encabezadoDia: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORES.textoSecundario,
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },
  lista: {
    paddingBottom: 40,
  },
  contenedorVacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  textoVacio: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.textoPrincipal,
    marginTop: 14,
    textAlign: 'center',
  },
  pistaVacio: {
    fontSize: 13,
    color: COLORES.textoSecundario,
    marginTop: 6,
    textAlign: 'center',
  },
});
