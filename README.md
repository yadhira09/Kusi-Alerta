# KusiAlerta: ciudadano protegido, Serenazgo en ruta

**Equipo:** AKYCcusianas  
**Representante:** Ataucusi Bueno, Jesús Alejandro  
**Desafío:** Hackatón TransformaGob 2026 - Desafío 9 - Municipalidad Distrital Coronel Gregorio Albarracín Lanchipa, Tacna, Perú.

KusiAlerta es un prototipo funcional end-to-end para reportar incidencias de alteración del orden público asociadas al consumo de alcohol cerca del **Mercado Santa Rosa y alrededores**, en un radio referencial aproximado de cinco cuadras. El prototipo no usa coordenadas exactas ni datos personales reales.

## Problema

El ciudadano pierde minutos críticos buscando teléfonos, explicando verbalmente su ubicación y esperando sin saber si su alerta será atendida. Además, la Central de Operaciones registra manualmente, lo que genera duplicidad, demoras y baja trazabilidad.

## Objetivo

Demostrar el flujo crítico completo:

Ciudadano genera alerta → Backend registra alerta → Operador valida → Operador asigna sereno → Sereno actualiza estado → Ciudadano visualiza avance → Caso atendido → Ciudadano califica → Administrador visualiza indicadores y trazabilidad.

## Arquitectura

```txt
kusi-alerta/
├── backend/     Node.js + Express + Prisma + PostgreSQL + Socket.IO
├── web/         React + Vite + TypeScript para operador y administrador
├── mobile/      React Native + Expo + TypeScript para ciudadano y sereno
├── packages/    Tipos y enums compartidos
└── docker-compose.yml
```

## Tecnologías

- **Mobile:** React Native, Expo, TypeScript, React Navigation, Axios, Socket.IO Client.
- **Web:** React, Vite, TypeScript, React Router, Axios, Socket.IO Client, CSS responsive, HTML semántico.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Socket.IO, CORS, dotenv.
- **Base de datos:** PostgreSQL con Docker Compose.

## Instalación y ejecución

### 1. Levantar PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

El backend queda en: `http://localhost:4000`

### 3. Web

```bash
cd web
npm install
npm run dev
```

El panel queda en: `http://localhost:5173`

### 4. Mobile

```bash
cd mobile
npm install
npx expo start
```

En Android Emulator se usa `http://10.0.2.2:4000`. En iOS Simulator o navegador se usa `http://localhost:4000`. En dispositivo físico, cambia `API_HOST` en `mobile/src/services/config.ts` por la IP LAN de tu computadora.

## Roles simulados

- Ciudadano demo: **Rosa Quispe**
- Operadora demo: **Carmen Flores**
- Sereno 01: **Luis Mamani** - Disponible
- Sereno 02: **Juan Condori** - Disponible
- Sereno 03: **Pedro Apaza** - En atención
- Administrador demo: **Admin MDCGAL**

Todos los datos son ficticios y demostrativos.

## Flujo de demo para jurado en menos de 5 minutos

1. Abrir app móvil y elegir **Ciudadano**.
2. Entrar a **Reportar incidencia**.
3. Crear alerta por consumo de alcohol cerca del Mercado Santa Rosa.
4. Mostrar confirmación discreta y código **KUSI-0001** o el código generado.
5. Abrir el panel web como operador.
6. Ver la alerta recibida en tiempo real.
7. Marcar como recibida por Central.
8. Asignar a Sereno 01 usando el semáforo operativo.
9. Volver a la app y elegir **Sereno**.
10. Abrir la alerta asignada.
11. Confirmar desplazamiento.
12. Volver a ciudadano y mostrar **Sereno en camino**.
13. Sereno marca llegada/inicia intervención.
14. Ciudadano ve **El equipo llegó a la zona**.
15. Sereno cierra el caso.
16. Ciudadano califica la atención.
17. Abrir administrador y mostrar indicadores, historial, trazabilidad, cronómetros y control de rechazados.

## Innovaciones MVP incluidas

1. **Kusi Rápido:** alerta en 3 pasos.
2. **Código KUSI:** `KUSI-0001`, visible en todas las vistas.
3. **Cronómetro y trazabilidad:** tiempos desde creación, recepción, asignación, intervención y atención.
4. **Modo discreto ciudadano:** confirmación segura sin llamadas ni animaciones intensas.
5. **Semáforo operativo:** verde, amarillo y rojo con texto accesible; solo permite asignar disponibles.

## Accesibilidad WCAG 2.2 básica

- Contraste alto y texto legible.
- Estados acompañados por texto, no solo color.
- Botones grandes y navegación simple.
- Labels visibles.
- HTML semántico en web.
- Foco visible para teclado.
- `accessibilityRole`, `accessibilityLabel` y `accessibilityHint` en app móvil.
- Mensajes importantes con `aria-live` en web.
- Sin sonidos fuertes ni animaciones intensas.

## Alcance

Incluye app móvil ciudadano, app móvil sereno, panel operador, panel administrador, backend REST, Socket.IO, PostgreSQL, registro de alerta, recepción, validación, asignación, seguimiento, atención en campo, cierre, calificación, historial, dashboard, control de rechazados, Kusi Rápido, código KUSI, cronómetro, modo discreto y semáforo de serenos.

## No alcance

No incluye app publicada, integración real municipal, RENIEC, DNI real, reconocimiento facial, vigilancia masiva, perfilamiento, funciones policiales/judiciales/sancionadoras, datos personales reales, evidencias sensibles reales, GPS dedicado, IA real, gamificación con puntos/rankings o push notifications reales.

## Privacidad

Este prototipo usa nombres, zonas, evidencias, teléfonos y coordenadas simuladas. La ubicación del Mercado Santa Rosa es referencial y no se usan coordenadas exactas por no contar con fuente verificable dentro del prototipo.

## Extras futuros, separados del MVP

Al final del repositorio se incluye una guía en `EXTRAS_FUTUROS.md` para: widget de alerta rápida, participación ciudadana responsable, mapa de calor, modo accesible ampliado y sugerencia automática de sereno.
