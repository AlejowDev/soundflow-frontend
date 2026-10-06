# SoundFlow — App móvil

App de **React Native (Expo SDK 57)** para explorar y reproducir contenido musical con un esquema **maestro–detalle**: el menú de la izquierda (Perfil, Fotos, Video, Web, Botones) siempre está visible y el contenido cambia a la derecha.

## Requisitos

- Node 20+ y pnpm
- La app **Expo Go** en el celular (Android), o un emulador Android
- El [backend](https://github.com/AlejowDev/soundflow-backend) corriendo

## Puesta en marcha

```bash
pnpm install
cp .env.example .env     # EXPO_PUBLIC_API_URL = URL del backend (sin /api)
pnpm start               # escanear el QR con Expo Go
pnpm web                 # vista previa en el navegador
```

> En un celular físico `localhost` es el propio teléfono: usa la IP de tu PC en la red local (ej. `http://192.168.1.20:5006`) o el dominio público del backend.

Usuario demo: `demo@soundflow.app` / `soundflow123`

## Secciones y requerimientos

| Sección | Qué hace | RF |
|---|---|---|
| Menú lateral | Siempre visible; cambia el contenido de la derecha | RF01, RF08 |
| Perfil | Foto, titular, universidad, estudios y experiencia con scroll propio; editable | RF02 |
| Fotos | Galería en cuadrícula; al tocar una imagen abre su descripción | RF03, RF04 |
| Video | Reproductor con controles nativos y lista de videos | RF05 |
| Web | Campo de URL y navegador embebido (WebView) dentro de la app | RF06 |
| Botones | Reproducir, pausar, anterior y siguiente, barra de progreso, búsqueda y lista de canciones | RF07 |

La música sigue sonando al cambiar de sección (mini reproductor abajo).

## Estructura

```
src/
├── components/   Button, Input, SideMenu, MusicPlayer, MiniPlayer, SongCard, PhotoCard, WebFrame...
├── screens/      Auth, Profile, Photos, Video, Web, Player
├── navigation/   AppNavigator (sesión), AuthNavigator (login/registro), MainNavigator (drawer permanente)
├── services/     cliente HTTP y servicios de la API
├── hooks/        useAuth, useFetch, usePlayer (reproductor global con expo-audio)
├── store/        authStore (zustand + AsyncStorage)
├── types/        modelos
├── utils/        formatTime, validators
├── theme/        colores, espaciado, tipografía
└── config/       URL del backend
```
