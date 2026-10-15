# Requerimientos Funcionales del Sistema

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación

---

## 1. Introducción

El presente documento establece los requerimientos funcionales de DietDelivery, una plataforma digital de reparto de alimentos orientada a la personalización alimenticia, planificación de comidas y automatización de pedidos recurrentes.

Los requerimientos funcionales describen las operaciones, comportamientos y servicios que el sistema deberá proporcionar a sus diferentes actores.

La aplicación contará con cuatro roles principales:

- **USER:** usuario que realiza y programa pedidos.
- **RESTAURANT:** establecimiento que ofrece y prepara alimentos.
- **DELIVERY:** repartidor responsable de las entregas.
- **ADMIN:** administrador de la plataforma.

El sistema deberá permitir tanto pedidos convencionales como pedidos recurrentes, manteniendo la confirmación explícita del usuario antes de procesar cada compra.

## 2. Clasificación y prioridades

Los requerimientos se clasificarán según su prioridad de implementación.

| Prioridad | Descripción |
|---|---|
| P0 — Crítica | Funcionalidad indispensable para el funcionamiento del MVP. |
| P1 — Alta | Funcionalidad importante que deberá incluirse en el MVP. |
| P2 — Media | Funcionalidad prevista para una versión posterior. |
| P3 — Baja | Mejora opcional o evolución futura. |

**Estados de implementación:**

- Pendiente.
- En desarrollo.
- En pruebas.
- Completado.

Todos los requerimientos definidos en este documento se consideran pendientes de implementación hasta que exista evidencia de su desarrollo y validación.

## 3. Módulo de autenticación y cuentas

### RF-001 — Registro de usuarios

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema deberá permitir que una persona cree una cuenta mediante los datos de registro requeridos.

**Criterios de aceptación:**
- El formulario valida los campos obligatorios.
- No se permiten cuentas duplicadas con el mismo identificador de acceso.
- La contraseña se procesa de forma segura.
- El sistema informa si el registro se completó o falló.

### RF-002 — Inicio de sesión

**Prioridad:** P0  
**Actores:** Todos

**Descripción:** El sistema deberá autenticar a los actores mediante credenciales válidas.

**Criterios de aceptación:**
- Las credenciales correctas permiten iniciar sesión.
- Las credenciales incorrectas son rechazadas.
- Las cuentas suspendidas no pueden acceder a operaciones protegidas.
- El sistema identifica el rol autorizado.

### RF-003 — Cierre de sesión

**Prioridad:** P0  
**Actores:** Todos

**Descripción:** El sistema deberá permitir finalizar una sesión activa.

**Criterios de aceptación:**
- El usuario puede cerrar sesión.
- Las credenciales de sesión revocadas dejan de ser válidas.
- Los recursos protegidos requieren una nueva autenticación.

### RF-004 — Recuperación de acceso

**Prioridad:** P1  
**Actores:** Todos

**Descripción:** El sistema deberá proporcionar un mecanismo seguro para recuperar el acceso a una cuenta.

**Criterios de aceptación:**
- Se puede solicitar la recuperación.
- Los mecanismos de recuperación tienen vigencia limitada.
- No se revela si una cuenta existe mediante respuestas inseguras.
- Las credenciales anteriores se invalidan cuando corresponde.

### RF-005 — Administración del perfil propio

**Prioridad:** P1  
**Actores:** Todos

**Descripción:** Cada actor podrá consultar y modificar los datos de perfil que tenga autorizados.

**Criterios de aceptación:**
- Los cambios se guardan correctamente.
- Los datos se validan.
- No se pueden modificar perfiles ajenos sin autorización.

### RF-006 — Control de acceso por roles

**Prioridad:** P0  
**Actores:** Todos

**Descripción:** El sistema deberá autorizar las operaciones según el rol, la propiedad del recurso y el estado de la operación.

**Criterios de aceptación:**
- Los endpoints protegidos verifican permisos.
- Un actor no puede acceder a recursos privados ajenos.
- Las solicitudes no autorizadas son rechazadas.

## 4. Módulo de preferencias alimenticias

### RF-007 — Registro de preferencias

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá seleccionar categorías alimenticias de su preferencia.

**Criterios de aceptación:**
- Puede seleccionar múltiples categorías.
- Las preferencias se almacenan en su perfil.
- Puede consultarlas posteriormente.

### RF-008 — Registro de restricciones

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá registrar ingredientes, alérgenos y otras restricciones alimenticias.

**Criterios de aceptación:**
- Puede registrar múltiples restricciones.
- Puede modificar o eliminar restricciones.
- El sistema utiliza las restricciones para evaluar compatibilidad.
- Los productos con información insuficiente se identifican como no verificados y no se presentan como seguros.

### RF-009 — Actualización del perfil alimenticio

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá modificar sus preferencias y restricciones.

**Criterios de aceptación:**
- Los cambios se guardan correctamente.
- Las recomendaciones futuras utilizan la configuración actualizada.
- Los cambios no alteran retroactivamente pedidos confirmados.

### RF-010 — Consulta de información alimenticia

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El sistema mostrará la información de ingredientes y alérgenos declarada por los restaurantes.

**Criterios de aceptación:**
- Se muestra la información disponible.
- Se identifica cuando faltan datos.
- No se garantiza ausencia de contaminación cruzada.

## 5. Módulo de restaurantes y catálogo

### RF-011 — Consulta de restaurantes

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema permitirá explorar restaurantes disponibles para la dirección seleccionada.

**Criterios de aceptación:**
- Se muestran establecimientos disponibles en la zona de cobertura.
- Se puede consultar su información básica.
- Los establecimientos suspendidos no aparecen como opciones de compra.

### RF-012 — Consulta de menús

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema mostrará los productos publicados por los restaurantes.

**Criterios de aceptación:**
- Se visualizan nombres, descripciones y precios.
- Se identifica la disponibilidad.
- Se muestran categorías e información alimenticia disponible.

### RF-013 — Búsqueda y filtrado

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá buscar y filtrar restaurantes y platillos.

**Criterios de aceptación:**
- Puede buscar por nombre o categoría.
- Puede aplicar filtros alimenticios.
- Los resultados respetan la cobertura y disponibilidad.

### RF-014 — Recomendaciones por compatibilidad

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema recomendará restaurantes y platillos según las preferencias y restricciones registradas.

**Criterios de aceptación:**
- Se consideran categorías seleccionadas.
- Se consideran restricciones alimenticias.
- Se descartan opciones con incompatibilidades conocidas.
- La ausencia de información se comunica claramente.
- Las recomendaciones no se presentan como indicaciones médicas.

### RF-015 — Administración del catálogo

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante podrá registrar, editar y desactivar productos de su catálogo.

**Criterios de aceptación:**
- Se pueden crear productos con datos obligatorios.
- Se pueden modificar productos propios.
- No se pueden editar productos de otros establecimientos.
- Los productos desactivados dejan de ofrecerse para nuevos pedidos.

### RF-016 — Gestión de precios y disponibilidad

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante podrá actualizar precios y disponibilidad de sus productos.

**Criterios de aceptación:**
- Los cambios se reflejan en nuevas propuestas.
- Los productos agotados no pueden procesarse como disponibles.
- Los cambios no modifican importes de pedidos ya confirmados.

### RF-017 — Información de ingredientes

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante deberá registrar ingredientes y alérgenos conocidos de los productos que ofrece.

**Criterios de aceptación:**
- Se pueden registrar ingredientes y alérgenos.
- La información puede actualizarse.
- El sistema conserva la información utilizada para evaluar cada pedido confirmado.

## 6. Módulo de pedidos convencionales

### RF-018 — Creación de carrito

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá seleccionar productos de un restaurante y agregarlos a un carrito.

**Criterios de aceptación:**
- Se pueden agregar y retirar productos.
- Se pueden modificar cantidades.
- El sistema recalcula los importes.
- El MVP admite un restaurante por pedido.

### RF-019 — Resumen y cotización

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema deberá presentar el resumen y el costo total del pedido antes de confirmarlo.

**Criterios de aceptación:**
- Se muestra el subtotal.
- Se muestran costos de envío y cargos aplicables.
- Se muestra el total.
- Se identifica la dirección de entrega.
- Se informa cuando la cotización deja de ser válida.

### RF-020 — Confirmación de pedido convencional

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá confirmar un pedido convencional después de revisar sus condiciones.

**Criterios de aceptación:**
- Se requiere autorización válida.
- Se verifica disponibilidad y precio.
- No se generan pedidos duplicados por solicitudes repetidas.
- El sistema comunica el resultado.

## 7. Módulo de programaciones recurrentes

### RF-021 — Creación de programación fija

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá programar pedidos recurrentes con un restaurante y productos previamente seleccionados.

**Criterios de aceptación:**
- Se selecciona un restaurante.
- Se seleccionan productos y cantidades.
- Se establecen días y horarios.
- Se guarda la programación.
- La programación no realiza compras sin confirmación.

### RF-022 — Creación de programación por recomendaciones

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá programar pedidos recurrentes basados en categorías y preferencias, sin fijar obligatoriamente un platillo.

**Criterios de aceptación:**
- Se seleccionan categorías o criterios alimenticios.
- Se establecen días y horarios.
- El sistema genera una propuesta compatible.
- La propuesta se presenta al usuario antes de la compra.

### RF-023 — Configuración de días y horarios

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá definir la recurrencia temporal de sus pedidos.

**Criterios de aceptación:**
- Puede seleccionar uno o varios días de la semana.
- Puede establecer horarios.
- Se utiliza una zona horaria definida para la programación.
- Las ocurrencias se calculan sin duplicaciones.

### RF-024 — Consulta de programaciones

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá consultar sus programaciones recurrentes.

**Criterios de aceptación:**
- Se muestran las programaciones propias.
- Se identifica la modalidad de cada una.
- Se visualizan días, horarios y estado.

### RF-025 — Modificación de programaciones

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá modificar programaciones existentes.

**Criterios de aceptación:**
- Se pueden cambiar días y horarios.
- Se pueden modificar productos o criterios.
- Los cambios afectan ocurrencias futuras.
- No se modifican pedidos ya confirmados.

### RF-026 — Pausa y reactivación

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá pausar y reactivar sus programaciones.

**Criterios de aceptación:**
- Una programación pausada no genera nuevas propuestas.
- Puede reactivarse.
- El estado se conserva correctamente.

### RF-027 — Eliminación de programación

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá eliminar o desactivar definitivamente una programación.

**Criterios de aceptación:**
- Se solicita confirmación de la operación.
- No se generan nuevas propuestas.
- Los pedidos históricos permanecen registrados.

### RF-028 — Omisión de ocurrencias

**Prioridad:** P1  
**Actores:** USER

**Descripción:** El usuario podrá omitir una fecha específica sin eliminar toda la programación.

**Criterios de aceptación:**
- Se identifica la ocurrencia que se omitirá.
- No se genera una compra para esa ocurrencia.
- Las siguientes ocurrencias permanecen activas.

### RF-029 — Generación automática de propuestas

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema deberá detectar las ocurrencias programadas y generar propuestas de pedidos.

**Criterios de aceptación:**
- Se ejecuta en el horario correspondiente.
- Solo procesa programaciones activas.
- Cada ocurrencia produce como máximo una propuesta activa.
- Se registra el resultado del procesamiento.
- Una propuesta no equivale a una compra confirmada.

### RF-030 — Selección de recomendaciones recurrentes

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** Para programaciones variables, el sistema seleccionará una propuesta alimenticia compatible.

**Criterios de aceptación:**
- Se aplican preferencias y restricciones.
- Se considera disponibilidad y cobertura.
- Se presenta una propuesta concreta con restaurante y productos.
- Si no existen opciones válidas, se informa al usuario y no se crea un pedido.

## 8. Módulo de notificaciones y confirmación

### RF-031 — Notificación de propuesta programada

**Prioridad:** P0  
**Actores:** Sistema, USER

**Descripción:** El sistema enviará un aviso cuando exista una propuesta recurrente pendiente.

**Criterios de aceptación:**
- Se genera el evento de notificación.
- El aviso identifica la propuesta correspondiente.
- Se registra el resultado del intento de envío.
- La propuesta puede consultarse dentro de la aplicación.

### RF-032 — Confirmación dentro de la aplicación

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá revisar y confirmar una propuesta desde una pantalla de la aplicación.

**Criterios de aceptación:**
- Se muestran productos, restaurante, dirección y costo total.
- Se permite confirmar o rechazar.
- La autorización se valida en el servidor.
- Las propuestas expiradas no pueden confirmarse.

### RF-033 — Confirmación desde notificación interactiva

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El sistema permitirá confirmar propuestas desde notificaciones compatibles sin recorrer nuevamente el flujo de compra.

**Criterios de aceptación:**
- La notificación dispone de una acción de confirmación cuando el dispositivo lo permite.
- Se valida la identidad y autorización del usuario.
- Se comprueba la vigencia de la propuesta.
- Si se requiere autenticación o autorización adicional, se abre el flujo correspondiente.
- Una confirmación repetida no genera pedidos duplicados.

### RF-034 — Rechazo de propuestas

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá rechazar una propuesta recurrente.

**Criterios de aceptación:**
- La propuesta cambia a estado rechazado.
- No se crea un pedido.
- La programación futura permanece activa.

### RF-035 — Expiración de propuestas

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** Las propuestas tendrán un periodo de validez definido por las reglas de negocio.

**Criterios de aceptación:**
- Las propuestas no confirmadas expiran al finalizar su vigencia.
- No se realizan compras al expirar.
- El estado queda registrado.
- Las siguientes ocurrencias no se cancelan automáticamente.

### RF-036 — Revalidación antes de la compra

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** Antes de procesar una propuesta confirmada, el sistema verificará las condiciones de compra.

**Criterios de aceptación:**
- Se comprueba disponibilidad.
- Se verifica el precio vigente.
- Se verifica cobertura y dirección.
- Se comprueba la autorización de pago.
- Los cambios relevantes requieren nueva confirmación.
- No se realiza la compra si falla una validación obligatoria.

### RF-037 — Notificaciones de estado

**Prioridad:** P1  
**Actores:** USER, RESTAURANT, DELIVERY

**Descripción:** El sistema notificará eventos relevantes relacionados con pedidos y entregas.

**Criterios de aceptación:**
- Se informa sobre cambios importantes de estado.
- Las notificaciones respetan los permisos del destinatario.
- Se evita revelar información privada a terceros.

## 9. Módulo de procesamiento y pagos

### RF-038 — Creación segura de pedidos

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema creará pedidos únicamente a partir de solicitudes y confirmaciones válidas.

**Criterios de aceptación:**
- Cada pedido tiene un identificador único.
- Se registra el usuario y restaurante.
- Se conserva una copia de productos y precios confirmados.
- Se previenen duplicados mediante operaciones idempotentes.

### RF-039 — Integración de pagos

**Prioridad:** P0  
**Actores:** USER, Sistema

**Descripción:** El sistema deberá permitir validar pagos mediante un proveedor externo o un entorno de pruebas autorizado.

**Criterios de aceptación:**
- Se puede iniciar una operación de pago.
- Se registra su estado.
- Los fallos no se interpretan como pagos exitosos.
- No se almacenan datos completos de tarjetas.
- El sistema gestiona reintentos sin duplicar cobros.

### RF-040 — Consulta de pedidos

**Prioridad:** P0  
**Actores:** USER, RESTAURANT, DELIVERY, ADMIN

**Descripción:** Cada actor podrá consultar los pedidos correspondientes a su contexto autorizado.

**Criterios de aceptación:**
- El usuario consulta sus pedidos.
- El restaurante consulta pedidos de su establecimiento.
- El repartidor consulta la información necesaria de sus asignaciones.
- El administrador consulta operaciones dentro de sus permisos.

### RF-041 — Historial de pedidos

**Prioridad:** P1  
**Actores:** USER, RESTAURANT, DELIVERY

**Descripción:** El sistema mantendrá registros históricos de operaciones.

**Criterios de aceptación:**
- Se pueden consultar operaciones anteriores.
- Se muestran fechas, importes y estados correspondientes.
- Los actores no pueden consultar historiales ajenos.

### RF-042 — Cancelación de pedidos

**Prioridad:** P1  
**Actores:** USER, RESTAURANT, ADMIN

**Descripción:** El sistema permitirá solicitar y procesar cancelaciones según el estado del pedido y las reglas de negocio.

**Criterios de aceptación:**
- Se valida si el pedido puede cancelarse.
- Se registra el motivo.
- Se actualiza el estado.
- Se gestiona el reembolso cuando corresponda.
- Se notifica a los actores afectados.

## 10. Módulo de restaurantes

### RF-043 — Administración del establecimiento

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante podrá administrar su información operativa.

**Criterios de aceptación:**
- Puede actualizar datos autorizados.
- Puede definir horarios de operación.
- Puede establecer disponibilidad del establecimiento.
- No puede modificar información de otros restaurantes.

### RF-044 — Recepción de pedidos

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante recibirá los pedidos procesados que correspondan a su establecimiento.

**Criterios de aceptación:**
- Se muestran nuevos pedidos.
- Se incluyen productos y cantidades.
- Se presentan las instrucciones alimenticias necesarias.
- No se revelan datos privados innecesarios.

### RF-045 — Aceptación o rechazo

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante podrá aceptar o rechazar solicitudes de preparación.

**Criterios de aceptación:**
- Solo se pueden gestionar pedidos propios.
- El estado se actualiza correctamente.
- Los rechazos generan el flujo de resolución o reembolso correspondiente.
- El usuario recibe información sobre el resultado.

### RF-046 — Actualización de preparación

**Prioridad:** P0  
**Actores:** RESTAURANT

**Descripción:** El restaurante podrá actualizar el progreso de preparación.

**Criterios de aceptación:**
- Puede marcar un pedido como en preparación.
- Puede marcarlo como listo para recoger.
- Las transiciones se validan.
- Los actores correspondientes reciben actualizaciones.

## 11. Módulo de repartidores

### RF-047 — Asignación de entregas

**Prioridad:** P0  
**Actores:** Sistema, ADMIN

**Descripción:** El sistema deberá permitir asignar pedidos a repartidores habilitados mediante un mecanismo básico.

**Criterios de aceptación:**
- Solo se asignan repartidores habilitados.
- Se evita mantener asignaciones activas incompatibles.
- Se registra la asignación.
- El repartidor recibe información de la entrega.

### RF-048 — Consulta de entregas asignadas

**Prioridad:** P0  
**Actores:** DELIVERY

**Descripción:** El repartidor podrá consultar sus entregas asignadas.

**Criterios de aceptación:**
- Solo se muestran asignaciones autorizadas.
- Se presenta la ubicación del restaurante.
- Se muestra la dirección de entrega cuando corresponde.

### RF-049 — Confirmación de recolección

**Prioridad:** P0  
**Actores:** DELIVERY

**Descripción:** El repartidor podrá confirmar que recibió los productos del restaurante.

**Criterios de aceptación:**
- El pedido debe estar listo para recoger.
- El repartidor debe estar asignado.
- Se registra la recolección.
- El pedido cambia al estado correspondiente.

### RF-050 — Actualización del estado de entrega

**Prioridad:** P0  
**Actores:** DELIVERY

**Descripción:** El repartidor podrá actualizar el estado de la entrega.

**Criterios de aceptación:**
- Puede marcar el pedido como en camino.
- Puede confirmar la entrega.
- No puede modificar entregas ajenas.
- Se registra la fecha y hora de las actualizaciones.

### RF-051 — Reporte de incidencias

**Prioridad:** P1  
**Actores:** DELIVERY

**Descripción:** El repartidor podrá reportar problemas relacionados con una entrega.

**Criterios de aceptación:**
- Puede seleccionar o describir el problema.
- La incidencia queda vinculada a la entrega.
- El administrador puede consultarla.
- El estado de la entrega se gestiona según las reglas correspondientes.

## 12. Módulo de administración

### RF-052 — Gestión de cuentas

**Prioridad:** P0  
**Actores:** ADMIN

**Descripción:** El administrador podrá consultar y gestionar el estado de las cuentas.

**Criterios de aceptación:**
- Puede consultar cuentas registradas.
- Puede suspender o reactivar cuentas autorizadas.
- Las operaciones quedan auditadas.
- No puede consultar contraseñas ni credenciales sensibles.

### RF-053 — Gestión de restaurantes

**Prioridad:** P0  
**Actores:** ADMIN

**Descripción:** El administrador podrá revisar y habilitar establecimientos.

**Criterios de aceptación:**
- Puede consultar establecimientos.
- Puede aprobar o suspender su operación.
- Los restaurantes suspendidos no reciben nuevos pedidos.
- Los cambios quedan registrados.

### RF-054 — Gestión de repartidores

**Prioridad:** P0  
**Actores:** ADMIN

**Descripción:** El administrador podrá gestionar la habilitación de repartidores.

**Criterios de aceptación:**
- Puede consultar repartidores.
- Puede habilitar o suspender cuentas.
- Las cuentas suspendidas no reciben nuevas asignaciones.
- Las acciones quedan registradas.

### RF-055 — Supervisión de pedidos

**Prioridad:** P0  
**Actores:** ADMIN

**Descripción:** El administrador podrá consultar los pedidos y sus estados operativos.

**Criterios de aceptación:**
- Puede buscar pedidos autorizados.
- Puede consultar estados e incidencias.
- Las intervenciones administrativas quedan auditadas.
- No puede generar compras sin autorización del usuario.

### RF-056 — Gestión de incidencias

**Prioridad:** P1  
**Actores:** ADMIN

**Descripción:** El administrador podrá consultar y gestionar incidencias reportadas.

**Criterios de aceptación:**
- Se pueden consultar incidencias.
- Se puede actualizar su estado.
- Se registra el responsable y las acciones realizadas.

### RF-057 — Métricas operativas básicas

**Prioridad:** P1  
**Actores:** ADMIN

**Descripción:** El sistema mostrará indicadores básicos de funcionamiento.

**Criterios de aceptación:**
- Se muestran cantidades de pedidos por estado.
- Se muestran estadísticas básicas de establecimientos y entregas.
- La información se limita a los permisos administrativos.

## 13. Módulo de direcciones y cobertura

### RF-058 — Gestión de direcciones

**Prioridad:** P0  
**Actores:** USER

**Descripción:** El usuario podrá registrar y administrar direcciones de entrega.

**Criterios de aceptación:**
- Puede crear, modificar y eliminar direcciones.
- Puede seleccionar una dirección predeterminada.
- No puede administrar direcciones ajenas.

### RF-059 — Validación de cobertura

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema verificará si una dirección puede recibir pedidos de un restaurante determinado.

**Criterios de aceptación:**
- Se valida la zona de cobertura.
- No se procesan pedidos fuera de cobertura.
- Se informa al usuario cuando no existe servicio disponible.

### RF-060 — Horarios de operación

**Prioridad:** P0  
**Actores:** RESTAURANT, Sistema

**Descripción:** El sistema considerará los horarios de los establecimientos al generar y validar pedidos.

**Criterios de aceptación:**
- El restaurante puede registrar sus horarios.
- Las propuestas consideran los horarios publicados.
- No se procesan pedidos para horarios no admitidos.
- Las excepciones de disponibilidad pueden bloquear operaciones.

## 14. Módulo de integridad y auditoría

### RF-061 — Prevención de pedidos duplicados

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema deberá impedir que una misma operación de confirmación genere múltiples pedidos.

**Criterios de aceptación:**
- Se utilizan identificadores únicos de operación.
- Los reintentos no generan compras adicionales.
- Las operaciones concurrentes se controlan correctamente.

### RF-062 — Registro de eventos

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema registrará eventos importantes de pedidos, pagos, programaciones y cambios de estado.

**Criterios de aceptación:**
- Se registra el tipo de evento.
- Se registra la fecha y hora.
- Se identifica al actor responsable cuando corresponde.
- No se almacenan secretos ni datos sensibles innecesarios.

### RF-063 — Validación de transiciones

**Prioridad:** P0  
**Actores:** Sistema

**Descripción:** El sistema deberá controlar las transiciones permitidas de estados de pedidos y entregas.

**Criterios de aceptación:**
- Se rechazan transiciones inválidas.
- Se verifica el actor autorizado.
- Se conserva el historial de cambios relevantes.

## 15. Funcionalidades futuras

### RF-064 — Recomendaciones mediante inteligencia artificial

**Prioridad:** P2

El sistema podrá incorporar modelos de recomendación basados en preferencias, historial y patrones de consumo.

**Criterio de aceptación:** Las recomendaciones generadas respetan las restricciones declaradas y pueden ser revisadas antes de comprar.

### RF-065 — Seguimiento GPS en tiempo real

**Prioridad:** P2

El usuario podrá visualizar la ubicación del repartidor durante una entrega activa.

**Criterio de aceptación:** La ubicación se comparte únicamente durante el periodo autorizado.

### RF-066 — Optimización de rutas

**Prioridad:** P2

El sistema podrá calcular rutas de reparto considerando distancias y condiciones operativas.

**Criterio de aceptación:** Las rutas propuestas pueden utilizarse para organizar entregas sin perder la trazabilidad de asignaciones.

### RF-067 — Información nutricional avanzada

**Prioridad:** P2

La plataforma podrá presentar calorías, macronutrientes y otros datos nutricionales proporcionados por fuentes autorizadas.

**Criterio de aceptación:** La información identifica su origen y no se presenta como diagnóstico médico.

### RF-068 — Suscripciones y beneficios

**Prioridad:** P2

Se podrán incorporar suscripciones, descuentos y beneficios para usuarios recurrentes.

**Criterio de aceptación:** Los beneficios se calculan conforme a condiciones publicadas y aceptadas.

### RF-069 — Cuentas familiares

**Prioridad:** P3

Los usuarios podrán gestionar varios perfiles alimenticios dentro de una cuenta familiar.

**Criterio de aceptación:** Cada perfil conserva sus preferencias y restricciones de forma independiente.

### RF-070 — Roles internos de restaurante

**Prioridad:** P3

Los establecimientos podrán incorporar empleados con permisos específicos.

**Criterio de aceptación:** Cada empleado accede únicamente a las funciones autorizadas para su establecimiento.

### RF-071 — Programación inteligente

**Prioridad:** P2

El sistema podrá sugerir cambios de programación, sustituciones y alternativas ante problemas de disponibilidad.

**Criterio de aceptación:** Los cambios que afecten una compra requieren autorización del usuario.

### RF-072 — Integraciones externas

**Prioridad:** P3

La plataforma podrá integrarse con calendarios y herramientas de planificación alimenticia.

**Criterio de aceptación:** Las integraciones requieren autorización y permiten revocar el acceso.

### RF-073 — Calificaciones y reseñas

**Prioridad:** P2

Los usuarios podrán evaluar restaurantes y experiencias de entrega.

**Criterio de aceptación:** Solo se admiten reseñas vinculadas a experiencias de compra verificables.

## 16. Resumen de requerimientos

| Módulo | Identificadores | Cantidad |
|---|---|---:|
| Autenticación y cuentas | RF-001 a RF-006 | 6 |
| Preferencias alimenticias | RF-007 a RF-010 | 4 |
| Restaurantes y catálogo | RF-011 a RF-017 | 7 |
| Pedidos convencionales | RF-018 a RF-020 | 3 |
| Programaciones recurrentes | RF-021 a RF-030 | 10 |
| Notificaciones y confirmación | RF-031 a RF-037 | 7 |
| Procesamiento y pagos | RF-038 a RF-042 | 5 |
| Operaciones de restaurantes | RF-043 a RF-046 | 4 |
| Repartidores | RF-047 a RF-051 | 5 |
| Administración | RF-052 a RF-057 | 6 |
| Direcciones y cobertura | RF-058 a RF-060 | 3 |
| Integridad y auditoría | RF-061 a RF-063 | 3 |
| Funcionalidades futuras | RF-064 a RF-073 | 10 |
| **Total** | **RF-001 a RF-073** | **73** |

### Distribución por prioridad

| Prioridad | Cantidad |
|---|---:|
| P0 — Crítica | 43 |
| P1 — Alta | 20 |
| P2 — Media | 7 |
| P3 — Baja | 3 |
| **Total** | **73** |

Los requerimientos P0 y P1 conforman el alcance funcional del MVP. Los requerimientos P2 y P3 se reservarán para futuras versiones.

## 17. Dependencias funcionales

Los principales módulos presentan las siguientes dependencias:

1. La gestión de preferencias requiere cuentas de usuario.
2. Las recomendaciones requieren catálogos e información alimenticia.
3. Las programaciones requieren usuarios, direcciones y opciones alimenticias.
4. Las propuestas recurrentes requieren un sistema de programación y validación.
5. Las confirmaciones requieren propuestas vigentes y autenticación válida.
6. Los pedidos requieren validación de productos, precios y pagos.
7. La preparación requiere pedidos procesados y dirigidos al restaurante.
8. Las entregas requieren pedidos aceptados y una asignación válida.
9. La supervisión administrativa requiere registros operativos y controles de acceso.

Estas dependencias deberán considerarse al establecer el orden de desarrollo.

## 18. Condiciones generales de aceptación

Además de los criterios individuales, todos los requerimientos deberán cumplir las siguientes condiciones:

- Respetar los permisos definidos para cada actor.
- Validar los datos recibidos.
- Manejar errores de manera controlada.
- Proteger la información privada.
- Evitar operaciones duplicadas.
- Registrar eventos relevantes.
- Mantener consistencia entre los estados de los módulos.
- Contar con pruebas funcionales que demuestren su comportamiento esperado.

## 19. Conclusión

Los requerimientos funcionales establecidos definen el comportamiento esperado de DietDelivery y proporcionan una base para su diseño, implementación y validación.

El MVP se enfocará en la gestión de los cuatro actores, personalización alimenticia, pedidos convencionales, programaciones recurrentes, notificaciones, confirmaciones y entregas.

Las funcionalidades futuras permitirán evolucionar la plataforma hacia un sistema de recomendaciones y logística más avanzado, sin comprometer el alcance inicial.

---

**DietDelivery — Planifica tu alimentación, confirma y recibe.**