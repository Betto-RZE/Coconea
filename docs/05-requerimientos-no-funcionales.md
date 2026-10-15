# Requerimientos No Funcionales del Sistema

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación

---

## 1. Introducción

El presente documento establece los requerimientos no funcionales de DietDelivery, una plataforma de reparto de alimentos enfocada en la personalización alimenticia y la automatización de pedidos recurrentes.

Los requerimientos no funcionales definen las características de calidad, rendimiento, seguridad, confiabilidad, disponibilidad y mantenimiento que deberá cumplir el sistema.

A diferencia de los requerimientos funcionales, que describen las operaciones de la aplicación, los requerimientos no funcionales establecen las condiciones bajo las cuales dichas operaciones deberán ejecutarse.

Estos requisitos serán utilizados como referencia durante el diseño de la arquitectura, la selección de tecnologías, la implementación y las pruebas.

## 2. Clasificación y prioridades

Se utilizará la misma clasificación establecida en los requerimientos funcionales.

| Prioridad | Descripción |
|---|---|
| P0 — Crítica | Requisito indispensable para la operación segura del MVP. |
| P1 — Alta | Requisito importante que deberá cumplirse antes de finalizar el MVP. |
| P2 — Media | Mejora prevista para versiones posteriores. |
| P3 — Baja | Optimización opcional o evolución futura. |

### 2.1. Condiciones de medición

Las métricas de este documento representan objetivos iniciales de diseño y deberán validarse mediante pruebas.

Para las pruebas de rendimiento del MVP se utilizará, como referencia inicial, el siguiente escenario:

- 100 usuarios concurrentes.
- 20 restaurantes registrados.
- 20 repartidores registrados.
- 1,000 productos publicados.
- 500 programaciones recurrentes activas.
- Conectividad estable con una latencia de red simulada de 100 ms.
- Infraestructura de pruebas equivalente a la configuración mínima de producción propuesta.

Las métricas de respuesta se medirán desde la recepción de la solicitud por el servidor hasta la emisión de la respuesta, salvo que se indique lo contrario.

Las operaciones que dependan de proveedores externos se evaluarán separando el tiempo interno del sistema y el tiempo del proveedor.

Estos valores son objetivos de prueba, no resultados de rendimiento ya comprobados.

## 3. Rendimiento

### RNF-001 — Tiempo de respuesta de operaciones comunes

**Prioridad:** P0  
**Categoría:** Rendimiento

**Descripción:** Las operaciones habituales de consulta deberán responder dentro de tiempos adecuados para una experiencia fluida.

**Métrica:** El 95 % de las solicitudes de consulta deberá responder en un máximo de 800 ms bajo la carga de referencia.

**Criterios de aceptación:**
- Se ejecutan pruebas de carga con 100 usuarios concurrentes.
- El percentil 95 (p95) no supera 800 ms.
- La tasa de errores del servidor permanece por debajo del 1 %.

### RNF-002 — Tiempo de autenticación

**Prioridad:** P1  
**Categoría:** Rendimiento

**Descripción:** Las operaciones de autenticación deberán ejecutarse sin demoras excesivas.

**Métrica:** El 95 % de los inicios de sesión válidos deberá completarse en un máximo de 1.5 segundos, excluyendo autenticación externa.

**Criterios de aceptación:**
- Se realizan pruebas de inicio de sesión.
- Se verifica el p95 del tiempo de respuesta.
- Se comprueba que las validaciones de seguridad no se omiten para mejorar el rendimiento.

### RNF-003 — Generación de propuestas recurrentes

**Prioridad:** P0  
**Categoría:** Rendimiento

**Descripción:** El sistema deberá generar las propuestas correspondientes a las programaciones activas sin retrasos excesivos.

**Métrica:** El 99 % de las propuestas válidas deberá quedar registrado dentro de los 60 segundos posteriores al horario programado, bajo la carga de referencia.

**Criterios de aceptación:**
- Se ejecutan 500 programaciones activas de prueba.
- Se verifica el tiempo de generación.
- No se generan propuestas duplicadas.
- Las programaciones pausadas no producen propuestas.

### RNF-004 — Procesamiento interno de confirmaciones

**Prioridad:** P0  
**Categoría:** Rendimiento

**Descripción:** La confirmación de un pedido deberá procesarse de forma eficiente, incluso cuando requiera operaciones posteriores asíncronas.

**Métrica:** El 95 % de las solicitudes válidas deberá recibir una respuesta inicial en un máximo de 1.5 segundos, sin incluir la finalización de operaciones externas de pago.

**Criterios de aceptación:**
- Se registra el tiempo de respuesta.
- La respuesta identifica si la operación fue aceptada, rechazada o continúa en procesamiento.
- Los reintentos no producen pedidos duplicados.

### RNF-005 — Optimización de consultas

**Prioridad:** P1  
**Categoría:** Rendimiento

**Descripción:** Las consultas a la base de datos deberán diseñarse para evitar operaciones innecesariamente costosas.

**Métrica:** El 95 % de las consultas críticas deberá ejecutarse en un máximo de 200 ms con los datos de referencia.

**Criterios de aceptación:**
- Se identifican las consultas críticas.
- Se analizan sus planes de ejecución.
- Se verifica el uso adecuado de índices.
- Se documentan las consultas que superen el objetivo.

## 4. Seguridad

### RNF-006 — Protección de comunicaciones

**Prioridad:** P0  
**Categoría:** Seguridad

**Descripción:** Las comunicaciones externas de la plataforma deberán utilizar conexiones cifradas.

**Métrica:** El 100 % de las comunicaciones autenticadas en producción deberá utilizar HTTPS con TLS 1.2 o superior.

**Criterios de aceptación:**
- No se aceptan conexiones inseguras para operaciones protegidas.
- Se comprueba la configuración TLS.
- No se transmiten credenciales mediante conexiones sin cifrar.

### RNF-007 — Almacenamiento seguro de contraseñas

**Prioridad:** P0  
**Categoría:** Seguridad

**Descripción:** Las contraseñas deberán almacenarse utilizando algoritmos de hash adecuados para credenciales.

**Métrica:** El 100 % de las contraseñas almacenadas deberá utilizar un mecanismo seguro, como Argon2id o una alternativa equivalente debidamente configurada.

**Criterios de aceptación:**
- No existen contraseñas en texto plano.
- Cada contraseña utiliza parámetros de hash apropiados.
- Las contraseñas no aparecen en registros de eventos.

### RNF-008 — Autorización de operaciones

**Prioridad:** P0  
**Categoría:** Seguridad

**Descripción:** Todas las operaciones protegidas deberán verificar la identidad, rol y permisos del actor.

**Métrica:** El 100 % de los endpoints protegidos deberá contar con validación de autorización en el servidor.

**Criterios de aceptación:**
- Se ejecutan pruebas de acceso entre roles.
- Los usuarios no pueden consultar recursos privados ajenos.
- Los restaurantes no pueden modificar otros establecimientos.
- Los repartidores no pueden consultar entregas no asignadas.
- Las solicitudes no autorizadas son rechazadas.

### RNF-009 — Protección de sesiones

**Prioridad:** P0  
**Categoría:** Seguridad

**Descripción:** Las sesiones deberán contar con mecanismos de expiración y revocación.

**Métrica:** Una sesión revocada deberá dejar de permitir nuevas operaciones protegidas en un máximo de 60 segundos.

**Criterios de aceptación:**
- Se comprueba la expiración de credenciales.
- Se verifica el cierre de sesión.
- Las sesiones revocadas no permiten continuar operando.

### RNF-010 — Prevención de vulnerabilidades comunes

**Prioridad:** P1  
**Categoría:** Seguridad

**Descripción:** El sistema deberá implementar medidas de protección frente a vulnerabilidades comunes de aplicaciones web y APIs.

**Métrica:** No deberán existir vulnerabilidades críticas o altas conocidas y explotables sin mitigación al aprobar el MVP.

**Criterios de aceptación:**
- Se realizan análisis de dependencias.
- Se ejecutan pruebas de validación de entradas.
- Se revisan controles contra inyección y accesos indebidos.
- Se documentan y corrigen los hallazgos críticos y altos.

### RNF-011 — Auditoría de operaciones sensibles

**Prioridad:** P0  
**Categoría:** Seguridad

**Descripción:** Las operaciones relevantes deberán generar registros de auditoría.

**Métrica:** El 100 % de las confirmaciones de compra, cambios administrativos sensibles y transiciones críticas deberá generar un evento de auditoría.

**Criterios de aceptación:**
- Los eventos incluyen fecha, tipo de operación e identificador del actor cuando corresponda.
- Los registros no contienen secretos.
- Los registros están protegidos contra modificaciones no autorizadas.

## 5. Disponibilidad

### RNF-012 — Disponibilidad del servicio

**Prioridad:** P1  
**Categoría:** Disponibilidad

**Descripción:** La plataforma deberá mantener una disponibilidad adecuada durante la operación del MVP.

**Métrica:** Disponibilidad mensual objetivo del 99.5 % para los servicios principales, excluyendo mantenimientos programados previamente comunicados.

**Criterios de aceptación:**
- Se implementa monitoreo de disponibilidad.
- Se registra el tiempo de interrupción.
- Se calcula la disponibilidad mensual.
- Se documentan las interrupciones y sus causas.

### RNF-013 — Monitoreo de servicios

**Prioridad:** P1  
**Categoría:** Disponibilidad

**Descripción:** Los componentes críticos deberán contar con mecanismos de supervisión.

**Métrica:** El 100 % de los servicios críticos deberá disponer de una verificación de salud ejecutada al menos cada 60 segundos.

**Criterios de aceptación:**
- Se detectan fallos de servicios críticos.
- Se generan alertas operativas.
- Los resultados pueden consultarse por personal autorizado.

### RNF-014 — Mantenimiento controlado

**Prioridad:** P1  
**Categoría:** Disponibilidad

**Descripción:** Las tareas de mantenimiento deberán minimizar la interrupción de las operaciones.

**Métrica:** Las ventanas de mantenimiento planificadas deberán registrarse y comunicarse antes de su ejecución.

**Criterios de aceptación:**
- Existe un procedimiento de mantenimiento.
- Se verifica el estado del sistema después de cada despliegue.
- Se cuenta con un procedimiento de reversión.

## 6. Escalabilidad

### RNF-015 — Capacidad inicial

**Prioridad:** P0  
**Categoría:** Escalabilidad

**Descripción:** La infraestructura del MVP deberá soportar la carga de referencia definida.

**Métrica:** Soportar 100 usuarios concurrentes y 500 programaciones activas cumpliendo las métricas de rendimiento críticas.

**Criterios de aceptación:**
- Se ejecutan pruebas de carga.
- Se verifican tiempos de respuesta.
- No se producen errores de consistencia.
- Se documenta el consumo de recursos.

### RNF-016 — Crecimiento de capacidad

**Prioridad:** P2  
**Categoría:** Escalabilidad

**Descripción:** La arquitectura deberá permitir aumentar la capacidad de procesamiento sin rediseñar completamente los módulos principales.

**Métrica:** En una prueba de escalado, duplicar la capacidad de procesamiento objetivo mediante recursos adicionales, manteniendo las métricas de servicio definidas para el escenario ampliado.

**Criterios de aceptación:**
- Se documenta una estrategia de escalado.
- Se ejecuta una prueba comparativa.
- Se identifican los límites de los componentes compartidos.

### RNF-017 — Procesamiento independiente de tareas programadas

**Prioridad:** P1  
**Categoría:** Escalabilidad

**Descripción:** Las tareas recurrentes deberán ejecutarse sin bloquear las operaciones interactivas.

**Métrica:** Durante la ejecución de 500 ocurrencias programadas, las consultas habituales deberán mantener el objetivo p95 establecido en RNF-001.

**Criterios de aceptación:**
- Se ejecutan pruebas de carga combinadas.
- Se verifica la separación lógica del procesamiento.
- Se controlan los reintentos y las duplicaciones.

## 7. Accesibilidad y usabilidad

### RNF-018 — Accesibilidad de interfaces

**Prioridad:** P1  
**Categoría:** Accesibilidad

**Descripción:** Las interfaces principales deberán diseñarse siguiendo las recomendaciones WCAG 2.2 nivel AA aplicables.

**Métrica:** El 100 % de los flujos críticos deberá superar una evaluación de accesibilidad sin incumplimientos de nivel A o AA detectados en las pruebas acordadas.

**Criterios de aceptación:**
- Los controles cuentan con etiquetas accesibles.
- Se verifica contraste de texto.
- Los flujos web admiten navegación por teclado.
- Se comprueba la compatibilidad con tecnologías de asistencia seleccionadas.

### RNF-019 — Claridad de confirmación

**Prioridad:** P0  
**Categoría:** Usabilidad

**Descripción:** El proceso de confirmación deberá mostrar claramente las condiciones de compra.

**Métrica:** El 100 % de las pantallas de confirmación deberá presentar restaurante, productos, cantidades, dirección y costo total antes de autorizar el pedido.

**Criterios de aceptación:**
- Se verifican todos los campos obligatorios.
- Los cambios relevantes se comunican.
- La acción de confirmación es distinguible de la de rechazo.

### RNF-020 — Simplicidad del pedido recurrente

**Prioridad:** P1  
**Categoría:** Usabilidad

**Descripción:** Los usuarios deberán poder confirmar pedidos recurrentes sin repetir la búsqueda y selección de productos.

**Métrica:** Una propuesta vigente y válida deberá poder confirmarse con un máximo de dos acciones explícitas desde su pantalla de resumen, sin contar autenticaciones adicionales requeridas por seguridad.

**Criterios de aceptación:**
- Se prueba el flujo de confirmación.
- No se exige seleccionar nuevamente restaurante y productos.
- Se verifican las condiciones de autorización.

### RNF-021 — Adaptación de interfaz

**Prioridad:** P1  
**Categoría:** Usabilidad

**Descripción:** Las interfaces deberán adaptarse a los tamaños de pantalla seleccionados.

**Métrica:** El 100 % de los flujos críticos deberá ser utilizable sin pérdida de controles en los tamaños de pantalla definidos para el MVP.

**Criterios de aceptación:**
- Se realizan pruebas en diferentes resoluciones.
- Los formularios y botones permanecen accesibles.
- No existen elementos esenciales fuera del área visible sin mecanismo de acceso.

## 8. Compatibilidad

### RNF-022 — Compatibilidad de clientes

**Prioridad:** P1  
**Categoría:** Compatibilidad

**Descripción:** La plataforma deberá funcionar en los dispositivos y entornos seleccionados para el MVP.

**Métrica:** El 100 % de los flujos críticos deberá completarse en la matriz de compatibilidad aprobada.

**Criterios de aceptación:**
- Se documentan los sistemas operativos y navegadores soportados.
- Se ejecutan pruebas en los entornos seleccionados.
- Se registran las limitaciones específicas.

### RNF-023 — Compatibilidad de notificaciones

**Prioridad:** P0  
**Categoría:** Compatibilidad

**Descripción:** El sistema deberá adaptarse a las capacidades de notificación del dispositivo.

**Métrica:** El 100 % de los clientes soportados deberá disponer de una ruta funcional para consultar y confirmar propuestas dentro de la aplicación, aunque no admita confirmación interactiva desde notificaciones.

**Criterios de aceptación:**
- Se detectan las capacidades del cliente.
- Se habilita confirmación rápida cuando está soportada.
- Se proporciona confirmación dentro de la aplicación como alternativa.
- No se omiten validaciones de seguridad.

## 9. Privacidad y protección de datos

### RNF-024 — Minimización de datos

**Prioridad:** P0  
**Categoría:** Privacidad

**Descripción:** El sistema deberá recopilar y mostrar únicamente la información necesaria para cada operación.

**Métrica:** El 100 % de los campos personales expuestos en interfaces y APIs deberá contar con una finalidad documentada y un destinatario autorizado.

**Criterios de aceptación:**
- Se revisan los datos recopilados.
- Se documenta su finalidad.
- Los restaurantes reciben solo la información necesaria para preparar pedidos.
- Los repartidores reciben únicamente los datos necesarios para entregar.

### RNF-025 — Protección de preferencias y restricciones

**Prioridad:** P0  
**Categoría:** Privacidad

**Descripción:** Las preferencias y restricciones alimenticias deberán tratarse como información privada, aplicando controles reforzados cuando puedan revelar datos sensibles.

**Métrica:** El 100 % de los accesos a información alimenticia privada deberá estar sujeto a autorización.

**Criterios de aceptación:**
- Se restringe el acceso por propietario y finalidad.
- No se expone el perfil completo a restaurantes o repartidores.
- Se aplican las obligaciones legales correspondientes a los datos recopilados.

### RNF-026 — Derechos sobre datos personales

**Prioridad:** P1  
**Categoría:** Privacidad

**Descripción:** El sistema deberá proporcionar mecanismos para atender solicitudes de acceso, rectificación, cancelación y oposición, conforme a la legislación aplicable.

**Métrica:** El 100 % de las solicitudes recibidas deberá registrarse y gestionarse dentro de los plazos legales aplicables.

**Criterios de aceptación:**
- Existe un procedimiento documentado.
- Se verifica la identidad del solicitante.
- Se registra la atención y resolución.
- Se respetan las obligaciones legales de conservación.

### RNF-027 — Política de conservación

**Prioridad:** P1  
**Categoría:** Privacidad

**Descripción:** Los datos personales y operativos deberán conservarse únicamente durante los periodos necesarios y legalmente permitidos.

**Métrica:** El 100 % de las categorías de datos almacenados deberá contar con una política documentada de conservación y eliminación.

**Criterios de aceptación:**
- Se identifican las categorías de datos.
- Se documentan los periodos de conservación.
- Se definen mecanismos de eliminación o anonimización.
- Se consideran las obligaciones fiscales y legales aplicables.

## 10. Confiabilidad de programaciones y notificaciones

### RNF-028 — Ejecución confiable de programaciones

**Prioridad:** P0  
**Categoría:** Confiabilidad

**Descripción:** Las programaciones recurrentes deberán ejecutarse de manera consistente, incluso ante reintentos.

**Métrica:** El 100 % de las ocurrencias procesadas deberá conservar un identificador único y no generar más de una propuesta activa por ocurrencia.

**Criterios de aceptación:**
- Se ejecutan pruebas concurrentes.
- Se simulan reintentos.
- No se generan propuestas duplicadas.
- Se registra el resultado de cada ocurrencia.

### RNF-029 — Registro de intentos de notificación

**Prioridad:** P0  
**Categoría:** Confiabilidad

**Descripción:** Los intentos de envío de notificaciones deberán ser rastreables.

**Métrica:** El 100 % de los intentos gestionados por el sistema deberá registrar su estado y resultado conocido.

**Criterios de aceptación:**
- Se registra la creación del aviso.
- Se registra el intento de envío.
- Se identifica el resultado informado por el proveedor.
- No se interpreta la aceptación del proveedor como prueba de lectura del usuario.

### RNF-030 — Recuperación de notificaciones fallidas

**Prioridad:** P1  
**Categoría:** Confiabilidad

**Descripción:** El sistema deberá gestionar los fallos temporales de notificación sin generar compras automáticas.

**Métrica:** Los fallos transitorios elegibles deberán contar con al menos tres intentos de entrega, respetando la vigencia de la propuesta y las restricciones del proveedor.

**Criterios de aceptación:**
- Se aplica una política de reintentos.
- No se reintentan notificaciones de propuestas expiradas.
- Las propuestas permanecen consultables dentro de la aplicación.
- No se generan pedidos por ausencia de respuesta.

### RNF-031 — Exactitud temporal

**Prioridad:** P0  
**Categoría:** Confiabilidad

**Descripción:** Las programaciones deberán respetar la zona horaria configurada.

**Métrica:** El 100 % de las ocurrencias deberá calcularse utilizando una zona horaria identificable y reglas de calendario consistentes.

**Criterios de aceptación:**
- Se realizan pruebas con diferentes zonas horarias.
- Se evalúan cambios de horario cuando sean aplicables.
- No se generan ocurrencias duplicadas por cambios temporales.
- Se conserva la referencia temporal utilizada.

## 11. Pagos y consistencia transaccional

### RNF-032 — Seguridad de pagos

**Prioridad:** P0  
**Categoría:** Pagos

**Descripción:** Los pagos deberán procesarse mediante mecanismos autorizados y seguros.

**Métrica:** El 100 % de las operaciones con tarjeta deberá delegar la captura y el procesamiento de datos sensibles a un proveedor autorizado, evitando su almacenamiento directo en DietDelivery.

**Criterios de aceptación:**
- No se almacenan números completos de tarjeta ni códigos de seguridad.
- Se verifican las respuestas del proveedor.
- Se protegen las credenciales de integración.
- Se documenta el alcance de las obligaciones de seguridad aplicables.

### RNF-033 — Idempotencia de cobros

**Prioridad:** P0  
**Categoría:** Pagos

**Descripción:** Los reintentos de una misma operación no deberán provocar cobros duplicados.

**Métrica:** Cero cobros duplicados atribuibles al sistema en las pruebas de concurrencia y reintentos definidas.

**Criterios de aceptación:**
- Se utilizan identificadores idempotentes.
- Se simulan solicitudes repetidas.
- Se simulan respuestas tardías del proveedor.
- Se verifica la conciliación de estados.

### RNF-034 — Consistencia entre pagos y pedidos

**Prioridad:** P0  
**Categoría:** Pagos

**Descripción:** El estado de los pedidos deberá mantenerse coherente con el resultado de las operaciones de pago.

**Métrica:** El 100 % de las operaciones de pago de prueba deberá alcanzar un estado final consistente o quedar identificado para conciliación.

**Criterios de aceptación:**
- Los pagos fallidos no se marcan como exitosos.
- Los estados pendientes se identifican correctamente.
- Se gestionan eventos repetidos o fuera de orden.
- Los casos inconsistentes generan alertas o procesos de conciliación.

## 12. Mantenibilidad

### RNF-035 — Organización modular

**Prioridad:** P1  
**Categoría:** Mantenibilidad

**Descripción:** El código deberá organizarse en módulos con responsabilidades claramente definidas.

**Métrica:** El 100 % de las funcionalidades del MVP deberá pertenecer a un módulo documentado.

**Criterios de aceptación:**
- Existe una estructura de módulos definida.
- Se identifican responsabilidades.
- Se documentan dependencias importantes.
- Se evitan dependencias circulares no justificadas.

### RNF-036 — Calidad y pruebas automatizadas

**Prioridad:** P1  
**Categoría:** Mantenibilidad

**Descripción:** El proyecto deberá incorporar pruebas automatizadas para sus componentes críticos.

**Métrica:** Cobertura mínima del 80 % de líneas en la lógica de negocio crítica, complementada con pruebas de integración de los flujos principales.

**Criterios de aceptación:**
- Se ejecutan pruebas automáticamente.
- Se incluyen pruebas de programaciones, confirmaciones, permisos y pagos.
- Los fallos bloquean la aprobación de cambios críticos.
- Se genera un reporte de cobertura.

### RNF-037 — Documentación técnica

**Prioridad:** P1  
**Categoría:** Mantenibilidad

**Descripción:** El proyecto deberá mantener documentación suficiente para facilitar su desarrollo y operación.

**Métrica:** El 100 % de los módulos y endpoints públicos del MVP deberá contar con documentación vigente.

**Criterios de aceptación:**
- Se documentan interfaces y contratos.
- Se registran configuraciones necesarias.
- Se incluyen instrucciones de instalación.
- Los cambios relevantes actualizan la documentación.

### RNF-038 — Control de versiones

**Prioridad:** P1  
**Categoría:** Mantenibilidad

**Descripción:** El código fuente deberá administrarse mediante un sistema de control de versiones.

**Métrica:** El 100 % de los cambios integrados a la rama principal deberá contar con historial identificable y validaciones automatizadas definidas.

**Criterios de aceptación:**
- Se utiliza un repositorio versionado.
- Se documenta el flujo de contribución.
- Se ejecutan validaciones antes de integrar cambios.
- No se incluyen credenciales en el repositorio.

## 13. Recuperación ante fallos

### RNF-039 — Copias de seguridad

**Prioridad:** P0  
**Categoría:** Recuperación

**Descripción:** La información persistente crítica deberá contar con mecanismos de respaldo.

**Métrica:** Se realizará al menos una copia de seguridad diaria, complementada con mecanismos que permitan alcanzar el objetivo de recuperación de datos definido.

**Criterios de aceptación:**
- Los respaldos se ejecutan automáticamente.
- Se registra su resultado.
- Los archivos se protegen contra accesos no autorizados.
- Se realizan pruebas de restauración.

### RNF-040 — Objetivo de recuperación de datos (RPO)

**Prioridad:** P1  
**Categoría:** Recuperación

**Descripción:** El sistema deberá limitar la pérdida de información ante incidentes graves.

**Métrica:** RPO objetivo máximo de 15 minutos para datos operativos críticos.

**Criterios de aceptación:**
- Se define una estrategia compatible con el objetivo.
- Se realizan pruebas de recuperación.
- Se mide la antigüedad de los datos restaurados.
- Se documentan las limitaciones detectadas.

### RNF-041 — Objetivo de recuperación del servicio (RTO)

**Prioridad:** P1  
**Categoría:** Recuperación

**Descripción:** El sistema deberá disponer de procedimientos para restaurar los servicios críticos después de una interrupción grave.

**Métrica:** RTO objetivo máximo de 4 horas para recuperar los servicios principales.

**Criterios de aceptación:**
- Existe un procedimiento documentado.
- Se realiza una prueba de recuperación.
- Se mide el tiempo de restauración.
- Se verifica la integridad de los servicios recuperados.

### RNF-042 — Recuperación de tareas interrumpidas

**Prioridad:** P0  
**Categoría:** Recuperación

**Descripción:** Las tareas de generación de propuestas y procesamiento de pedidos deberán recuperarse de interrupciones sin provocar operaciones duplicadas.

**Métrica:** El 100 % de las tareas críticas interrumpidas en pruebas deberá recuperarse, finalizar en un estado controlado o quedar identificada para intervención.

**Criterios de aceptación:**
- Se simula la interrupción de procesos.
- Se verifica la recuperación de tareas pendientes.
- No se generan pedidos duplicados.
- Se conserva la trazabilidad de las operaciones.

## 14. Observabilidad

### RNF-043 — Registro estructurado de errores

**Prioridad:** P1  
**Categoría:** Observabilidad

**Descripción:** Los servicios deberán generar registros estructurados que permitan identificar errores.

**Métrica:** El 100 % de los errores no controlados detectados por el servidor deberá generar un registro con identificador de correlación.

**Criterios de aceptación:**
- Los errores incluyen fecha y servicio.
- Se utiliza un identificador de correlación.
- No se registran contraseñas, tokens ni datos sensibles innecesarios.
- Los registros pueden consultarse por personal autorizado.

### RNF-044 — Monitoreo de operaciones críticas

**Prioridad:** P1  
**Categoría:** Observabilidad

**Descripción:** Se deberán monitorear las operaciones de programación, confirmación, pagos y entregas.

**Métrica:** El 100 % de los cuatro flujos críticos deberá contar con métricas de éxito, fallo y duración.

**Criterios de aceptación:**
- Se registran métricas por flujo.
- Se pueden identificar incrementos de errores.
- Se dispone de información para diagnosticar incidentes.

## 15. Requerimientos para versiones futuras

### RNF-045 — Alta disponibilidad avanzada

**Prioridad:** P2  
**Categoría:** Disponibilidad

**Descripción:** Incorporar redundancia de servicios e infraestructura para reducir interrupciones.

**Métrica:** Disponibilidad mensual objetivo del 99.9 %.

**Criterios de aceptación:**
- Se prueban mecanismos de conmutación ante fallos.
- Se mide la disponibilidad.
- Se documentan los componentes redundantes.

### RNF-046 — Escalabilidad ampliada

**Prioridad:** P2  
**Categoría:** Escalabilidad

**Descripción:** Permitir la operación con una cantidad significativamente mayor de usuarios y programaciones.

**Métrica:** Soportar al menos 1,000 usuarios concurrentes y 10,000 programaciones activas bajo un escenario de carga documentado.

**Criterios de aceptación:**
- Se ejecutan pruebas de carga ampliadas.
- Se verifican los tiempos de respuesta.
- Se documenta el costo de infraestructura.

### RNF-047 — Optimización avanzada de recursos

**Prioridad:** P3  
**Categoría:** Rendimiento

**Descripción:** Incorporar mecanismos avanzados de optimización de procesamiento y consumo de recursos.

**Métrica:** Reducir al menos un 20 % el consumo de recursos por operación frente a una línea base documentada, sin degradar los niveles de servicio.

**Criterios de aceptación:**
- Se establece una línea base.
- Se realizan mediciones comparativas.
- Se documentan las mejoras obtenidas.

### RNF-048 — Recuperación geográfica

**Prioridad:** P2  
**Categoría:** Recuperación

**Descripción:** Incorporar estrategias de recuperación ante fallos que afecten una región completa de infraestructura.

**Métrica:** Demostrar una restauración funcional en una región alternativa dentro del objetivo de recuperación definido para esa versión.

**Criterios de aceptación:**
- Existe una estrategia documentada.
- Se realizan simulacros.
- Se verifica la integridad de los datos restaurados.

## 16. Resumen de requerimientos

| Categoría | Identificadores | Cantidad |
|---|---|---:|
| Rendimiento | RNF-001 a RNF-005 | 5 |
| Seguridad | RNF-006 a RNF-011 | 6 |
| Disponibilidad | RNF-012 a RNF-014 | 3 |
| Escalabilidad | RNF-015 a RNF-017 | 3 |
| Accesibilidad y usabilidad | RNF-018 a RNF-021 | 4 |
| Compatibilidad | RNF-022 a RNF-023 | 2 |
| Privacidad | RNF-024 a RNF-027 | 4 |
| Confiabilidad | RNF-028 a RNF-031 | 4 |
| Pagos | RNF-032 a RNF-034 | 3 |
| Mantenibilidad | RNF-035 a RNF-038 | 4 |
| Recuperación | RNF-039 a RNF-042 | 4 |
| Observabilidad | RNF-043 a RNF-044 | 2 |
| Versiones futuras | RNF-045 a RNF-048 | 4 |
| **Total** | **RNF-001 a RNF-048** | **48** |

### Distribución por prioridad

| Prioridad | Cantidad |
|---|---:|
| P0 — Crítica | 20 |
| P1 — Alta | 24 |
| P2 — Media | 3 |
| P3 — Baja | 1 |
| **Total** | **48** |

Los 44 requerimientos P0 y P1 forman parte del alcance del MVP.

Los cuatro requerimientos P2 y P3 se consideran objetivos para versiones posteriores.

## 17. Estrategia de validación

Los requerimientos no funcionales deberán verificarse mediante pruebas específicas.

| Tipo de prueba | Requerimientos relacionados |
|---|---|
| Pruebas de carga | RNF-001 a RNF-005, RNF-015, RNF-017 |
| Pruebas de seguridad | RNF-006 a RNF-011 |
| Pruebas de disponibilidad | RNF-012 a RNF-014 |
| Pruebas de accesibilidad | RNF-018 a RNF-021 |
| Pruebas de compatibilidad | RNF-022 y RNF-023 |
| Revisiones de privacidad | RNF-024 a RNF-027 |
| Pruebas de concurrencia | RNF-028, RNF-031, RNF-033 |
| Pruebas de integración de pagos | RNF-032 a RNF-034 |
| Pruebas automatizadas | RNF-035 a RNF-038 |
| Pruebas de restauración | RNF-039 a RNF-042 |
| Pruebas de observabilidad | RNF-043 y RNF-044 |

Los resultados deberán conservarse como evidencia para evaluar el cumplimiento de los criterios de aceptación.

## 18. Dependencias y consideraciones técnicas

La implementación de los requerimientos dependerá de las decisiones de arquitectura y del stack tecnológico.

Se deberán considerar especialmente las siguientes relaciones:

- El rendimiento de las consultas dependerá de la estructura e índices de la base de datos.
- La confiabilidad de los pedidos recurrentes dependerá del mecanismo de programación y procesamiento de tareas.
- La disponibilidad dependerá de la infraestructura y los proveedores externos.
- La confirmación mediante notificaciones dependerá de las capacidades de cada plataforma.
- La seguridad de pagos dependerá de la integración y configuración del proveedor seleccionado.
- La recuperación de datos dependerá de las estrategias de respaldo y persistencia.
- La escalabilidad dependerá de la separación de responsabilidades y los mecanismos de procesamiento.

Los objetivos de rendimiento, disponibilidad y recuperación deberán revisarse durante el diseño técnico para comprobar su viabilidad con los recursos disponibles.

## 19. Conclusión

Los requerimientos no funcionales establecidos proporcionan criterios medibles para evaluar la calidad y confiabilidad de DietDelivery.

Su cumplimiento permitirá desarrollar una plataforma capaz de gestionar pedidos recurrentes, proteger información personal, procesar confirmaciones de manera segura y mantener operaciones consistentes ante fallos.

Durante el MVP se priorizarán los requisitos críticos de seguridad, integridad, confiabilidad y funcionamiento, mientras que las capacidades avanzadas de escalabilidad y alta disponibilidad se incorporarán progresivamente.

---

**DietDelivery — Planifica tu alimentación, confirma y recibe.**