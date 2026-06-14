# Implementaciones extra futuras

Estas funciones no forman parte del MVP inicial. Deben integrarse solo después de verificar que el flujo end-to-end compile y funcione correctamente.

## 1. Widget de alerta rápida

Regla principal: el widget no debe enviar alertas directamente. Debe abrir una pantalla reutilizable `QuickAlertScreen` con el tipo de alerta precargado, y el ciudadano debe confirmar antes de enviar.

### Estructura sugerida

```ts
// mobile/src/screens/citizen/QuickAlertScreen.tsx
// Recibe route.params?.type y reutiliza el flujo de CreateAlertScreen.
```

### Simulación visual inicial

Crear una tarjeta en Inicio ciudadano llamada “Acceso rápido simulado” que abra `CreateAlertScreen` con `prefillType: "Consumo de alcohol en vía pública"`.

### Widget real posterior

Expo administrado puede complicar widgets nativos. Para producción se recomienda pasar a Expo prebuild/EAS y crear:

- Android App Widget con intent hacia la app.
- iOS WidgetKit con deep link.
- Deep link interno: `kusi-alerta://quick-alert?type=alcohol`.

## 2. Participación ciudadana responsable

Agregar una pantalla educativa con mensajes de prevención:

- “Reporta solo incidencias reales.”
- “No te expongas para tomar evidencia.”
- “Evita confrontar a las personas involucradas.”

No usar puntos, rankings, niveles o recompensas.

## 3. Mapa de calor

En administrador, agregar una vista agregada por cuadrantes referenciales, sin coordenadas exactas. El objetivo es visualizar concentración por tipo y horario, sin identificar domicilios ni personas.

## 4. Modo accesible ampliado

Agregar configuración de:

- Texto grande.
- Alto contraste.
- Reducción de animaciones.
- Lectura más simple de estados.

## 5. Sugerencia automática de sereno

Sin IA real. Usar regla determinística:

1. Filtrar serenos disponibles.
2. Priorizar el que tenga menos alertas asignadas en el día.
3. Si hay empate, sugerir el primero por orden alfabético.

El operador siempre debe confirmar manualmente la asignación.
