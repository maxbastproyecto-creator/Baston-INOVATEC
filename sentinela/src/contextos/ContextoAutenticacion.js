// ContextoAutenticacion.js
// Contexto global de sesión.
// Cualquier pantalla puede saber si hay un usuario logueado
// llamando a useAutenticacion().

import React, { createContext, useContext, useEffect, useState } from 'react';

import { observarSesion } from '../servicios/autenticacion';

const ContextoAutenticacion = createContext({
  usuario: null,
  cargando: true,
});

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Nos suscribimos a los cambios de sesión.
    // Firebase avisa cuando el usuario inicia o cierra sesión.
    const dejarDeObservar = observarSesion((usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCargando(false);
    });

    return () => {
      dejarDeObservar();
    };
  }, []);

  const valor = { usuario, cargando };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAutenticacion() {
  return useContext(ContextoAutenticacion);
}
