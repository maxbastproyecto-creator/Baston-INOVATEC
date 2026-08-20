// ContextoBaston.js
// Contexto global del bastón vinculado.
// Guarda el código del bastón, escucha su estado en tiempo real
// y expone esa información a cualquier pantalla.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { escucharEstadoActual } from '../servicios/escucharBaston';
import { CLAVES_ALMACENAMIENTO } from '../config/constantes';

const ContextoBaston = createContext({
  codigoBaston: null,
  estadoActual: null,
  cargandoCodigo: true,
  guardarCodigoBaston: async () => {},
  olvidarCodigoBaston: async () => {},
});

export function ProveedorBaston({ children }) {
  const [codigoBaston, setCodigoBaston] = useState(null);
  const [cargandoCodigo, setCargandoCodigo] = useState(true);
  const [estadoActual, setEstadoActual] = useState(null);

  // Al arrancar, recuperamos el código guardado en el teléfono.
  useEffect(() => {
    async function recuperarCodigoGuardado() {
      try {
        const guardado = await AsyncStorage.getItem(
          CLAVES_ALMACENAMIENTO.codigoBaston
        );
        if (guardado) {
          setCodigoBaston(guardado);
        }
      } catch (error) {
        console.log('No pudimos leer el código guardado:', error.message);
      } finally {
        setCargandoCodigo(false);
      }
    }
    recuperarCodigoGuardado();
  }, []);

  // Cuando hay un código de bastón, nos suscribimos a Firebase.
  useEffect(() => {
    if (!codigoBaston) {
      setEstadoActual(null);
      return;
    }
    const dejarDeEscuchar = escucharEstadoActual(codigoBaston, (datos) => {
      setEstadoActual(datos);
    });
    return () => {
      dejarDeEscuchar();
    };
  }, [codigoBaston]);

  const guardarCodigoBaston = useCallback(async (nuevoCodigo) => {
    const limpio = (nuevoCodigo || '').trim();
    await AsyncStorage.setItem(CLAVES_ALMACENAMIENTO.codigoBaston, limpio);
    setCodigoBaston(limpio);
  }, []);

  const olvidarCodigoBaston = useCallback(async () => {
    await AsyncStorage.removeItem(CLAVES_ALMACENAMIENTO.codigoBaston);
    setCodigoBaston(null);
    setEstadoActual(null);
  }, []);

  const valor = {
    codigoBaston,
    estadoActual,
    cargandoCodigo,
    guardarCodigoBaston,
    olvidarCodigoBaston,
  };

  return (
    <ContextoBaston.Provider value={valor}>{children}</ContextoBaston.Provider>
  );
}

export function useBaston() {
  return useContext(ContextoBaston);
}
