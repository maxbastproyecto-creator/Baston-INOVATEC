# 📲 GUIA DE INSTALACION LOCAL — SENTINELA

Guía paso a paso para descargar, instalar y probar la aplicación
**Sentinela** en tu propia computadora y teléfono. No hace falta saber
programar.

La app ya viene conectada al proyecto Firebase del equipo
(**SentinelaHackaton**), así que no hay que crear ni configurar ninguna
base de datos: solo clonar, instalar y ejecutar.

---

## 🔧 Tecnologías utlizadas

**Software**
1. Expo
2. React Native

**Base de datos (realtimebasedata)**
1. Firebase

**En un dispostivo móvil:**
1. Expo go

**Hardware (Bastón)**
1. basado en tecnología ESP32
---

## ✅ Requisitos previos

1. Una computadora con **Windows 11** (también funciona en Mac/Linux).
2. Un teléfono **Android o iPhone** conectado a la **misma red Wi-Fi**
   que la computadora.
3. **Node.js LTS** instalado:
   - Descarga desde https://nodejs.org (botón verde "LTS").
   - Instala con las opciones por defecto.
   - Para comprobar: abre **PowerShell** y escribe
     `node --version` — debe aparecer un número (ej. `v22.x`).
4. **Expo Go** en el teléfono: búscala gratis en Play Store o App Store.

---

## 📥 Paso 1 — Descargar el código

El código está en el repositorio de GitHub del equipo.

**Opción A — Con Git instalado:**

Abre PowerShell y ejecuta:

```powershell
git clone https://github.com/maxbastproyecto-creator/Baston-INOVATEC
cd Baston-INOVATEC\sentinela
```

**Opción B — Sin Git (más fácil):**

1. Abre el repositorio en el navegador:
   `https://github.com/USUARIO-DEL-EQUIPO/Baston-INOVATEC`
2. Pulsa el botón verde **"Code" → "Download ZIP"**.
3. Descomprime el archivo.
4. Abre PowerShell **dentro de la carpeta `sentinela`**
   (en el Explorador de Windows: clic derecho sobre la carpeta →
   "Abrir en Terminal").

> ⚠️ El proyecto móvil está dentro de la subcarpeta `sentinela/`.
> Todos los comandos siguientes se ejecutan desde esa carpeta.

---

## 📦 Paso 2 — Instalar las dependencias

En PowerShell (dentro de `sentinela`):

```powershell
npm install
```

Tarda unos minutos la primera vez. Verás avisos amarillos
`npm warn deprecated...`: **son normales y no afectan la app**.
No ejecutes `npm audit fix --force`.

---

## 🚀 Paso 3 — Arrancar la app

```powershell
npx expo start -c
```

Aparecerá un **código QR** en la terminal. Déjala abierta mientras
pruebas.

---

## 📱 Paso 4 — Abrir la app en tu teléfono

- **Android**: abre Expo Go → "Scan QR code" → escanea el código.
- **iPhone**: abre la cámara del sistema → apunta al QR → toca la
  notificación que aparece.

La app carga en unos segundos y verás la pantalla de inicio de sesión.

---

## 🔑 Paso 5 — Iniciar sesión en la app


Las credenciales:

cuenta 1 de prueba: cuidador1@sentinela.com
contraseña: sentinela123

cuenta 2 de prueba: cuidador2@sentinela.com
contraseña: sentinela1234

1. En la pantalla de login de la app, escribe el correo y la contraseña de la cuenta seleccionada para la demostración.
2. Pulsa **Entrar**.
3. La app pedirá el código del bastón. Escribe: **SENTI-001**
   (mayúsculas, con guión).
4. Pulsa **Guardar bastón**.

Verás las cuatro pantallas: **Inicio** (estado actual), **Mapa**
(ubicación), **Historial** (eventos) y **Ajustes** (cuenta y sesión).

---

## 🧪 Paso 6 — Hacer pruebas en tiempo real

Aquí es donde visualizamos el sistema funcionando de verdad: vas a **cambiar los
datos en Firebase con tus propias manos** y ver cómo tu teléfono reacciona
solo, en segundos.

### 6.1 Entrar a la consola de Firebase

1. En el navegador de la computadora, abre:
   https://console.firebase.google.com
2. Inicia sesión con la cuenta: 
   **sentinelaprueba@gmail.com** y su contraseña **sentinelaP123**
   (correo y contraseña que comparte el equipo para pruebas).
3. Presiona el boton **GET STARTED IN CONSOLE** 
4. Verás el proyecto **SentinelaHackaton**. Haz clic para abrirlo.

### 6.2 Abrir la base de datos

1. En el menú de la izquierda, entra a **Build → Realtime Database**
   **(o "Compilación → Realtime Database").**
2. Pestaña **"Datos"**. Verás un árbol con dos ramas:
   - `bastones`
   - `historial`
3. Despliega: `bastones` → `SENTI-001` → `estadoActual`.

Verás campos como `botonPanico`, `nivelBateria`, `latitud`,
`longitud`, `estadoConexion`.

### 6.3 Prueba 1 — Activar la alerta de pánico 🔴

1. En `estadoActual`, haz clic sobre el valor `false` de
   **`botonPanico`**.
2. Escríbelo como `true` y pulsa **Enter** (o el ✓ de guardar).
3. **Mira tu teléfono sin tocarlo**: en menos de 2 segundos la pantalla
   de Inicio cambia a **rojo** con "Alerta activa", y aparece un globo
   rojo con "!" sobre la pestaña Inicio.
4. Ve a la pestaña **Mapa**: el marcador también está en rojo.

### 6.4 Prueba 2 — Desactivar la alerta 🟢

1. En Firebase, cambia `botonPanico` de vuelta a `false` y guarda.
2. La app vuelve a verde sola: "Todo en orden".

### 6.5 Prueba 3 — Mover el bastón en el mapa 🗺️

1. En Google Maps busca cualquier punto (tu escuela, tu casa).
2. Clic derecho sobre el punto → copia las coordenadas
   (aparecen como dos números, ej. `13.7000, -89.2000`).
3. En Firebase, edita `latitud` con el primer número y `longitud` con
   el segundo. Guarda ambos.
4. En la app, abre **Mapa**: el marcador saltó al nuevo punto.
5. Toca **"Abrir en mapas del teléfono"**: se abre Google Maps con esa
   ubicación.

### 6.6 Prueba 4 — Simular batería baja 🔋

1. Cambia `nivelBateria` de `82` a `15`.
2. En la app, el chip de batería cambia a color de advertencia.

### 6.7 Prueba 5 — Agregar un evento al historial 🕐

1. En el árbol de datos, despliega `historial` → `SENTI-001`.
2. Pulsa el **"+"** sobre `SENTI-001` para agregar un hijo nuevo:
   - Nombre de la clave: `eventoPrueba1`
   - Valor: déjalo vacío por ahora y vuelve a pulsar **"+"** dentro de
     `eventoPrueba1` para agregar estos tres campos:

   | Campo | Tipo | Valor |
   |---|---|---|
   | `tipo` | string | `panico` |
   | `fechaHora` | string | `2026-08-25T18:00:00Z` |
   | `resumen` | string | `Evento de prueba desde la consola` |

3. En la app, abre **Historial**: tu evento nuevo aparece primero en la
   línea de tiempo.

---

## 🛠️ Si algo falla

| Problema | Solución |
|---|---|
| `npm` no se reconoce | Node.js no está instalado. Revisa los requisitos. |
| El teléfono no ve el QR | Laptop y teléfono deben estar en la **misma Wi-Fi**. Si la red lo bloquea (algunas escuelas), usa `npx expo start --tunnel`. |
| "Project is incompatible with this version of Expo Go" | Actualiza Expo Go desde la tienda. El proyecto usa SDK 54. |
| El login dice "Correo incorrecto" | Escribe el correo de demostración exactamente como te lo dio el equipo, sin espacios. |
| Se ve la app pero sin datos | Verifica que el código del bastón sea exactamente `SENTI-001`. |
| Los cambios en Firebase no se ven | Confirma que guardaste el valor (Enter o ✓), que estás editando `bastones/SENTI-001/estadoActual/` y que el teléfono tiene internet. |
| La app conserva un bastón anterior | Ve a **Ajustes → Cambiar bastón**, o borra los datos de Expo Go en los ajustes del teléfono. |
| Pantalla roja con error de código | Cierra el servidor con Ctrl+C y vuelve a arrancar con `npx expo start -c`. |

---

## ℹ️ Notas importantes

- Las cuentas de demostración son **compartidas**: si varias personas la
  usan a la vez, todas verán los mismos cambios (eso es justamente lo
  que demuestra la app: varios cuidadores ven el mismo bastón).
- Si cambias datos en Firebase, **devuélvelos a su valor original** al
  terminar, para que el siguiente evaluador encuentre el sistema en
  estado normal: `botonPanico: false`, batería `82`, coordenadas
  originales.


*Proyecto SENTINELA — Bastón-INOVATEC · Hackatón 2026.*
*Repositorio: https://github.com/maxbastproyecto-creator/Baston-INOVATEC*

