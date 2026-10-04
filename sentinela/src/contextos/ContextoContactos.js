import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContextoContactos = createContext(null);
const CLAVE = 'contactos_emergencia';
const CONTACTOS_BASE = [
  { id: 'base-emergencias', nombre: 'Emergencias', telefono: '911' },
  { id: 'base-policia', nombre: 'Policía', telefono: '118' },
];

export function ProveedorContactos({ children }) {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    try {
      const guardado = await AsyncStorage.getItem(CLAVE);
      if (guardado) {
        setContactos(JSON.parse(guardado));
      } else {
        // Primera vez: se siembran los defaults
        setContactos(CONTACTOS_BASE);
        await AsyncStorage.setItem(CLAVE, JSON.stringify(CONTACTOS_BASE));
      }
    } catch (e) {
      console.log('Error al cargar contactos:', e);
    }
  }

  function agregarContacto(nombre, telefono) {
    const nuevaLista = [
      ...contactos,
      { id: Date.now().toString(), nombre, telefono },
    ];
    setContactos(nuevaLista);
    AsyncStorage.setItem(CLAVE, JSON.stringify(nuevaLista)).catch(() => {});
  }

  function eliminarContacto(id) {
    const nuevaLista = contactos.filter((c) => c.id !== id);
    setContactos(nuevaLista);
    AsyncStorage.setItem(CLAVE, JSON.stringify(nuevaLista)).catch(() => {});
  }

  return (
    <ContextoContactos.Provider
      value={{ contactos, agregarContacto, eliminarContacto }}
    >
      {children}
    </ContextoContactos.Provider>
  );
}

export function useContactos() {
  const ctx = useContext(ContextoContactos);
  if (!ctx) throw new Error('useContactos debe usarse dentro de ProveedorContactos');
  return ctx;
}
