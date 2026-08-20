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

function PestanasPrincipales() {
  return (
    <Pestanas.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORES.azulEstructura,
        tabBarInactiveTintColor: COLORES.textoSecundario,
        headerStyle: { backgroundColor: COLORES.azulEstructura },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Pestanas.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{ title: 'Inicio' }}
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
