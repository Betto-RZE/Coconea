# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Changed

- Catálogo compartido mediante API NestJS, PostgreSQL y Drizzle; panel de restaurantes con Better Auth, cuentas locales por establecimiento, creación y edición de productos, disponibilidad y actualización automática en consumidor. Validación por rol y propiedad, control de versiones, auditoría y pruebas de integración con base aislada. Se conserva el modo demo independiente.

- Menú desplegable superior del consumidor retirado; la navegación permanece en la barra inferior. Platillos y detalles con imágenes locales ilustrativas por categoría.

- Catálogo ampliado con Domino's y Green Grass: cinco restaurantes, 60 opciones de menú y filtros de hamburguesas, pizza, ensaladas, pollo y sándwiches.

- Menús de demostración ampliados a 12 opciones por restaurante, con filtros para especialidades, complementos, postres y bebidas; los precios siguen siendo simulados y los datos nutricionales no están verificados.

- Tarjetas del carrusel simplificadas a imagen, nombre y descripción; toda la tarjeta abre el menú del restaurante.

- Restaurantes de referencia McDonald's, Subway y KFC en carrusel móvil con imágenes locales, navegación por flechas, teclado y deslizamiento; menús y datos operativos señalados como demo, sin información nutricional verificada.

- Directorio móvil con tarjetas por restaurante, vista previa de platillos con precios, acceso a sus detalles y botón para abrir el menú completo; estado vacío para búsquedas sin resultados.

- Cachés de desarrollo y compilación del consumidor separadas para evitar conflictos al ejecutar `next build` mientras está activo `next dev`.

- Vista del consumidor adaptada para lectura móvil: tipografía ampliada, tarjetas con más espacio y nombres de platillos sin truncar en el directorio.
- Controles táctiles de al menos 44 px, navegación inferior con espacio para el área segura del dispositivo y fondo decorativo más tenue.
- Zoom del navegador habilitado y foco de teclado visible en la vista del consumidor.

### Added

- Estructura base inicial del monorepo (`apps`, `packages`, `docs`, `infrastructure`, `scripts`, `.github`).
- Documentación inicial del sistema y especificaciones de requerimientos en `docs/`.
- Plantillas de issues y flujos de GitHub Actions.
