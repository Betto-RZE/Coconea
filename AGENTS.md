# AGENTS.md — Coconea

> Instrucciones para agentes de IA y asistentes de programación que trabajen en este repositorio.

## 1. Identidad y objetivo

**Coconea** es una plataforma web responsiva de pedidos de alimentos, diseñada como proyecto de portafolio. Su característica distintiva es permitir programaciones recurrentes de comida, tanto de selección fija como de recomendaciones basadas en preferencias y restricciones alimenticias.

**Lema:** «Coconea — Planifica tu alimentación, confirma y recibe.»

Prioridades, en este orden:

1. Respetar las reglas de negocio y la seguridad.
2. Mantener el proyecto ejecutable y demostrable.
3. No introducir costos obligatorios: presupuesto objetivo **$0 MXN**.
4. Favorecer código claro, mantenible, comprobable y documentado.
5. Evitar complejidad, servicios y funcionalidades fuera del MVP.

Usar exclusivamente el nombre **Coconea**; no utilizar nombres anteriores del proyecto.

## 2. Fuentes de verdad y precedencia

Antes de implementar una funcionalidad, consultar los documentos relevantes de `docs/`:

| Documento | Tema |
| --- | --- |
| `01-descripcion-general.md` | Producto y contexto |
| `02-objetivos-y-alcance.md` | MVP y exclusiones |
| `03-actores-y-roles.md` | Actores y roles |
| `04-requerimientos-funcionales.md` | Requerimientos RF |
| `05-requerimientos-no-funcionales.md` | Requerimientos no funcionales |
| `06-casos-de-uso.md` | Casos de uso CU |
| `07-flujos-de-usuario.md` | Flujos de interfaz |
| `08-reglas-de-negocio.md` | Reglas RN |
| `09-modelo-de-datos.md` | Entidades, relaciones y estados |
| `10-arquitectura.md` | Límites y arquitectura modular |
| `11-api.md` | Contratos REST |
| `12-seguridad.md` | Controles de seguridad |
| `13-stack-tecnologico.md` | Stack aprobado y modalidades de ejecución |

**Orden de precedencia:** instrucciones explícitas actuales del propietario del proyecto; reglas de seguridad y negocio documentadas; contratos y arquitectura documentados; convenciones existentes del código; preferencias de implementación del agente. Si dos documentos se contradicen, **no resolver silenciosamente**: identificar la discrepancia, proponer la corrección mínima y solicitar confirmación si afecta comportamiento, datos, seguridad o alcance.

No modificar el alcance, las reglas de negocio o el stack aprobado sin autorización. Mantener documentación y código sincronizados.

## 3. Stack tecnológico aprobado

- **Lenguaje:** TypeScript, Node.js LTS compatible.
- **Monorepo:** pnpm Workspaces y Turborepo.
- **Aplicaciones web:** Next.js + React, responsivas; Tailwind CSS y shadcn/ui.
- **Formularios y validación:** React Hook Form y Zod.
- **Datos del servidor y estado local:** TanStack Query y Zustand, cuando se necesite.
- **Backend:** NestJS, API REST JSON versionada bajo `/v1`.
- **Base de datos:** PostgreSQL.
- **ORM y migraciones:** Drizzle ORM.
- **Autenticación:** Better Auth, integrado con NestJS, PostgreSQL y Drizzle.
- **Autorización:** RBAC y comprobación de propiedad de cada recurso.
- **Trabajos asíncronos y programados:** pg-boss con PostgreSQL.
- **Notificaciones MVP:** centro interno persistente; Web Push queda para el futuro.
- **Pagos MVP:** proveedor simulado propio (`MockPaymentProvider`), sin cobros reales.
- **Pruebas:** Vitest, Supertest y Playwright.
- **Desarrollo local:** Docker Compose y herramientas gratuitas.
- **CI/CD:** GitHub Actions dentro de las cuotas gratuitas aplicables.
- **Registros:** Pino; métricas y alertas básicas sin servicios de pago.
- **Demo pública:** exportación estática compatible con Cloudflare Pages.

No incorporar Redis, BullMQ, React Native, Flutter, microservicios, Kubernetes, pagos reales, servicios comerciales obligatorios o IA generativa como requisito del MVP. No agregar dependencias por conveniencia sin justificar su necesidad y compatibilidad. Fijar versiones compatibles al configurar el proyecto y respetar el lockfile.

## 4. Organización del repositorio

Mantener las cinco aplicaciones previstas:

```text
apps/
  customer/       # Web del consumidor
  restaurant/     # Panel web del restaurante
  delivery/       # Web del repartidor
  admin/          # Panel web administrativo
  api/            # API NestJS y lógica de negocio
packages/
  shared/         # Utilidades comunes independientes del entorno
  types/          # Tipos y contratos compartidos
  validation/     # Esquemas de validación compartidos
  config/         # Configuración compartida
infrastructure/   # Infraestructura local y despliegue
docs/             # Documentación funcional y técnica
scripts/          # Scripts de mantenimiento
.github/          # CI y convenciones de colaboración
```

Se pueden crear paquetes o carpetas adicionales **solo si aportan una separación real**. Un worker puede ejecutarse como proceso independiente reutilizando el código de `apps/api`; no crear un microservicio por cada módulo. No reorganizar ni borrar carpetas existentes sin necesidad y autorización.

### Dependencias y límites

- Los frontends consumen la API mediante contratos públicos; **nunca** importan código del ORM, repositorios de datos, secretos ni lógica privada del backend.
- Los paquetes compartidos no dependen de las aplicaciones.
- Evitar dependencias circulares.
- Compartir tipos y validaciones útiles, no acoplar entidades de base de datos a las interfaces.
- Mantener módulos de negocio separados dentro de NestJS: identidad, autorización, cliente, perfil alimenticio, restaurante, catálogo, cobertura, carrito, programación, recomendación, propuesta, pedido, pago, entrega, notificación, incidencias, administración, auditoría e idempotencia.
- Separar dominio, aplicación, infraestructura y transporte cuando la complejidad lo justifique.

## 5. Reglas de negocio innegociables

1. **Programar no es comprar.** Una programación genera una ocurrencia y una propuesta; nunca crea por sí sola un pedido ni un cargo.
2. **Confirmación explícita.** Solo una confirmación autenticada, válida y vigente del consumidor puede iniciar la creación de un pedido asociado a una propuesta.
3. **Sin confirmación, no hay compra ni cargo.** Rechazo y expiración impiden procesar la propuesta.
4. **Revalidación.** Antes de confirmar, verificar productos, cantidades, precio, comisiones, dirección, horario, cobertura, disponibilidad y restricciones pertinentes. Cambios materiales requieren nueva aceptación.
5. **Idempotencia y concurrencia.** Solicitudes repetidas, trabajos reintentados y confirmaciones simultáneas no deben generar pedidos ni pagos duplicados. Protegerlo con transacciones y restricciones de PostgreSQL, no solo con controles visuales.
6. **Dos modalidades recurrentes:** `FIXED` y `RECOMMENDATION`. Las recomendaciones del MVP usan reglas deterministas, no IA.
7. **Restricciones alimenticias.** La falta de información de ingredientes o alérgenos **no significa que un producto sea seguro**. No ofrecer garantías médicas ni de ausencia de contaminación cruzada.
8. **Pedido por restaurante.** Respetar el alcance de un restaurante por pedido.
9. **Estados controlados.** Aplicar las transiciones documentadas de propuestas, pedidos, pagos y entregas; los estados de pago y entrega no se infieren del estado del pedido.
10. **Pagos simulados.** No solicitar tarjetas reales, PAN, CVV ni dinero. Representar aprobación, rechazo, incertidumbre, conciliación y reembolso de manera coherente.
11. **Notificaciones no autorizan compras.** Abrir una notificación o marcarla como leída nunca equivale a confirmar una propuesta.
12. **Administrador no compra por el usuario.** Los permisos administrativos no sustituyen la autorización del consumidor.
13. **Tiempos y recurrencia.** Conservar zona horaria IANA, hora local y política para cambios de horario; recuperar ocurrencias pendientes tras fallos.
14. **Auditoría.** Registrar cambios y operaciones críticas sin incluir secretos ni datos sensibles innecesarios.

Los valores de expiración, reintentos y otras políticas configurables se toman de los documentos y la configuración; no convertir ejemplos o sugerencias en reglas fijas sin validación.

## 6. Identidad, sesiones y seguridad

Roles humanos autorizados: `USER`, `RESTAURANT`, `DELIVERY`, `ADMIN`. `SYSTEM` identifica procesos automáticos, no un quinto rol humano.

- El registro público corresponde a consumidores; altas y habilitaciones de restaurantes, repartidores y administradores siguen flujos controlados.
- Usar Better Auth para identidad y sesiones; NestJS debe validar la sesión y aplicar autorización por rol **y por propiedad del recurso**.
- Denegar acceso por defecto. Nunca confiar en `userId`, `restaurantId`, roles o importes proporcionados por el cliente sin verificarlos.
- Proteger operaciones sensibles frente a IDOR/BOLA, inyección, CSRF según el mecanismo de sesión, XSS y abuso de endpoints.
- Usar cookies seguras cuando corresponda; aplicar TLS en entornos públicos y controles de sesión y recuperación adecuados.
- Preparar autenticación reforzada para administración conforme a `12-seguridad.md`.
- Validar entradas en el servidor, aunque ya se validen con Zod en la interfaz.
- Mantener secretos en variables de entorno o mecanismos seguros; nunca incluirlos en Git, logs, respuestas HTTP ni la demo.
- No almacenar datos bancarios reales ni información alimenticia sensible innecesaria.
- Evitar mostrar trazas internas o detalles de infraestructura a usuarios finales.

## 7. Persistencia, API y procesamiento

- PostgreSQL es la **fuente de verdad**; Drizzle define esquemas y migraciones versionadas.
- No editar manualmente una base de datos compartida ni ejecutar migraciones destructivas sin aprobación y respaldo.
- Mantener claves foráneas, restricciones únicas, índices y transacciones para operaciones críticas.
- Seguir el contrato de `docs/11-api.md`: rutas `/v1`, JSON, identificadores opacos, fechas ISO, zonas IANA, importes decimales representados como cadenas cuando corresponda, errores estructurados e idempotencia.
- No usar `float` de JavaScript como fuente de verdad para dinero.
- pg-boss ejecuta trabajos en segundo plano; **no garantiza por sí solo efectos de negocio exactamente una vez**.
- Implementar deduplicación, reintentos seguros, conciliación y, cuando corresponda, patrón outbox.
- Los webhooks reales y servicios de pagos reales quedan fuera del MVP; mantener interfaces de integración desacopladas.

## 8. Dos modalidades: sistema local y demo pública

### Sistema completo local

Debe poder ejecutar las cuatro aplicaciones web, NestJS, PostgreSQL, Better Auth, Drizzle, pg-boss, notificaciones internas y simulador de pagos. Proporcionar instrucciones reproducibles de instalación, variables de entorno de ejemplo, migraciones, datos semilla y comandos de inicio.

### Demo pública estática

Se publicará en Cloudflare Pages usando una exportación estática compatible de Next.js. Debe funcionar **sin API NestJS, sin PostgreSQL, sin Better Auth real y sin worker permanente**.

- Utilizar datos ficticios y adaptadores de demostración explícitos.
- No presentar cuentas ficticias como autenticación real ni estados simulados como transacciones reales.
- Evitar rutas, renderizado o funcionalidades de Next.js que requieran servidor en el modo exportado.
- No exponer secretos ni datos reales en los archivos generados.
- Conservar, en lo posible, las mismas interfaces y contratos para reducir duplicación.
- No prometer persistencia entre navegadores, dispositivos o sesiones si no existe.
- Documentar las diferencias entre la demo y el sistema local.

**Restricción económica:** no contratar servicios, habilitar planes de pago, introducir APIs facturables ni requerir tarjeta bancaria sin autorización expresa. Las cuotas gratuitas pueden cambiar; no prometer disponibilidad permanente ilimitada.

## 9. Convenciones de código

- Preferir TypeScript estricto y tipos explícitos en contratos públicos; evitar `any` salvo justificación puntual.
- Usar nombres descriptivos y consistentes; seguir las convenciones del framework y del repositorio.
- Mantener funciones pequeñas, con responsabilidad clara; evitar abstracciones prematuras.
- No duplicar lógica de negocio entre frontend y backend; el backend es autoridad para permisos, importes y estados.
- Centralizar manejo de errores y validación.
- Usar consultas parametrizadas y APIs seguras del ORM.
- Incorporar accesibilidad, estados de carga, errores, formularios utilizables y diseño responsivo.
- No añadir dependencias, scripts o configuraciones no solicitados que aumenten complejidad o costos.
- No generar código de relleno, endpoints ficticios presentados como completos ni comentarios que prometan garantías inexistentes.

## 10. Pruebas y calidad

Herramientas aprobadas:

- **Vitest:** lógica, validaciones y pruebas unitarias.
- **Supertest:** pruebas HTTP de NestJS.
- **Playwright:** recorridos E2E y responsividad de las cuatro webs.
- **PostgreSQL aislado:** integración de Drizzle, migraciones y concurrencia.

Pruebas prioritarias:

1. Aislamiento por usuario, restaurante y repartidor.
2. Acceso por rol y propiedad.
3. Recomendaciones y exclusión de restricciones incompatibles o información insuficiente.
4. Creación única de ocurrencias y propuestas.
5. Confirmación explícita, rechazo y expiración.
6. Cambios de cotización y necesidad de reconfirmación.
7. Confirmaciones simultáneas, reintentos y ausencia de duplicados.
8. Estados del pedido y asignaciones de entrega.
9. Pagos simulados aprobados, rechazados e inciertos; conciliación y reembolsos.
10. Diferencias de comportamiento entre sistema local y demo estática.

Antes de declarar una tarea terminada, ejecutar las comprobaciones pertinentes de formato, lint, tipos, pruebas y compilación. Si no se pueden ejecutar, **informar exactamente cuáles quedaron sin verificar y por qué**. Nunca afirmar que algo funciona sin haberlo comprobado.

## 11. Git, CI/CD y cambios

- Respetar `README.md`, `CONTRIBUTING.md`, `.editorconfig` y la configuración existente.
- Mantener cambios pequeños y relacionados con la tarea.
- No borrar trabajo previo ni sobrescribir cambios ajenos.
- No alterar archivos de configuración, lockfiles o migraciones sin necesidad.
- No crear commits, ramas, pull requests, despliegues ni modificar secretos sin instrucción explícita.
- Usar GitHub Actions para validaciones compatibles con el presupuesto gratuito.
- Antes de finalizar, resumir archivos modificados, comportamiento implementado, pruebas ejecutadas y limitaciones pendientes.

## 12. Forma de trabajar del agente

Para cada solicitud de desarrollo:

1. **Comprender:** identificar el objetivo y los documentos RF, RN y CU relevantes.
2. **Inspeccionar:** revisar la estructura y el código existente antes de proponer cambios.
3. **Planificar:** escoger la solución más sencilla que cumpla los requisitos; preguntar solo cuando una decisión importante no esté definida.
4. **Implementar:** mantener límites de módulos, contratos y seguridad.
5. **Verificar:** ejecutar pruebas y comprobaciones disponibles.
6. **Documentar:** actualizar documentación o ejemplos cuando cambie el comportamiento.
7. **Entregar:** explicar brevemente qué cambió, cómo probarlo y qué falta.

Si una solicitud contradice una regla crítica de negocio, de seguridad o el presupuesto de $0, señalarlo antes de implementar y proponer una alternativa compatible.

## 13. Criterios de finalización

Una tarea se considera completada cuando:

- Cumple el requerimiento solicitado sin ampliar el alcance injustificadamente.
- Respeta la arquitectura y el stack aprobado.
- No introduce gastos obligatorios.
- Mantiene autenticación, autorización e integridad según corresponda.
- Incluye pruebas razonables o deja documentada la imposibilidad de ejecutarlas.
- No rompe el sistema local ni el modo demo aplicable.
- Actualiza los contratos y documentos afectados.
- Explica los pasos para reproducir o verificar el resultado.

---

**Coconea — Planifica tu alimentación, confirma y recibe.**
