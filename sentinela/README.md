# Baston-INOVATEC / Sentinela

Aplicacion movil para supervisar un baston inteligente y ayudar a un cuidador a consultar su estado, ubicacion y eventos recientes. El sistema recibe la informacion publicada por el baston en Firebase Realtime Database y la presenta en una interfaz desarrollada con React Native.

El proyecto movil se encuentra en la carpeta `sentinela/`.

## 1. Descripcion general

Sentinela permite:

- Iniciar y cerrar sesion mediante correo y contrasena.
- Vincular un baston mediante un codigo identificador.
- Consultar el estado actual del baston en tiempo real.
- Visualizar nivel de bateria, precision GPS, conexion y estado del boton de panico.
- Consultar los ultimos eventos registrados.
- Ver la ultima ubicacion conocida en un mapa y abrirla en la aplicacion de mapas del telefono.
- Mantener la sesion y el codigo del baston en el dispositivo.

El flujo principal de navegacion es:

1. La aplicacion comprueba si existe una sesion activa.
2. Si no existe, muestra la pantalla de inicio de sesion.
3. Si existe una sesion pero no hay un baston vinculado, solicita el codigo del baston.
4. Cuando ambos datos estan disponibles, habilita las pantallas de Inicio, Mapa, Historial y Ajustes.

## 2. Tecnologias utilizadas

### Aplicacion movil

- **React Native 0.81.5**: tecnologia principal para construir la aplicacion movil multiplataforma.
- **Expo SDK 54**: plataforma y conjunto de herramientas utilizado para iniciar, desarrollar y ejecutar el proyecto React Native.
- **React 19.1.0**: biblioteca base de la interfaz.
- **React Navigation 7**: navegacion mediante stack y pestanas inferiores.
- **Expo Vector Icons / Ionicons**: iconos de la interfaz.
- **react-native-maps**: visualizacion de la ubicacion del baston.
- **AsyncStorage**: persistencia local de la sesion de Firebase y del codigo vinculado.
- **react-native-gesture-handler** y **react-native-safe-area-context**: gestos y adaptacion a las areas seguras del dispositivo.

### Backend y servicios

- **Firebase Authentication**: autenticacion de usuarios con correo y contrasena.
- **Firebase Realtime Database**: lectura de estado y eventos del baston mediante listeners en tiempo real.
- **Firebase Web SDK 11**: API utilizada desde React Native para inicializar Firebase, Authentication y Realtime Database.
- **Expo Linking**: apertura de la ultima ubicacion en Google Maps u otra aplicacion compatible del telefono.

La aplicacion movil funciona como cliente de Firebase; el baston o el dispositivo que lo acompana debe publicar la informacion en las rutas esperadas de Realtime Database.

## 3. Requisitos previos

Antes de instalar el proyecto se necesita:

- Node.js LTS y npm.
- Un telefono Android o iOS con Expo Go, o un emulador/simulador configurado.
- Una cuenta de Firebase con acceso al proyecto correspondiente.
- Conexion a internet para autenticarse y recibir datos en tiempo real.
- Para ejecutar en Android: Android Studio, Android SDK y un emulador, si no se usara un telefono fisico.
- Para ejecutar en iOS: macOS con Xcode y un simulador, si no se usara un telefono fisico.

Usted puede comprobar la instalacion de Node.js y npm con:

```bash
node --version
npm --version
```

## 4. Instalacion paso a paso

### Paso 1: Clonar o abrir el proyecto y entrar al proyecto movil

Ubicarse en la carpeta raiz del proyecto:

```bash
cd sentinela
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Este comando instala React Native, Expo, Firebase, React Navigation, mapas, almacenamiento local y las demas dependencias declaradas en `sentinela/package.json`.

### Paso 3: Acceder a Firebase

El proyecto ya esta conectado a Firebase y no es necesario crear otro proyecto ni modificar la configuracion del SDK. La aplicacion utiliza el proyecto **SentinelaHackaton** mediante `sentinela/src/servicios/firebase.js`.

Para entrar en la aplicacion, utiliza la cuenta de prueba:

```text
Correo: sentinelaprueba@gmail.com
Contrasena: sentinelaP123
```

Estas credenciales son para iniciar sesion en la pantalla de la aplicacion. No deben escribirse en `firebase.js`: el archivo contiene la configuracion publica del proyecto (`apiKey`, `projectId`, `databaseURL`, etc.), mientras que el correo y la contrasena pertenecen a Firebase Authentication. Por seguridad, cambia esta contrasena si la cuenta deja de ser exclusivamente de prueba.

Si el correo se escribe diferente, utiliza exactamente la cuenta registrada en Firebase Authentication: `sentinelaprueba@gmail.com`.

### Paso 4: Preparar los datos del baston

El cliente escucha estas rutas de Realtime Database:

```text
bastones/{idBaston}/estadoActual
historial/{idBaston}
```

El objeto `estadoActual` puede incluir, entre otros, los siguientes campos:

```json
{
	"botonPanico": false,
	"nivelBateria": 85,
	"precisionGps": 12,
	"estadoConexion": "Conectado",
	"latitud": 13.6929,
	"longitud": -89.2182,
	"fechaHora": "2026-08-25T12:00:00.000Z"
}
```

Los eventos del historial deben almacenarse debajo de `historial/{idBaston}`. Cada evento necesita una clave propia y puede incluir `fechaHora`, que se utiliza para ordenar los eventos del mas reciente al mas antiguo.

### Paso 5: Verificar el codigo inicial del mapa

Si el baston todavia no reporta coordenadas, la pantalla Mapa utiliza la region definida en `sentinela/src/config/mapa.js`. Es posible cambiar esas coordenadas por una ubicacion de prueba.

## 5. Ejecucion del sistema

Todos los comandos de ejecucion deben ejecutarse dentro de `sentinela/`.

### Iniciar el servidor de desarrollo

```bash
npm start
```

Tambien puede utilizarse directamente:

```bash
npx expo start
```

Expo mostrara un codigo QR y opciones para abrir la aplicacion en un dispositivo o emulador.

### Ejecutar en Android

Con un dispositivo Android conectado o un emulador activo:

```bash
npm run android
```

### Ejecutar en iOS

En macOS, con un simulador disponible:

```bash
npm run ios
```

### Ejecutar en navegador web

```bash
npm run web
```

La experiencia principal esta pensada para Android/iOS. Algunas capacidades nativas, especialmente mapas, pueden comportarse de forma diferente en web.

## 6. Uso basico

1. Abrir la aplicacion con Expo.
2. Iniciar sesion con un usuario creado en Firebase Authentication.
3. Introducir el codigo del baston registrado en Realtime Database.
4. Revisar el estado en la pantalla Inicio.
5. Consultar la ubicacion en Mapa.
6. Revisar los eventos en Historial.
7. Administrar la sesion y la vinculacion desde Ajustes.

Cuando `botonPanico` es `true`, la interfaz marca la alerta visualmente y muestra el indicador correspondiente en la navegacion y en el mapa.

## 7. Modificar el estado y la ubicacion desde Firebase

La aplicacion lee los cambios de Firebase en tiempo real. Para modificar los datos del baston de prueba, sigue estos pasos:

1. Abre [Firebase Console](https://firebase.google.com/?hl=es-419) en el navegador.
2. Desplazate hacia abajo y pulsa **Get started in console** o **Comenzar en la consola**.
3. En el lado derecho, localiza la lista de proyectos y selecciona **SentinelaHackaton**.
4. En la barra lateral izquierda, entra en **Realtime Database**.
5. En el arbol de datos, localiza las ramas **bastones** e **historial**. Pulsa la flecha o el nombre de cada rama para desplegar sus datos.
6. Para editar el estado actual, abre la ruta `bastones/SENTI-001/estadoActual/`.
7. Para activar el boton de panico, localiza `botonPanico`, cambia `false` por `true` y guarda el cambio.
8. Para devolver el sistema al estado normal, cambia `botonPanico` de `true` a `false` y guarda de nuevo.

### Cambiar la posicion del mapa

Dentro de `bastones/SENTI-001/estadoActual/`, localiza los campos `latitud` y `longitud`. Los numeros junto a esos campos son las coordenadas de la ubicacion actual.

1. Busca en Google Maps el punto que quieras utilizar.
2. Copia su latitud y longitud.
3. Sustituye los valores de `latitud` y `longitud` en Firebase.
4. Guarda ambos cambios.
5. Regresa a la aplicacion y abre **Mapa**. El marcador se actualizara cuando el listener reciba los nuevos datos.

Usa valores numericos, sin comillas. Por ejemplo:

```json
{
	"botonPanico": true,
	"latitud": 13.6929,
	"longitud": -89.2182
}
```

La rama **historial** contiene los eventos registrados. No es necesario modificarla para probar el boton de panico o la posicion actual; esas pruebas se realizan en `estadoActual`.

## 8. Estructura del proyecto

```text
sentinela/
├── App.js                         # Punto de entrada y proveedores globales
├── package.json                   # Dependencias y scripts
├── assets/                        # Recursos visuales
└── src/
		├── componentes/               # Componentes reutilizables de la interfaz
		├── config/                    # Colores, rutas Firebase y region del mapa
		├── contextos/                 # Estado global de autenticacion y baston
		├── navegacion/                # Stack y pestanas principales
		├── pantallas/                 # Login, inicio, mapa, historial y ajustes
		├── servicios/                 # Firebase, autenticacion y listeners
		└── utilidades/                # Fechas, textos y validaciones
```

## 9. Solucion de problemas comunes

- **No aparecen datos del baston:** verificar el codigo vinculado, la conexion a internet y las rutas `estadoActual` e `historial` en Realtime Database.
- **No se puede iniciar sesion:** confirmar que el usuario exista y que Correo electronico/Contrasena este habilitado en Firebase Authentication.
- **El mapa no muestra un marcador:** el estado debe contener `latitud` y `longitud` numericas.
- **No abre el proyecto en el dispositivo:** confirmar que el telefono y el equipo esten en la misma red, o ejecutar Expo con la opcion de tunel disponible.
- **La aplicacion conserva un baston anterior:** eliminar la vinculacion desde Ajustes o borrar los datos locales de la aplicacion para realizar una prueba limpia.
- **Firebase pide configurar un proyecto:** no crees otro proyecto para esta prueba. Comprueba que abriste **SentinelaHackaton** y que la aplicacion conserva la configuracion de `sentinela/src/servicios/firebase.js`.
- **El cambio de Firebase no aparece inmediatamente:** confirma que guardaste el valor, que estas editando `bastones/SENTI-001/estadoActual/` y que la aplicacion tiene conexion a internet.

## 10. Scripts disponibles

| Comando | Funcion |
| --- | --- |
| `npm start` | Inicia Expo en modo desarrollo |
| `npm run android` | Inicia Expo y abre Android |
| `npm run ios` | Inicia Expo y abre iOS |
| `npm run web` | Inicia Expo para navegador web |

## 11. Estado del desarrollo

Este repositorio contiene el cliente movil de Sentinela. Para disponer de informacion real, debe existir un baston o servicio externo que escriba los estados y eventos en Firebase Realtime Database respetando la estructura descrita anteriormente.
