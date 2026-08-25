// NavegacionPrincipal.js
// Decide qué mostrar según el estado:
// 1) Si aún no sabemos si hay sesión: pantalla de carga.
// 2) Si no hay sesión: pantalla de Login.
// 3) Si hay sesión pero no hay bastón vinculado: pantalla de Vincular Bastón.
// 4) Si hay sesión y hay bastón: pestañas principales (Inicio, Mapa, Historial, Ajustes).

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PantallaLogin from '../pantallas/PantallaLogin';
import PantallaVincularBaston from '../pantallas/PantallaVincularBaston';
import PantallaInicio from '../pantallas/PantallaInicio';
import PantallaMapa from '../pantallas/PantallaMapa';
import PantallaHistorial from '../pantallas/PantallaHistorial';
import PantallaAjustes from '../pantallas/PantallaAjustes';

import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import { useBaston } from '../contextos/ContextoBaston';
import { COLORES } from '../config/constantes';

const Pila = createNativeStackNavigator();
const Pestanas = createBottomTabNavigator();

// Mapa de íconos: qué ícono le toca a cada pestaña.
// Es una constante del módulo, NO un Hook, así que sí puede vivir aquí.
const ICONOS_POR_PESTANA = {
  Inicio: 'home',
  Mapa: 'map',
  Historial: 'time',
  Ajustes: 'settings',
};

function PestanasPrincipales() {
  // Los Hooks van DENTRO del componente, nunca fuera.
  const { estadoActual } = useBaston();
  const enAlertaGlobal = estadoActual?.botonPanico === true;

  return (
    <Pestanas.Navigator
      screenOptions={({ route }) => ({
        // El ícono de cada pestaña se elige según su nombre.
        // Cuando la pestaña está activa usa el ícono "lleno";
        // cuando no, usa la versión "outline" (solo contorno).
        tabBarIcon: ({ focused, color, size }) => {
          const base = ICONOS_POR_PESTANA[route.name] || 'ellipse';
          const nombreIcono = focused ? base : `${base}-outline`;
          return <Ionicons name={nombreIcono} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORES.activo,
        tabBarInactiveTintColor: COLORES.textoSecundario,
        headerStyle: { 
        backgroundColor: COLORES.ventanaLuz,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
         },
        headerTintColor: '#1A1C1C',
        headerTitleStyle: { fontWeight: '750' },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      })}
    >
      <Pestanas.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{
          title: 'Inicio',
          // Globito rojo con "!" cuando hay alerta de pánico activa.
          tabBarBadge: enAlertaGlobal ? '!' : undefined,
          tabBarBadgeStyle: { backgroundColor: '#B7131A', color: '#FFFFFF' },
        }}
      />
      <Pestanas.Screen
        name="Mapa"
        component={PantallaMapa}
        options={{ title: 'Mapa' }}
      />
      <Pestanas.Screen
        name="Historial"
        component={PantallaHistorial}
        options={{ title: 'Historial' }}
      />
      <Pestanas.Screen
        name="Ajustes"
        component={PantallaAjustes}
        options={{ title: 'Ajustes' }}
      />
    </Pestanas.Navigator>
  );
}

export default function NavegacionPrincipal() {
  const { usuario, cargando } = useAutenticacion();
  const { codigoBaston, cargandoCodigo } = useBaston();

  if (cargando || cargandoCodigo) {
    return (
      <View style={estilos.pantallaCarga}>
        <ActivityIndicator size="large" color={COLORES.azulEstructura} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pila.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          <Pila.Screen name="Login" component={PantallaLogin} />
        ) : !codigoBaston ? (
          <Pila.Screen
            name="VincularBaston"
            component={PantallaVincularBaston}
          />
        ) : (
          <Pila.Screen name="Principal" component={PestanasPrincipales} />
        )}
      </Pila.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  pantallaCarga: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
});
