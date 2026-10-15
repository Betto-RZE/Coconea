# Objetivos y Alcance del Proyecto

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación

---

## 1. Objetivo general

Diseñar y desarrollar una plataforma digital de reparto de alimentos que permita a los usuarios organizar sus preferencias y restricciones alimenticias, descubrir restaurantes compatibles y programar pedidos recurrentes mediante un sistema de notificaciones y confirmación simplificada.

La plataforma buscará reducir el tiempo y las acciones necesarias para realizar pedidos frecuentes, integrando en un mismo sistema la gestión de usuarios, restaurantes, repartidores y administradores.

## 2. Objetivos específicos

### 2.1. Gestión de usuarios

- Implementar un sistema de registro, autenticación y administración de cuentas.
- Permitir el almacenamiento de direcciones de entrega.
- Facilitar la configuración y actualización de perfiles alimenticios.
- Proporcionar acceso al historial de pedidos y programaciones.

### 2.2. Personalización alimenticia

- Permitir seleccionar categorías alimenticias como carnes, pollo, pescado, ensaladas y otras opciones.
- Registrar restricciones alimenticias e ingredientes que el usuario desea evitar.
- Facilitar la identificación de platillos compatibles con las preferencias registradas.
- Presentar recomendaciones basadas en la información proporcionada por los restaurantes.

### 2.3. Automatización de pedidos recurrentes

- Desarrollar un sistema para programar pedidos en días y horarios específicos.
- Permitir programaciones con restaurantes y platillos previamente seleccionados.
- Incorporar programaciones basadas en recomendaciones variables.
- Generar propuestas de pedidos conforme a las programaciones activas.
- Solicitar la confirmación del usuario antes de procesar cada compra.
- Permitir modificar, pausar y cancelar programaciones.

### 2.4. Sistema de notificaciones

- Implementar notificaciones para informar sobre pedidos programados.
- Permitir la confirmación rápida desde notificaciones interactivas, cuando sea compatible con el dispositivo.
- Ofrecer una pantalla de confirmación dentro de la aplicación.
- Informar sobre cambios importantes en los pedidos y entregas.

### 2.5. Gestión de restaurantes

- Permitir el registro y administración de establecimientos.
- Implementar herramientas para gestionar menús, precios e ingredientes.
- Permitir actualizar la disponibilidad de los productos.
- Facilitar la recepción, aceptación y seguimiento de pedidos.

### 2.6. Gestión de repartidores

- Implementar cuentas con permisos específicos para repartidores.
- Permitir la consulta y gestión de entregas asignadas.
- Proporcionar información necesaria para la recolección y entrega.
- Permitir actualizar los estados de las entregas.

### 2.7. Administración de la plataforma

- Desarrollar herramientas para supervisar las operaciones.
- Implementar controles de acceso basados en roles.
- Permitir la gestión de usuarios, restaurantes y repartidores.
- Facilitar el seguimiento de pedidos e incidencias.

### 2.8. Seguridad y confiabilidad

- Proteger la información personal de los usuarios.
- Implementar mecanismos seguros de autenticación y autorización.
- Evitar la creación de pedidos duplicados.
- Garantizar que las compras requieran autorización del usuario.
- Gestionar correctamente los errores de disponibilidad, pagos y notificaciones.

## 3. Alcance general

DietDelivery será una plataforma que conectará a usuarios, restaurantes y repartidores mediante un sistema centralizado de pedidos alimenticios.

El alcance contempla tanto los pedidos convencionales bajo demanda como los pedidos recurrentes programados.

Su principal diferenciador será la capacidad de generar propuestas de compra automáticamente, basándose en configuraciones previamente establecidas y solicitando la autorización del usuario antes de procesarlas.

### 3.1. Módulo de usuario

Comprenderá las herramientas necesarias para administrar cuentas, preferencias alimenticias, direcciones, programaciones y pedidos.

### 3.2. Módulo de restaurante

Permitirá administrar establecimientos, productos, disponibilidad y solicitudes de preparación.

### 3.3. Módulo de repartidor

Permitirá gestionar las entregas asignadas y actualizar su progreso.

### 3.4. Módulo de administración

Proporcionará herramientas para supervisar los participantes y las operaciones de la plataforma.

### 3.5. Módulo de programación

Gestionará la creación, almacenamiento, ejecución y modificación de programaciones recurrentes.

### 3.6. Módulo de notificaciones

Será responsable de informar al usuario cuando exista una propuesta de pedido pendiente de confirmación y de comunicar actualizaciones relevantes.

### 3.7. Módulo de recomendaciones

Seleccionará restaurantes y platillos compatibles con las categorías y restricciones alimenticias registradas.

### 3.8. Módulo de pedidos y entregas

Gestionará el ciclo de vida de cada pedido, desde su confirmación hasta su entrega o cancelación.

## 4. Producto Mínimo Viable (MVP)

El MVP será la primera versión funcional de DietDelivery.

Su propósito será validar que los usuarios puedan configurar sus preferencias, programar comidas recurrentes y confirmar pedidos de manera simplificada.

Se priorizarán las funcionalidades indispensables para demostrar el flujo completo de la plataforma.

### 4.1. Funcionalidades del usuario

- Registro e inicio de sesión.
- Administración básica del perfil.
- Registro de direcciones de entrega.
- Selección de preferencias alimenticias.
- Registro de restricciones e ingredientes a evitar.
- Exploración de restaurantes y platillos.
- Visualización de recomendaciones compatibles.
- Creación de pedidos convencionales.
- Creación de programaciones recurrentes.
- Programaciones con platillos fijos.
- Programaciones mediante recomendaciones variables.
- Configuración de días y horarios.
- Consulta, modificación, pausa y eliminación de programaciones.
- Recepción de notificaciones de pedidos programados.
- Confirmación de pedidos dentro de la aplicación.
- Confirmación rápida desde notificaciones, cuando el dispositivo y las autorizaciones lo permitan.
- Consulta del estado e historial de pedidos.

### 4.2. Funcionalidades del restaurante

- Acceso mediante cuenta de restaurante.
- Administración de información básica del establecimiento.
- Registro, edición y eliminación lógica de productos.
- Administración de precios.
- Registro de ingredientes y alérgenos declarados.
- Actualización de disponibilidad.
- Recepción y aceptación de pedidos.
- Actualización de estados de preparación.

### 4.3. Funcionalidades del repartidor

- Acceso mediante cuenta de repartidor.
- Consulta de entregas asignadas.
- Visualización de información necesaria para la entrega.
- Confirmación de recolección.
- Actualización del estado de entrega.
- Confirmación de entrega completada.

### 4.4. Funcionalidades del administrador

- Inicio de sesión con permisos administrativos.
- Consulta y administración de usuarios.
- Gestión básica de restaurantes.
- Gestión básica de repartidores.
- Consulta general de pedidos.
- Supervisión de estados e incidencias.

### 4.5. Funcionalidades internas

- Control de acceso por roles.
- Generación de propuestas de pedidos recurrentes.
- Validación de programaciones activas.
- Verificación de disponibilidad de productos.
- Cálculo del total antes de la confirmación.
- Registro de confirmaciones y rechazos.
- Prevención de pedidos duplicados.
- Asignación básica de entregas.
- Gestión de estados de pedidos.
- Registro de eventos y errores relevantes.

### 4.6. Alcance de pagos en el MVP

El MVP deberá permitir validar el proceso de pago asociado a los pedidos.

Durante el desarrollo podrán utilizarse entornos de prueba de una pasarela de pagos, sin realizar cobros reales.

La aceptación de pagos reales estará condicionada a la integración y validación de un proveedor autorizado, así como a los requisitos de seguridad y operación correspondientes.

No se almacenarán directamente datos sensibles de tarjetas bancarias.

## 5. Flujo mínimo que debe funcionar

Para considerar funcional el MVP, deberá ser posible completar el siguiente proceso:

1. Un usuario crea una cuenta y registra su dirección.
2. Configura sus preferencias y restricciones alimenticias.
3. Consulta restaurantes y platillos compatibles.
4. Selecciona una modalidad de programación recurrente.
5. Establece días y horarios.
6. Guarda y activa la programación.
7. El sistema detecta una ocurrencia programada.
8. Se genera una propuesta de pedido compatible.
9. El usuario recibe una notificación.
10. El usuario revisa y confirma la propuesta.
11. El sistema valida disponibilidad, precio y autorización de pago.
12. Se crea el pedido sin duplicaciones.
13. El restaurante recibe y acepta la solicitud.
14. El restaurante prepara el pedido.
15. El sistema asigna un repartidor.
16. El repartidor recoge el pedido.
17. El repartidor completa la entrega.
18. El usuario puede consultar el pedido en su historial.

El sistema también deberá manejar los casos en los que el usuario rechace o no confirme una propuesta, evitando la generación de compras no autorizadas.

## 6. Criterios de aceptación del MVP

El MVP se considerará listo para una evaluación funcional cuando cumpla las siguientes condiciones:

| ID | Criterio de aceptación |
|---|---|
| CA-01 | Los cuatro actores pueden acceder a sus funcionalidades autorizadas. |
| CA-02 | El usuario puede registrar preferencias y restricciones alimenticias. |
| CA-03 | Se pueden consultar restaurantes y platillos compatibles. |
| CA-04 | Se pueden crear programaciones recurrentes fijas. |
| CA-05 | Se pueden crear programaciones basadas en recomendaciones. |
| CA-06 | El sistema genera propuestas en los días y horarios configurados. |
| CA-07 | El usuario puede confirmar o rechazar una propuesta. |
| CA-08 | Se admiten confirmaciones dentro de la app y, en dispositivos compatibles, desde notificaciones. |
| CA-09 | No se procesa una compra sin autorización válida. |
| CA-10 | Una misma confirmación no genera pedidos duplicados. |
| CA-11 | El restaurante puede recibir y gestionar pedidos. |
| CA-12 | El repartidor puede consultar y actualizar entregas asignadas. |
| CA-13 | El usuario puede consultar el estado y el historial de sus pedidos. |
| CA-14 | El administrador puede supervisar las operaciones básicas. |
| CA-15 | El sistema maneja productos no disponibles y propuestas expiradas sin generar compras incorrectas. |

## 7. Limitaciones y exclusiones iniciales

Para mantener un alcance viable, la primera versión tendrá las siguientes limitaciones.

### 7.1. Recomendaciones alimenticias

Las recomendaciones se basarán inicialmente en categorías, ingredientes, restricciones declaradas y disponibilidad.

No se incluirán diagnósticos médicos ni prescripciones nutricionales.

La plataforma no garantizará la ausencia de contaminación cruzada ni sustituirá la verificación de ingredientes por parte del restaurante.

### 7.2. Inteligencia artificial

El MVP no dependerá de modelos avanzados de inteligencia artificial.

Las recomendaciones podrán generarse mediante filtros y reglas de compatibilidad.

### 7.3. Cobertura geográfica

La operación inicial se limitará a una zona geográfica de prueba, cuya delimitación será definida posteriormente.

No se contempla un lanzamiento nacional o internacional durante la primera etapa.

### 7.4. Logística de reparto

La asignación de repartidores utilizará un mecanismo básico.

No se incluirán inicialmente algoritmos avanzados de optimización de rutas ni distribución masiva de entregas.

### 7.5. Seguimiento en tiempo real

El MVP permitirá consultar los estados de los pedidos y entregas.

El seguimiento GPS continuo sobre un mapa interactivo se considerará una funcionalidad futura.

### 7.6. Métodos de pago

La primera versión utilizará un mecanismo de pago limitado y verificable, preferentemente mediante una pasarela en entorno de pruebas.

No se desarrollará un sistema bancario propio.

### 7.7. Disponibilidad de productos

Las recomendaciones y pedidos dependerán de los productos, precios y horarios publicados por los restaurantes.

La disponibilidad deberá verificarse antes de procesar cada pedido.

### 7.8. Notificaciones

La entrega de notificaciones dependerá de los permisos del usuario, la conectividad y las capacidades del dispositivo.

El sistema deberá conservar las propuestas pendientes dentro de la aplicación cuando una notificación no pueda entregarse.

## 8. Funcionalidades para versiones futuras

Las siguientes características se consideran posibles ampliaciones posteriores al MVP.

### 8.1. Recomendaciones avanzadas

- Recomendaciones personalizadas mediante inteligencia artificial.
- Aprendizaje de preferencias a partir del historial de pedidos.
- Sugerencias basadas en presupuestos.
- Rotación automática de platillos para ofrecer variedad.
- Recomendaciones basadas en objetivos nutricionales definidos por el usuario.

### 8.2. Herramientas nutricionales

- Información nutricional detallada.
- Registro de calorías y macronutrientes.
- Integración con planes proporcionados por profesionales.
- Estadísticas de hábitos alimenticios.
- Seguimiento de objetivos de alimentación.

### 8.3. Programaciones avanzadas

- Plantillas de planes semanales y mensuales.
- Programaciones para grupos o familias.
- Presupuestos máximos por pedido o periodo.
- Sugerencias de sustitución ante productos agotados.
- Reprogramación inteligente ante cambios de disponibilidad.

### 8.4. Logística avanzada

- Seguimiento GPS en tiempo real.
- Optimización automática de rutas.
- Estimaciones dinámicas de entrega.
- Asignación inteligente de repartidores.
- Agrupación de pedidos compatibles.

### 8.5. Funcionalidades comerciales

- Cupones y promociones.
- Programas de fidelización.
- Suscripciones.
- Beneficios por pedidos recurrentes.
- Sistemas de calificaciones y reseñas.

### 8.6. Integraciones externas

- Integración con aplicaciones de calendario.
- Sincronización con herramientas de planificación alimenticia.
- Integración con servicios de mapas avanzados.
- Conexión con sistemas de gestión de restaurantes.
- Integración con plataformas externas de nutrición, cuando corresponda y exista autorización.

## 9. Restricciones del proyecto

El desarrollo estará sujeto a determinadas restricciones técnicas y operativas.

### 9.1. Recursos

La implementación dependerá del tiempo, presupuesto, infraestructura y personal disponible.

### 9.2. Servicios externos

Determinadas funciones podrán depender de proveedores de pagos, notificaciones, geolocalización y otros servicios.

### 9.3. Cumplimiento normativo

La operación deberá considerar la legislación aplicable en materia de protección de datos personales, comercio electrónico, pagos y prestación de servicios.

### 9.4. Seguridad alimentaria

Los restaurantes serán responsables de proporcionar información correcta sobre los alimentos ofrecidos.

La plataforma deberá comunicar las limitaciones de sus filtros y evitar presentar recomendaciones como garantías de seguridad alimentaria.

### 9.5. Compatibilidad tecnológica

La aplicación deberá diseñarse considerando las capacidades y restricciones de los dispositivos y sistemas operativos seleccionados.

## 10. Indicadores de éxito

Para evaluar el funcionamiento y la utilidad de DietDelivery se podrán utilizar los siguientes indicadores:

| Indicador | Descripción |
|---|---|
| Tasa de confirmación | Porcentaje de propuestas recurrentes confirmadas por usuarios. |
| Tiempo de confirmación | Tiempo que tarda el usuario en confirmar una propuesta. |
| Pedidos recurrentes completados | Cantidad de pedidos programados que terminan en una entrega exitosa. |
| Tasa de errores | Proporción de operaciones que presentan fallos. |
| Pedidos duplicados | Número de pedidos generados incorrectamente por una misma confirmación. |
| Disponibilidad de productos | Porcentaje de propuestas cuyos productos siguen disponibles al confirmar. |
| Cumplimiento de entregas | Porcentaje de pedidos entregados correctamente. |
| Uso de programaciones | Cantidad de usuarios que crean y utilizan pedidos recurrentes. |

Las metas numéricas se definirán cuando existan datos suficientes de las pruebas iniciales.

## 11. Criterios de finalización de la primera etapa

La primera etapa del proyecto se considerará concluida cuando:

1. Se encuentren documentados los requerimientos y procesos principales.
2. Se haya definido la arquitectura del sistema.
3. Se haya seleccionado el stack tecnológico.
4. Se encuentren implementados los módulos esenciales.
5. Se puedan ejecutar los flujos completos del MVP.
6. Se hayan realizado pruebas funcionales y de seguridad básicas.
7. Se hayan corregido los errores críticos detectados.
8. Exista documentación suficiente para instalar, ejecutar y evaluar la plataforma.

La finalización del MVP no implicará que la plataforma esté lista para operar comercialmente a gran escala.

## 12. Conclusión

Coconea busca transformar la experiencia de reparto de alimentos mediante una plataforma que combine personalización alimenticia, planificación de comidas y confirmación simplificada de pedidos recurrentes.

El alcance inicial priorizará la implementación de un sistema funcional que conecte a los cuatro actores principales y permita completar el ciclo de programación, confirmación, preparación y entrega.

La estrategia de desarrollo se centrará en construir primero las funcionalidades esenciales, validar su funcionamiento y posteriormente incorporar herramientas más avanzadas de personalización, logística y automatización.

---

**Coconea — Planifica tu alimentación, confirma y recibe.**