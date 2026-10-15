# 13. Stack Tecnológico — Coconea

**Proyecto:** Coconea  
**Versión:** 1.0  
**Estado:** Aprobado  
**Tipo de proyecto:** Portafolio de desarrollo de software  
**Presupuesto objetivo:** $0 MXN  
**Arquitectura:** Monorepo con backend monolítico modular

---

## 1. Introducción

Este documento establece las tecnologías que se utilizarán para desarrollar Coconea, una plataforma web de entrega de alimentos que permite realizar pedidos convencionales y programar propuestas recurrentes de comida según las preferencias y restricciones alimenticias de los usuarios.

La selección tecnológica se realizó considerando los requerimientos funcionales y no funcionales, los casos de uso, las reglas de negocio, el modelo de datos, la arquitectura, la API y los controles de seguridad definidos en los documentos anteriores.

El objetivo es construir un sistema funcional, mantenible, escalable y adecuado para un portafolio profesional, utilizando herramientas gratuitas y evitando servicios de pago obligatorios.

Coconea tendrá dos modalidades de ejecución:

- **Sistema completo local:** todas las aplicaciones, la API, la base de datos y los procesos programados funcionarán en un entorno de desarrollo local.
- **Demostración pública:** versión web estática alojada gratuitamente, con datos ficticios y simulaciones de los procesos principales.

La demostración pública no procesará pagos reales ni dependerá de infraestructura comercial.

---

## 2. Principios de selección tecnológica

El desarrollo seguirá los siguientes principios:

1. Priorizar tecnologías gratuitas y de código abierto.
2. Utilizar TypeScript como lenguaje principal.
3. Compartir código mediante un Monorepo.
4. Evitar microservicios innecesarios.
5. Mantener PostgreSQL como fuente principal de información.
6. Garantizar la seguridad e integridad de las operaciones.
7. Separar las reglas de negocio de las integraciones externas.
8. Facilitar pruebas automatizadas.
9. Mantener una estructura clara y documentada.
10. Permitir futuras ampliaciones sin reconstruir todo el sistema.

---

## 3. Stack tecnológico definitivo

| Área | Tecnología seleccionada |
|---|---|
| Lenguaje principal | TypeScript |
| Runtime del backend | Node.js LTS compatible |
| Administrador de paquetes | pnpm |
| Administración del Monorepo | pnpm Workspaces + Turborepo |
| Frontend | Next.js + React |
| Estilos | Tailwind CSS |
| Componentes visuales | shadcn/ui |
| Formularios | React Hook Form |
| Validaciones | Zod |
| Consultas y caché | TanStack Query |
| Estado local | Zustand |
| Backend | NestJS |
| Arquitectura backend | Monolito modular |
| API | REST con JSON |
| Documentación API | OpenAPI |
| Base de datos | PostgreSQL |
| ORM | Drizzle ORM |
| Autenticación | Better Auth |
| Autorización | RBAC + propiedad de recursos |
| Trabajos programados | pg-boss |
| Notificaciones | Sistema interno persistente |
| Pagos | Simulador propio |
| Pruebas unitarias | Vitest |
| Pruebas de API | Supertest |
| Pruebas E2E | Playwright |
| Contenedores locales | Docker Compose |
| CI/CD | GitHub Actions |
| Registros | Pino |
| Observabilidad | Métricas y registros básicos |
| Hosting de demostración | Cloudflare Pages |
| Control de versiones | Git + GitHub |

Las versiones específicas se fijarán al configurar el proyecto, seleccionando versiones estables compatibles entre sí.

---

## 4. Arquitectura del Monorepo

Coconea utilizará un único repositorio para organizar las aplicaciones, los paquetes compartidos, la infraestructura y la documentación.

### 4.1. Estructura

```text
coconea/
├── apps/
│   ├── customer/
│   ├── restaurant/
│   ├── delivery/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── shared/
│   ├── types/
│   ├── validation/
│   └── config/
│
├── docs/
│   ├── 01-descripcion-general.md
│   ├── 02-objetivos-y-alcance.md
│   ├── 03-actores-y-roles.md
│   ├── 04-requerimientos-funcionales.md
│   ├── 05-requerimientos-no-funcionales.md
│   ├── 06-casos-de-uso.md
│   ├── 07-flujos-de-usuario.md
│   ├── 08-reglas-de-negocio.md
│   ├── 09-modelo-de-datos.md
│   ├── 10-arquitectura.md
│   ├── 11-api.md
│   ├── 12-seguridad.md
│   └── 13-stack-tecnologico.md
│
├── infrastructure/
├── scripts/
├── .github/
│   └── workflows/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

Los archivos de configuración se incorporarán conforme avance la implementación.

### 4.2. Administración

**pnpm Workspaces** administrará las dependencias y los paquetes internos.

**Turborepo** coordinará las tareas de desarrollo, compilación, validación y pruebas.

Las aplicaciones podrán compartir tipos, esquemas de validación y utilidades sin duplicar implementaciones.

---

## 5. Aplicaciones web

Las cuatro aplicaciones utilizarán Next.js, React y TypeScript.

Todas serán responsivas y accesibles desde navegadores modernos.

### 5.1. Customer

**Ruta:** `apps/customer/`

Aplicación dirigida a consumidores.

Funciones principales:

- Registro e inicio de sesión.
- Administración del perfil.
- Preferencias y restricciones alimenticias.
- Exploración de restaurantes.
- Consulta de productos.
- Carrito de compras.
- Pedidos convencionales.
- Programaciones recurrentes.
- Confirmación o rechazo de propuestas.
- Seguimiento de pedidos.
- Notificaciones e historial.

La interfaz estará optimizada principalmente para dispositivos móviles, pero también funcionará en tablets y computadoras.

### 5.2. Restaurant

**Ruta:** `apps/restaurant/`

Panel de administración para restaurantes.

Funciones principales:

- Administración del establecimiento.
- Gestión del catálogo.
- Declaración de ingredientes y alérgenos.
- Actualización de precios.
- Disponibilidad de productos.
- Recepción de pedidos.
- Aceptación o rechazo de pedidos.
- Control de preparación.
- Confirmación de pedidos listos para recolección.

Su interfaz estará optimizada para computadoras y tablets.

### 5.3. Delivery

**Ruta:** `apps/delivery/`

Aplicación web para repartidores.

Funciones principales:

- Inicio de sesión.
- Consulta de entregas asignadas.
- Información de recolección.
- Confirmación de recolección.
- Actualización del estado de entrega.
- Confirmación de entrega.
- Reporte de incidencias.
- Historial de entregas.

Estará diseñada principalmente para pantallas de celular.

El MVP no incluirá seguimiento GPS continuo.

### 5.4. Admin

**Ruta:** `apps/admin/`

Panel de administración general.

Funciones principales:

- Gestión de usuarios.
- Gestión de restaurantes.
- Gestión de repartidores.
- Supervisión de pedidos.
- Gestión de entregas.
- Atención de incidencias.
- Consulta de métricas.
- Auditoría de operaciones.

El acceso estará protegido mediante autenticación y permisos administrativos.

---

## 6. Desarrollo de interfaces

### 6.1. Tailwind CSS

Se utilizará Tailwind CSS para crear estilos responsivos y mantener consistencia visual.

### 6.2. shadcn/ui

Se utilizarán componentes de shadcn/ui compatibles con las versiones seleccionadas de React y Next.js.

Se podrán adaptar a la identidad visual de Coconea.

### 6.3. React Hook Form

Administrará los formularios de registro, perfiles, restaurantes, productos y programaciones.

### 6.4. Zod

Definirá esquemas de validación reutilizables.

Las validaciones del frontend mejorarán la experiencia del usuario, pero la API será responsable de aplicar las validaciones definitivas.

### 6.5. TanStack Query

Administrará:

- Consultas a la API.
- Caché de datos.
- Actualizaciones.
- Mutaciones.
- Estados de carga.
- Reintentos apropiados.

### 6.6. Zustand

Se utilizará para el estado local compartido que no corresponda a la caché del servidor.

No se almacenará información sensible innecesariamente en el navegador.

---

## 7. Backend

**Ruta:** `apps/api/`

El backend utilizará NestJS sobre Node.js.

### 7.1. Arquitectura

Se implementará un monolito modular, manteniendo separadas las responsabilidades de cada dominio.

Módulos principales:

```text
identity/
authorization/
customer/
food-profile/
restaurant/
catalog/
coverage/
cart/
scheduling/
recommendation/
proposal/
order/
payment/
delivery/
notification/
incident/
administration/
audit/
idempotency/
```

Cada módulo podrá organizar su lógica mediante capas de dominio, aplicación, infraestructura y presentación.

### 7.2. API REST

La API utilizará:

- HTTP y HTTPS según el entorno.
- JSON.
- Rutas versionadas bajo `/v1`.
- Códigos HTTP apropiados.
- Validación de solicitudes.
- Manejo estructurado de errores.
- Autenticación.
- Autorización.
- Idempotencia.
- Documentación OpenAPI.

Las aplicaciones web consumirán los servicios de NestJS.

---

## 8. Base de datos

Se utilizará PostgreSQL como sistema de gestión de bases de datos relacional.

### 8.1. Responsabilidades

PostgreSQL almacenará:

- Usuarios y sesiones.
- Perfiles alimenticios.
- Restaurantes.
- Productos.
- Ingredientes.
- Direcciones.
- Carritos.
- Programaciones.
- Ocurrencias.
- Propuestas.
- Pedidos.
- Pagos simulados.
- Entregas.
- Notificaciones.
- Incidencias.
- Auditoría.
- Registros de idempotencia.

### 8.2. Integridad

Se implementarán:

- Claves primarias.
- Claves foráneas.
- Restricciones únicas.
- Índices.
- Transacciones.
- Control de concurrencia.
- Migraciones.
- Validaciones de integridad.

PostgreSQL será la fuente de verdad de las operaciones del sistema.

---

## 9. ORM

Se utilizará **Drizzle ORM**.

### 9.1. Funciones

- Definición de esquemas mediante TypeScript.
- Consultas tipadas.
- Integración con PostgreSQL.
- Administración de migraciones.
- Transacciones.
- Consultas SQL cuando sean necesarias.

### 9.2. Organización

Los esquemas y el acceso a datos se mantendrán dentro de la infraestructura del backend.

Los paquetes compartidos del frontend no tendrán acceso directo a la base de datos.

Las migraciones se versionarán en Git.

---

## 10. Autenticación

Se utilizará **Better Auth**.

### 10.1. Funcionalidades

- Registro de consumidores.
- Inicio de sesión.
- Cierre de sesión.
- Administración de sesiones.
- Recuperación de acceso.
- Protección de credenciales.
- Revocación de sesiones.

Las cuentas de restaurantes, repartidores y administradores se habilitarán mediante los procedimientos controlados establecidos en las reglas de negocio.

### 10.2. Integración

Better Auth se integrará con PostgreSQL y Drizzle.

NestJS validará las identidades y aplicará los controles de autorización correspondientes.

### 10.3. Autorización

Se utilizarán los roles:

- `USER`
- `RESTAURANT`
- `DELIVERY`
- `ADMIN`

El sistema verificará tanto el rol como la propiedad del recurso.

Los usuarios no podrán acceder a información privada de otros usuarios ni realizar operaciones ajenas a sus permisos.

---

## 11. Procesos programados

Se utilizará **pg-boss** junto con PostgreSQL.

### 11.1. Funciones

- Detección de ocurrencias programadas.
- Generación de propuestas.
- Expiración de propuestas.
- Procesamiento de notificaciones.
- Reintentos de trabajos.
- Conciliación de pagos simulados.
- Recuperación de tareas pendientes.

### 11.2. Worker

Los procesos programados se ejecutarán mediante un worker independiente del servidor HTTP, compartiendo los módulos necesarios del backend.

### 11.3. Confiabilidad

Se aplicarán:

- Restricciones de unicidad.
- Transacciones.
- Idempotencia.
- Control de concurrencia.
- Reintentos controlados.
- Registro de errores.

La cola de trabajos no sustituirá las validaciones de negocio.

### 11.4. Regla fundamental

Una programación recurrente generará una propuesta.

**Nunca generará automáticamente un pedido ni un pago.**

El pedido solamente podrá crearse después de una confirmación válida y explícita del usuario.

---

## 12. Sistema de recomendaciones

El MVP utilizará un motor de recomendaciones basado en reglas.

Considerará:

- Preferencias alimenticias.
- Restricciones declaradas.
- Ingredientes y alérgenos.
- Disponibilidad.
- Horarios.
- Cobertura.
- Configuración de la programación.

Los productos con información insuficiente sobre restricciones relevantes no se considerarán automáticamente seguros.

No se utilizarán modelos de inteligencia artificial en el MVP.

---

## 13. Sistema de notificaciones

Se implementará un centro de notificaciones interno.

### 13.1. Tecnologías

- NestJS.
- PostgreSQL.
- pg-boss.
- Next.js.
- TanStack Query.

### 13.2. Funcionalidades

- Crear notificaciones.
- Consultar notificaciones.
- Marcar como leídas.
- Consultar historial.
- Mostrar notificaciones pendientes.
- Actualizar la información periódicamente.

### 13.3. Eventos principales

- Nueva propuesta.
- Propuesta próxima a expirar.
- Propuesta expirada.
- Pedido confirmado.
- Pedido aceptado.
- Pedido en preparación.
- Pedido listo.
- Pedido recogido.
- Pedido en tránsito.
- Pedido entregado.
- Incidencia registrada.

Las notificaciones no constituirán autorización para comprar.

### 13.4. Mejoras futuras

Web Push podrá incorporarse posteriormente sin sustituir el centro de notificaciones interno.

---

## 14. Simulador de pagos

El MVP no procesará dinero real.

Se desarrollará un módulo de simulación de pagos integrado en NestJS.

### 14.1. Estados simulados

El simulador permitirá representar:

- Pago pendiente.
- Pago autorizado.
- Pago capturado.
- Pago rechazado.
- Pago cancelado.
- Pago reembolsado.
- Reembolso parcial.

Los estados definitivos deberán mantenerse consistentes con el modelo de datos.

### 14.2. Funciones

- Simular pagos aprobados.
- Simular rechazos.
- Simular resultados inciertos.
- Simular conciliación.
- Simular reembolsos.
- Verificar idempotencia.

### 14.3. Arquitectura

La integración se diseñará mediante una interfaz de proveedor de pagos.

La implementación inicial será `MockPaymentProvider`.

En el futuro podrá sustituirse o complementarse con una integración real sin modificar las reglas principales de negocio.

### 14.4. Seguridad

No se solicitarán números de tarjetas reales, códigos CVV ni información bancaria.

Todos los movimientos serán ficticios.

---

## 15. Pruebas automatizadas

Se utilizarán herramientas gratuitas.

### 15.1. Vitest

Pruebas unitarias para:

- Reglas de negocio.
- Validaciones.
- Recomendaciones.
- Cálculos.
- Estados.
- Servicios.

### 15.2. Supertest

Pruebas de integración HTTP para:

- Endpoints.
- Autenticación.
- Autorización.
- Validación.
- Respuestas.
- Errores.

### 15.3. Playwright

Pruebas de extremo a extremo para:

- Customer.
- Restaurant.
- Delivery.
- Admin.
- Navegación.
- Formularios.
- Flujos de pedidos.
- Programaciones.
- Diseño responsivo.

### 15.4. Pruebas de base de datos

Se utilizará una base de datos PostgreSQL aislada para las pruebas de integración.

### 15.5. Casos críticos

Se verificará especialmente:

1. Confirmación única de propuestas.
2. Ausencia de pedidos duplicados.
3. Expiración de propuestas.
4. Revalidación de cotizaciones.
5. Rechazo de operaciones no autorizadas.
6. Restricciones alimenticias.
7. Transiciones de estado.
8. Asignación de entregas.
9. Pagos simulados.
10. Reintentos y recuperación de trabajos.

---

## 16. Desarrollo local

Se utilizará Docker Compose para ejecutar los servicios de infraestructura.

### 16.1. Servicios principales

- PostgreSQL.
- API NestJS.
- Worker de pg-boss.
- Aplicaciones Next.js.

Durante el desarrollo, las aplicaciones y la API podrán ejecutarse directamente con Node.js mientras PostgreSQL funciona en Docker.

### 16.2. Requisitos

- Node.js compatible.
- pnpm.
- Git.
- Docker y Docker Compose.
- Editor de código.
- Navegador moderno.

### 16.3. Configuración

Las variables de entorno se documentarán mediante archivos de ejemplo.

No se almacenarán contraseñas reales ni secretos en el repositorio.

---

## 17. CI/CD

Se utilizará GitHub Actions.

### 17.1. Flujo de integración continua

Cada cambio relevante podrá ejecutar:

1. Instalación de dependencias.
2. Validación de formato.
3. ESLint.
4. Comprobación de TypeScript.
5. Pruebas unitarias.
6. Pruebas de integración.
7. Compilación.
8. Verificación del resultado.

### 17.2. Despliegue

La demostración pública podrá publicarse automáticamente después de superar las validaciones correspondientes.

Se utilizarán únicamente funciones disponibles dentro de los límites gratuitos aplicables.

---

## 18. Observabilidad

Se utilizará **Pino** para generar registros estructurados.

### 18.1. Información registrada

- Solicitudes HTTP.
- Errores.
- Trabajos programados.
- Eventos relevantes.
- Resultados de operaciones.
- Identificadores de correlación.

### 18.2. Métricas básicas

- Pedidos generados.
- Propuestas confirmadas.
- Propuestas rechazadas.
- Propuestas expiradas.
- Trabajos fallidos.
- Pagos simulados.
- Incidencias.

### 18.3. Seguridad

Los registros no deberán contener contraseñas, tokens de sesión ni información sensible innecesaria.

La auditoría de negocio se almacenará independientemente de los registros técnicos.

---

## 19. Demostración pública

La demo de Coconea se alojará en **Cloudflare Pages**, utilizando su modalidad gratuita.

### 19.1. Objetivo

Permitir que cualquier persona interesada en el portafolio pueda explorar las principales funcionalidades del proyecto desde un navegador.

### 19.2. Características

- Cuatro interfaces responsivas.
- Datos ficticios.
- Restaurantes de ejemplo.
- Productos de ejemplo.
- Usuarios de demostración.
- Pedidos simulados.
- Programaciones demostrativas.
- Propuestas simuladas.
- Notificaciones internas demostrativas.
- Estados de entrega simulados.

### 19.3. Implementación

Las aplicaciones Next.js dispondrán de un modo de demostración compatible con exportación estática.

Este modo utilizará adaptadores de datos de demostración en lugar de depender de la API local.

Las operaciones que requieran ejecución de servidor serán simuladas en el navegador o mediante datos preparados.

### 19.4. Limitaciones

La demostración pública no contará con:

- Pagos reales.
- Base de datos de producción.
- Autenticación real persistente.
- Worker permanente.
- Notificaciones Web Push.
- Entregas comerciales.

Las diferencias entre demostración y sistema completo deberán comunicarse claramente.

---

## 20. Sistema completo local

El sistema completo podrá ejecutarse en una computadora de desarrollo.

Incluye:

- Cuatro aplicaciones Next.js.
- API NestJS.
- PostgreSQL.
- Drizzle ORM.
- Better Auth.
- pg-boss.
- Motor de recomendaciones.
- Simulador de pagos.
- Notificaciones internas.
- Auditoría.
- Pruebas automatizadas.

La versión local permitirá comprobar las reglas de negocio, persistencia, concurrencia y procesamiento programado que no estarán disponibles en la demo estática.

---

## 21. Costos

El proyecto utilizará herramientas sin costos de licencia obligatorios.

| Concepto | Costo objetivo |
|---|---|
| Lenguaje y frameworks | $0 MXN |
| Monorepo | $0 MXN |
| PostgreSQL local | $0 MXN |
| Drizzle ORM | $0 MXN |
| Better Auth | $0 MXN |
| pg-boss | $0 MXN |
| Simulador de pagos | $0 MXN |
| Notificaciones internas | $0 MXN |
| Testing | $0 MXN |
| Git y GitHub | $0 MXN |
| Docker Compose | $0 MXN |
| Cloudflare Pages | $0 MXN dentro de sus límites gratuitos |

No se contratarán servicios de pago obligatorios.

Los costos de electricidad, conexión a internet y equipo de desarrollo no forman parte de esta estimación.

Los límites de los planes gratuitos deberán revisarse antes de publicar la demostración.

---

## 22. Tecnologías fuera del alcance del MVP

No se utilizarán inicialmente:

- Aplicaciones móviles nativas.
- React Native.
- Flutter.
- Redis.
- BullMQ.
- Kubernetes.
- Microservicios.
- Inteligencia artificial generativa.
- GPS en tiempo real.
- Optimización avanzada de rutas.
- Pagos reales.
- Suscripciones comerciales.
- Web Push.
- Servicios de observabilidad de pago.

Estas capacidades podrán evaluarse posteriormente si el proyecto evoluciona.

---

## 23. Orden de implementación

El desarrollo se organizará en las siguientes etapas:

**Etapa 1. Configuración del Monorepo**

Preparación de pnpm, Turborepo, TypeScript y estructura inicial.

**Etapa 2. Aplicaciones base**

Creación de Customer, Restaurant, Delivery, Admin y API.

**Etapa 3. Persistencia**

Configuración de PostgreSQL, Drizzle y migraciones.

**Etapa 4. Autenticación y autorización**

Integración de Better Auth y control de roles.

**Etapa 5. Catálogo y perfiles**

Restaurantes, productos, ingredientes, preferencias y restricciones.

**Etapa 6. Pedidos convencionales**

Carrito, cotizaciones, pedidos y simulador de pagos.

**Etapa 7. Operación de restaurantes y repartidores**

Preparación, asignaciones y entregas.

**Etapa 8. Programaciones recurrentes**

pg-boss, ocurrencias, propuestas y confirmaciones.

**Etapa 9. Notificaciones y administración**

Centro de notificaciones, incidencias, auditoría y métricas.

**Etapa 10. Pruebas y demostración pública**

Testing, datos ficticios, modo demostración y publicación en Cloudflare Pages.

---

## 24. Conclusión

Coconea utilizará un stack tecnológico basado principalmente en TypeScript, Next.js, NestJS, PostgreSQL y Drizzle ORM.

El proyecto estará organizado mediante un Monorepo administrado con pnpm Workspaces y Turborepo.

Better Auth gestionará la autenticación, pg-boss permitirá ejecutar tareas programadas y el simulador de pagos representará las operaciones económicas sin utilizar dinero real.

Las cuatro aplicaciones serán web responsivas.

El sistema completo podrá ejecutarse localmente, mientras que una demostración estática gratuita permitirá presentar el proyecto públicamente.

Esta arquitectura permitirá desarrollar Coconea como un proyecto de portafolio profesional, sin costos obligatorios de licencias o infraestructura contratada y con posibilidades de evolución futura.

---

**Coconea — Planifica tu alimentación, confirma y recibe.**