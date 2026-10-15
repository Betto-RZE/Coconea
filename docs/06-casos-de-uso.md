# Casos de Uso del Sistema

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación  
**Alcance:** Producto Mínimo Viable (MVP)

---

## 1. Introducción

El presente documento describe los casos de uso de DietDelivery, una plataforma de reparto de alimentos que permite realizar pedidos convencionales y programar pedidos recurrentes según las preferencias y restricciones alimenticias de cada usuario.

Los casos de uso representan las interacciones entre los actores y el sistema para alcanzar objetivos específicos.

Se documentan los flujos principales, las alternativas, las excepciones y las condiciones necesarias para completar cada operación.

El propósito es establecer una referencia para el diseño de interfaces, servicios, APIs, base de datos y pruebas funcionales.

## 2. Actores del sistema

| Actor | Identificador | Responsabilidad |
|---|---|---|
| Usuario | USER | Configurar preferencias, realizar pedidos y administrar programaciones. |
| Restaurante | RESTAURANT | Administrar productos y preparar pedidos. |
| Repartidor | DELIVERY | Recoger y entregar pedidos asignados. |
| Administrador | ADMIN | Supervisar operaciones y gestionar incidencias. |
| Sistema | SYSTEM | Ejecutar procesos automáticos y validar operaciones. |

SYSTEM representa un componente interno automatizado y no constituye un quinto rol de usuario.

Los proveedores externos de pagos y notificaciones participan como sistemas secundarios cuando corresponde.

## 3. Convenciones

### 3.1. Identificadores

Los casos de uso utilizarán los siguientes prefijos:

- `CU-USR`: usuario.
- `CU-RES`: restaurante.
- `CU-DEL`: repartidor.
- `CU-ADM`: administrador.
- `CU-SYS`: procesos automáticos.

### 3.2. Prioridades

- **P0:** indispensable para el MVP.
- **P1:** importante para completar el MVP.
- **P2:** funcionalidad futura.
- **P3:** mejora opcional.

### 3.3. Estructura

Cada caso de uso incluirá:

- Identificador y nombre.
- Actor principal.
- Actores secundarios, cuando corresponda.
- Prioridad.
- Requerimientos relacionados.
- Precondiciones.
- Flujo principal.
- Flujos alternativos.
- Excepciones.
- Postcondiciones.

## 4. Casos de uso del usuario

### CU-USR-01 — Registrar cuenta

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-001

**Precondiciones:**
- El usuario no tiene una cuenta registrada con el mismo identificador.
- El servicio de registro está disponible.

**Flujo principal:**

1. El usuario accede al formulario de registro.
2. Introduce los datos solicitados.
3. El sistema valida los campos.
4. El sistema verifica que el identificador no esté registrado.
5. El usuario envía la solicitud.
6. El sistema crea la cuenta con rol USER.
7. El sistema informa que el registro fue exitoso.

**Flujos alternativos:**
- A1. El usuario corrige campos inválidos.
- A2. Se solicita una verificación adicional de contacto antes de activar la cuenta.

**Excepciones:**
- E1. El identificador ya está registrado.
- E2. Ocurre un error al almacenar la cuenta.

**Postcondiciones:**
- Se crea una cuenta válida o se informa el motivo del rechazo.

### CU-USR-02 — Iniciar sesión

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-002, RF-006

**Precondiciones:**
- Existe una cuenta registrada.

**Flujo principal:**

1. El usuario introduce sus credenciales.
2. El sistema valida la información.
3. Verifica el estado de la cuenta.
4. Crea una sesión autorizada.
5. Muestra la interfaz correspondiente.

**Flujos alternativos:**
- A1. El usuario utiliza el mecanismo de recuperación de acceso.

**Excepciones:**
- E1. Credenciales incorrectas.
- E2. Cuenta suspendida.
- E3. Error del servicio de autenticación.

**Postcondiciones:**
- El usuario dispone de una sesión válida o permanece sin autenticar.

### CU-USR-03 — Administrar perfil alimenticio

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-007, RF-008, RF-009, RF-010

**Precondiciones:**
- El usuario ha iniciado sesión.

**Flujo principal:**

1. El usuario accede a su perfil alimenticio.
2. Selecciona categorías de alimentos preferidas.
3. Registra ingredientes o alérgenos que desea evitar.
4. Guarda la configuración.
5. El sistema valida y almacena la información.
6. Las recomendaciones futuras consideran el perfil actualizado.

**Flujos alternativos:**
- A1. El usuario modifica preferencias existentes.
- A2. El usuario elimina una restricción.
- A3. El usuario deja categorías sin seleccionar.

**Excepciones:**
- E1. Información inválida.
- E2. Error al guardar los cambios.

**Postcondiciones:**
- El perfil alimenticio queda actualizado.

### CU-USR-04 — Consultar restaurantes recomendados

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-011, RF-012, RF-013, RF-014, RF-059, RF-060

**Precondiciones:**
- El usuario dispone de una dirección de entrega.
- Existen restaurantes registrados.

**Flujo principal:**

1. El usuario accede a las recomendaciones.
2. El sistema obtiene sus preferencias y restricciones.
3. Consulta restaurantes dentro de la cobertura.
4. Evalúa la compatibilidad de los productos.
5. Descarta opciones con incompatibilidades conocidas.
6. Presenta los restaurantes y platillos compatibles.
7. El usuario consulta los detalles de una opción.

**Flujos alternativos:**
- A1. El usuario aplica filtros adicionales.
- A2. El usuario consulta el catálogo sin preferencias configuradas.
- A3. Se muestran productos con información incompleta claramente identificados, sin presentarlos como seguros.

**Excepciones:**
- E1. No existen restaurantes disponibles.
- E2. No existen productos compatibles.
- E3. Error al consultar el catálogo.

**Postcondiciones:**
- El usuario visualiza las opciones disponibles o un mensaje explicativo.

### CU-USR-05 — Realizar pedido convencional

**Actor principal:** USER  
**Actores secundarios:** RESTAURANT, SYSTEM, proveedor de pagos  
**Prioridad:** P0  
**Requerimientos:** RF-018, RF-019, RF-020, RF-036, RF-038, RF-039, RF-059

**Precondiciones:**
- El usuario está autenticado.
- Tiene una dirección válida.
- Existen productos disponibles.

**Flujo principal:**

1. El usuario selecciona un restaurante.
2. Consulta su menú.
3. Agrega productos al carrito.
4. Ajusta cantidades.
5. Selecciona la dirección de entrega.
6. El sistema presenta el resumen y el precio total.
7. El usuario revisa las condiciones.
8. Confirma el pedido.
9. El sistema verifica disponibilidad, cobertura y precio.
10. El sistema inicia el procesamiento seguro del pago.
11. Se registra el pedido sin duplicaciones.
12. El pedido continúa hacia la gestión del restaurante.

**Flujos alternativos:**
- A1. El usuario modifica el carrito antes de confirmar.
- A2. Se actualiza la cotización y se solicita nueva confirmación.
- A3. El pago requiere una autorización adicional.

**Excepciones:**
- E1. Producto agotado.
- E2. Dirección fuera de cobertura.
- E3. Pago rechazado.
- E4. Error temporal del proveedor de pagos.
- E5. Solicitud duplicada.

**Postcondiciones:**
- Se registra un pedido válido o se informa que no pudo procesarse.
- No se generan cobros duplicados.

### CU-USR-06 — Crear programación recurrente fija

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-021, RF-023, RF-024, RF-060

**Precondiciones:**
- El usuario está autenticado.
- Tiene una dirección registrada.
- Existe un restaurante con productos seleccionables.

**Flujo principal:**

1. El usuario accede a programaciones.
2. Selecciona crear una nueva programación.
3. Elige la modalidad fija.
4. Selecciona un restaurante.
5. Selecciona productos y cantidades.
6. Define los días de repetición.
7. Establece el horario.
8. Selecciona la dirección de entrega.
9. Revisa el resumen de la programación.
10. Guarda y activa la programación.
11. El sistema calcula sus próximas ocurrencias.

**Flujos alternativos:**
- A1. El usuario guarda la programación en estado pausado.
- A2. Modifica productos antes de guardar.
- A3. Selecciona varios días de la semana.

**Excepciones:**
- E1. Horario inválido.
- E2. Restaurante no disponible para la configuración.
- E3. Dirección inválida.
- E4. Error al guardar.

**Postcondiciones:**
- Se registra una programación fija.
- No se crea ni cobra un pedido en ese momento.

### CU-USR-07 — Crear programación mediante recomendaciones

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-022, RF-023, RF-029, RF-030

**Precondiciones:**
- El usuario está autenticado.
- Existe un perfil alimenticio configurado.
- Tiene una dirección de entrega.

**Flujo principal:**

1. El usuario accede a programaciones.
2. Selecciona crear una programación.
3. Elige la modalidad de recomendaciones.
4. Selecciona categorías alimenticias.
5. Establece restricciones aplicables.
6. Define días y horarios.
7. Selecciona una dirección.
8. Revisa los criterios configurados.
9. Guarda y activa la programación.
10. El sistema registra los parámetros para generar futuras propuestas.

**Flujos alternativos:**
- A1. El usuario utiliza las preferencias de su perfil.
- A2. Agrega restricciones específicas para esa programación.
- A3. Configura varias categorías permitidas.

**Excepciones:**
- E1. Configuración inválida.
- E2. No existe una dirección válida.
- E3. Error de almacenamiento.

**Postcondiciones:**
- Se crea una programación de recomendaciones.
- La selección concreta del restaurante y platillo se realizará al generar cada propuesta.

### CU-USR-08 — Administrar programaciones

**Actor principal:** USER  
**Prioridad:** P1  
**Requerimientos:** RF-024, RF-025, RF-026, RF-027, RF-028

**Precondiciones:**
- El usuario está autenticado.
- Tiene una programación registrada.

**Flujo principal:**

1. El usuario consulta sus programaciones.
2. Selecciona una programación.
3. Consulta su modalidad, horarios y estado.
4. Selecciona una operación de administración.
5. El sistema valida la propiedad y el estado.
6. Aplica el cambio solicitado.
7. Actualiza las ocurrencias futuras cuando corresponde.

**Flujos alternativos:**
- A1. Modificar días y horarios.
- A2. Cambiar productos o criterios alimenticios.
- A3. Pausar una programación.
- A4. Reactivar una programación.
- A5. Eliminar una programación.
- A6. Omitir una ocurrencia específica.

**Excepciones:**
- E1. La programación pertenece a otro usuario.
- E2. El cambio afecta una operación ya confirmada.
- E3. Los nuevos parámetros son inválidos.

**Postcondiciones:**
- La programación queda actualizada.
- Los pedidos previamente confirmados conservan sus condiciones.

### CU-USR-09 — Confirmar o rechazar propuesta recurrente

**Actor principal:** USER  
**Actores secundarios:** SYSTEM, proveedor de pagos  
**Prioridad:** P0  
**Requerimientos:** RF-031, RF-032, RF-033, RF-034, RF-035, RF-036, RF-038, RF-039, RF-061

**Precondiciones:**
- Existe una propuesta pendiente y vigente.
- La propuesta pertenece al usuario.
- El usuario dispone de un mecanismo de autorización válido.

**Flujo principal: confirmación dentro de la aplicación**

1. El usuario recibe una notificación o consulta sus propuestas pendientes.
2. Abre el resumen de la propuesta.
3. Revisa restaurante, productos, cantidades, dirección y costo total.
4. Selecciona confirmar.
5. El sistema verifica identidad y propiedad.
6. Valida vigencia, disponibilidad, cobertura y precio.
7. Verifica la autorización de pago.
8. Procesa la operación de forma idempotente.
9. Registra el pedido.
10. Informa el resultado al usuario.

**Flujo alternativo A1: confirmación desde notificación**

1. El usuario recibe una notificación interactiva.
2. Consulta el resumen de compra mostrado.
3. Selecciona confirmar.
4. El sistema valida identidad, autorización y vigencia.
5. Si la información mostrada y las autorizaciones siguen siendo válidas, procesa la confirmación.
6. Informa el resultado sin exigir repetir la selección del restaurante y los productos.

**Flujo alternativo A2: autenticación adicional**

1. El usuario selecciona confirmar desde una notificación.
2. El sistema detecta que requiere autenticación o autorización adicional.
3. Abre el flujo seguro de confirmación.
4. El usuario completa la autorización.
5. El sistema continúa con las validaciones y el procesamiento.

**Flujo alternativo A3: rechazo**

1. El usuario selecciona rechazar.
2. El sistema valida la propiedad de la propuesta.
3. Registra el rechazo.
4. No crea un pedido.
5. Conserva las siguientes ocurrencias programadas.

**Excepciones:**
- E1. Propuesta expirada.
- E2. Producto agotado.
- E3. Precio o condiciones relevantes modificadas.
- E4. Dirección fuera de cobertura.
- E5. Pago rechazado.
- E6. Confirmación duplicada.
- E7. Fallo temporal de comunicación.

**Postcondiciones:**
- La propuesta queda confirmada, rechazada, expirada o pendiente de resolución.
- Solo una confirmación válida puede generar el pedido correspondiente.
- No se realiza una compra sin autorización.

### CU-USR-10 — Consultar seguimiento e historial

**Actor principal:** USER  
**Prioridad:** P0  
**Requerimientos:** RF-040, RF-041, RF-063

**Precondiciones:**
- El usuario está autenticado.
- Existe al menos un pedido asociado a su cuenta para consultar detalles.

**Flujo principal:**

1. El usuario accede a sus pedidos.
2. El sistema muestra pedidos actuales e históricos.
3. El usuario selecciona un pedido.
4. El sistema verifica su propiedad.
5. Muestra productos, importes y estado.
6. Presenta las actualizaciones de preparación y entrega disponibles.

**Flujos alternativos:**
- A1. El usuario filtra pedidos por estado.
- A2. Consulta un pedido cancelado.
- A3. Consulta su historial sin pedidos registrados.

**Excepciones:**
- E1. Pedido inexistente.
- E2. Acceso no autorizado.
- E3. Error al consultar información.

**Postcondiciones:**
- El usuario consulta la información autorizada sin modificar el pedido.

## 5. Casos de uso del restaurante

### CU-RES-01 — Iniciar sesión como restaurante

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-002, RF-006

**Precondiciones:**
- Existe una cuenta asociada a un establecimiento.

**Flujo principal:**

1. El restaurante introduce sus credenciales.
2. El sistema autentica la cuenta.
3. Verifica el rol y estado del establecimiento.
4. Habilita el panel correspondiente.

**Flujos alternativos:**
- A1. Recuperación de acceso.

**Excepciones:**
- E1. Credenciales incorrectas.
- E2. Cuenta suspendida.
- E3. Establecimiento no habilitado.

**Postcondiciones:**
- Se inicia una sesión autorizada o se rechaza el acceso.

### CU-RES-02 — Administrar información del establecimiento

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-043, RF-060

**Precondiciones:**
- El restaurante está autenticado.
- Tiene autorización sobre el establecimiento.

**Flujo principal:**

1. Accede a la configuración del establecimiento.
2. Consulta los datos actuales.
3. Modifica información autorizada.
4. Configura horarios de atención.
5. Guarda los cambios.
6. El sistema valida y actualiza la información.

**Flujos alternativos:**
- A1. Marcar el establecimiento temporalmente no disponible.
- A2. Modificar horarios especiales.

**Excepciones:**
- E1. Datos inválidos.
- E2. Acceso a establecimiento ajeno.

**Postcondiciones:**
- La información operativa queda actualizada.

### CU-RES-03 — Administrar catálogo de productos

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-015, RF-017

**Precondiciones:**
- El restaurante está autenticado.

**Flujo principal:**

1. Accede al catálogo.
2. Selecciona agregar producto.
3. Introduce nombre, descripción y categoría.
4. Registra precio, ingredientes y alérgenos.
5. Guarda el producto.
6. El sistema valida la información.
7. El producto queda registrado.

**Flujos alternativos:**
- A1. Editar producto existente.
- A2. Desactivar producto.
- A3. Actualizar información alimenticia.

**Excepciones:**
- E1. Campos obligatorios incompletos.
- E2. Precio inválido.
- E3. Intento de modificar productos ajenos.

**Postcondiciones:**
- El catálogo queda actualizado.

### CU-RES-04 — Actualizar precios y disponibilidad

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-016

**Precondiciones:**
- Existe un producto registrado en el establecimiento.

**Flujo principal:**

1. El restaurante selecciona un producto.
2. Modifica su precio o disponibilidad.
3. Guarda los cambios.
4. El sistema valida la operación.
5. Actualiza el catálogo.

**Flujos alternativos:**
- A1. Marcar producto agotado.
- A2. Reactivar producto.
- A3. Modificar múltiples productos de forma individual.

**Excepciones:**
- E1. Precio inválido.
- E2. Producto ajeno.
- E3. Error de actualización.

**Postcondiciones:**
- Las nuevas consultas utilizan la información actualizada.
- Los pedidos ya confirmados conservan sus importes históricos.

### CU-RES-05 — Consultar pedidos recibidos

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-040, RF-044

**Precondiciones:**
- El restaurante está autenticado.

**Flujo principal:**

1. Accede al panel de pedidos.
2. El sistema consulta pedidos del establecimiento.
3. Muestra pedidos pendientes y activos.
4. El restaurante selecciona uno.
5. Consulta productos, cantidades e instrucciones necesarias.

**Flujos alternativos:**
- A1. Filtrar por estado.
- A2. Consultar pedidos históricos.

**Excepciones:**
- E1. Pedido inexistente.
- E2. Acceso a pedido ajeno.

**Postcondiciones:**
- El restaurante consulta la información autorizada.

### CU-RES-06 — Aceptar o rechazar pedido

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-045, RF-063

**Precondiciones:**
- Existe un pedido dirigido al restaurante.
- El pedido está pendiente de aceptación.

**Flujo principal:**

1. El restaurante abre el pedido.
2. Revisa productos y cantidades.
3. Selecciona aceptar.
4. El sistema valida el estado.
5. Registra la aceptación.
6. El pedido pasa al flujo de preparación.

**Flujos alternativos:**
- A1. El restaurante rechaza el pedido e indica el motivo.
- A2. El sistema inicia la resolución o reembolso correspondiente.

**Excepciones:**
- E1. Pedido ya cancelado.
- E2. Pedido previamente gestionado.
- E3. Error de actualización.

**Postcondiciones:**
- El pedido queda aceptado o rechazado.
- Los actores afectados reciben la actualización correspondiente.

### CU-RES-07 — Actualizar estado de preparación

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-046, RF-063

**Precondiciones:**
- El pedido fue aceptado.

**Flujo principal:**

1. El restaurante consulta el pedido.
2. Selecciona iniciar preparación.
3. El sistema registra el nuevo estado.
4. El restaurante prepara los alimentos.
5. Se actualiza la información visible para el usuario.

**Flujos alternativos:**
- A1. Reportar una incidencia de preparación.

**Excepciones:**
- E1. Transición de estado inválida.
- E2. Pedido cancelado.
- E3. Falta de autorización.

**Postcondiciones:**
- El estado de preparación queda actualizado.

### CU-RES-08 — Marcar pedido como listo para recoger

**Actor principal:** RESTAURANT  
**Prioridad:** P0  
**Requerimientos:** RF-046, RF-047, RF-063

**Precondiciones:**
- El pedido fue aceptado y está en preparación.

**Flujo principal:**

1. El restaurante termina la preparación.
2. Selecciona listo para recoger.
3. El sistema valida la transición.
4. Registra el nuevo estado.
5. El sistema informa al repartidor asignado o habilita el proceso de asignación.

**Flujos alternativos:**
- A1. El pedido todavía no tiene repartidor asignado.
- A2. El restaurante reporta un retraso antes de marcarlo listo.

**Excepciones:**
- E1. Pedido cancelado.
- E2. Estado incompatible.
- E3. Error de actualización.

**Postcondiciones:**
- El pedido queda listo para recolección.

## 6. Casos de uso del repartidor

### CU-DEL-01 — Iniciar sesión como repartidor

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-002, RF-006

**Precondiciones:**
- Existe una cuenta de repartidor habilitada.

**Flujo principal:**

1. El repartidor introduce sus credenciales.
2. El sistema valida la identidad.
3. Verifica el rol y estado de cuenta.
4. Permite acceder al panel de entregas.

**Flujos alternativos:**
- A1. Recuperación de acceso.

**Excepciones:**
- E1. Credenciales inválidas.
- E2. Cuenta suspendida.

**Postcondiciones:**
- El repartidor accede a su panel o permanece sin autenticar.

### CU-DEL-02 — Consultar entregas asignadas

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-047, RF-048

**Precondiciones:**
- El repartidor está autenticado.

**Flujo principal:**

1. Accede a entregas asignadas.
2. El sistema consulta sus asignaciones.
3. Muestra las entregas activas.
4. El repartidor selecciona una.
5. Consulta el estado y la información autorizada.

**Flujos alternativos:**
- A1. No existen entregas asignadas.
- A2. Consultar entregas anteriores.

**Excepciones:**
- E1. Intento de consultar asignaciones ajenas.
- E2. Error de consulta.

**Postcondiciones:**
- El repartidor visualiza sus entregas autorizadas.

### CU-DEL-03 — Consultar información de recolección

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-048

**Precondiciones:**
- Existe una entrega asignada al repartidor.

**Flujo principal:**

1. Selecciona una entrega.
2. El sistema verifica la asignación.
3. Muestra el restaurante y su ubicación.
4. Presenta información necesaria para identificar el pedido.
5. El repartidor consulta las instrucciones de recolección.

**Flujos alternativos:**
- A1. Consultar indicaciones adicionales del restaurante.

**Excepciones:**
- E1. Asignación revocada.
- E2. Acceso no autorizado.

**Postcondiciones:**
- El repartidor dispone de la información necesaria para recoger el pedido.

### CU-DEL-04 — Confirmar recolección

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-049, RF-063

**Precondiciones:**
- El pedido está listo para recoger.
- La entrega está asignada al repartidor.

**Flujo principal:**

1. El repartidor llega al restaurante.
2. Recibe el pedido.
3. Selecciona confirmar recolección.
4. El sistema valida la asignación y el estado.
5. Registra la recolección.
6. Actualiza el estado de entrega.

**Flujos alternativos:**
- A1. El pedido aún no está preparado.
- A2. El repartidor reporta una incidencia.

**Excepciones:**
- E1. Pedido cancelado.
- E2. Asignación inválida.
- E3. Recolección previamente registrada.

**Postcondiciones:**
- El pedido queda registrado como recogido.

### CU-DEL-05 — Actualizar estado de entrega

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-050, RF-063

**Precondiciones:**
- El repartidor tiene una entrega activa.

**Flujo principal:**

1. Consulta la entrega.
2. Selecciona actualizar estado.
3. Marca el pedido como en camino.
4. El sistema valida la transición.
5. Guarda la actualización.
6. El usuario puede consultar el nuevo estado.

**Flujos alternativos:**
- A1. Reportar retraso o incidencia.
- A2. Consultar instrucciones de entrega.

**Excepciones:**
- E1. Entrega no asignada.
- E2. Estado incompatible.
- E3. Error de comunicación.

**Postcondiciones:**
- El estado de la entrega queda actualizado.

### CU-DEL-06 — Confirmar entrega completada

**Actor principal:** DELIVERY  
**Prioridad:** P0  
**Requerimientos:** RF-050, RF-063

**Precondiciones:**
- El pedido fue recogido.
- La entrega está activa.

**Flujo principal:**

1. El repartidor llega al destino.
2. Entrega los alimentos al destinatario.
3. Selecciona confirmar entrega.
4. El sistema verifica la asignación.
5. Registra la finalización.
6. Actualiza el pedido como entregado.

**Flujos alternativos:**
- A1. El destinatario no está disponible y se reporta una incidencia.
- A2. La entrega requiere información adicional.

**Excepciones:**
- E1. Asignación revocada.
- E2. Pedido previamente entregado.
- E3. Estado inválido.

**Postcondiciones:**
- La entrega queda finalizada y registrada en el historial.

### CU-DEL-07 — Reportar incidencia

**Actor principal:** DELIVERY  
**Prioridad:** P1  
**Requerimientos:** RF-051

**Precondiciones:**
- Existe una entrega asignada.

**Flujo principal:**

1. El repartidor selecciona reportar incidencia.
2. Elige el tipo de problema.
3. Proporciona una descripción.
4. Envía el reporte.
5. El sistema registra la incidencia.
6. El administrador puede consultarla.

**Flujos alternativos:**
- A1. Agregar información adicional al reporte.

**Excepciones:**
- E1. Entrega inexistente.
- E2. Información insuficiente.
- E3. Error de almacenamiento.

**Postcondiciones:**
- La incidencia queda registrada.

### CU-DEL-08 — Consultar historial de entregas

**Actor principal:** DELIVERY  
**Prioridad:** P1  
**Requerimientos:** RF-041

**Precondiciones:**
- El repartidor está autenticado.

**Flujo principal:**

1. Accede al historial.
2. El sistema consulta entregas anteriores.
3. Muestra fecha, estado e identificador de entrega.
4. El repartidor selecciona un registro.
5. Consulta la información histórica autorizada.

**Flujos alternativos:**
- A1. No existen entregas anteriores.

**Excepciones:**
- E1. Error de consulta.
- E2. Acceso a información no autorizada.

**Postcondiciones:**
- El historial queda disponible para consulta.

## 7. Casos de uso del administrador

### CU-ADM-01 — Iniciar sesión como administrador

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-002, RF-006

**Precondiciones:**
- Existe una cuenta administrativa habilitada.

**Flujo principal:**

1. El administrador introduce sus credenciales.
2. El sistema autentica la cuenta.
3. Verifica el rol ADMIN.
4. Permite acceder al panel administrativo.

**Flujos alternativos:**
- A1. Se solicita autenticación adicional cuando esté configurada.

**Excepciones:**
- E1. Credenciales incorrectas.
- E2. Cuenta suspendida.
- E3. Autorización insuficiente.

**Postcondiciones:**
- Se establece una sesión administrativa válida o se rechaza el acceso.

### CU-ADM-02 — Consultar y gestionar usuarios

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-052

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede a la administración de usuarios.
2. Consulta cuentas registradas.
3. Selecciona una cuenta.
4. Revisa la información autorizada.
5. Selecciona una acción administrativa.
6. El sistema valida los permisos.
7. Ejecuta y audita la acción.

**Flujos alternativos:**
- A1. Suspender cuenta.
- A2. Reactivar cuenta.
- A3. Consultar estado sin modificarlo.

**Excepciones:**
- E1. Cuenta inexistente.
- E2. Operación no autorizada.
- E3. Error de actualización.

**Postcondiciones:**
- La cuenta conserva o actualiza su estado con registro de auditoría.

### CU-ADM-03 — Gestionar restaurantes

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-053

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede al módulo de restaurantes.
2. Consulta establecimientos registrados.
3. Selecciona un establecimiento.
4. Revisa su información.
5. Aprueba, suspende o reactiva según corresponda.
6. El sistema registra la acción.

**Flujos alternativos:**
- A1. Consultar catálogo.
- A2. Revisar estado operativo sin modificarlo.

**Excepciones:**
- E1. Establecimiento inexistente.
- E2. Transición de estado no permitida.

**Postcondiciones:**
- El estado administrativo del establecimiento queda actualizado.

### CU-ADM-04 — Gestionar repartidores

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-054

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede al módulo de repartidores.
2. Consulta cuentas registradas.
3. Selecciona un repartidor.
4. Revisa su estado.
5. Ejecuta una acción autorizada.
6. El sistema guarda y audita el cambio.

**Flujos alternativos:**
- A1. Habilitar repartidor.
- A2. Suspender repartidor.
- A3. Consultar entregas asociadas.

**Excepciones:**
- E1. Cuenta inexistente.
- E2. Operación inválida.

**Postcondiciones:**
- El estado del repartidor queda actualizado.

### CU-ADM-05 — Supervisar pedidos

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-040, RF-055

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede al panel de pedidos.
2. Consulta operaciones registradas.
3. Aplica filtros.
4. Selecciona un pedido.
5. Revisa su estado e historial.
6. Consulta las incidencias asociadas.

**Flujos alternativos:**
- A1. Filtrar por restaurante.
- A2. Filtrar por estado.
- A3. Consultar un pedido cancelado.

**Excepciones:**
- E1. Pedido inexistente.
- E2. Error de consulta.

**Postcondiciones:**
- El administrador obtiene información para supervisión sin alterar el pedido.

### CU-ADM-06 — Consultar entregas

**Actor principal:** ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-047, RF-048, RF-055

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede al módulo de entregas.
2. Consulta las asignaciones registradas.
3. Selecciona una entrega.
4. Revisa el repartidor y el estado.
5. Consulta incidencias relacionadas.

**Flujos alternativos:**
- A1. Filtrar entregas activas.
- A2. Consultar entregas completadas.
- A3. Ejecutar una asignación administrativa autorizada.

**Excepciones:**
- E1. Entrega inexistente.
- E2. Operación no autorizada.

**Postcondiciones:**
- La información de la entrega queda disponible para supervisión.

### CU-ADM-07 — Gestionar incidencias

**Actor principal:** ADMIN  
**Prioridad:** P1  
**Requerimientos:** RF-056

**Precondiciones:**
- Existe una incidencia registrada.

**Flujo principal:**

1. El administrador accede a incidencias.
2. Selecciona un reporte.
3. Consulta su descripción.
4. Revisa la información relacionada.
5. Registra una acción de atención.
6. Actualiza el estado de la incidencia.

**Flujos alternativos:**
- A1. Solicitar información adicional.
- A2. Escalar la incidencia.
- A3. Marcarla como resuelta.

**Excepciones:**
- E1. Incidencia inexistente.
- E2. Transición de estado inválida.

**Postcondiciones:**
- La incidencia queda actualizada y auditada.

### CU-ADM-08 — Consultar registros de auditoría

**Actor principal:** ADMIN  
**Prioridad:** P1  
**Requerimientos:** RF-062

**Precondiciones:**
- El administrador cuenta con permiso de consulta de auditoría.

**Flujo principal:**

1. Accede a los registros autorizados.
2. Selecciona filtros de búsqueda.
3. El sistema consulta eventos.
4. Presenta fecha, operación y actor relacionado.
5. El administrador revisa los resultados.

**Flujos alternativos:**
- A1. Filtrar por tipo de operación.
- A2. Filtrar por periodo.

**Excepciones:**
- E1. Permiso insuficiente.
- E2. Error de consulta.

**Postcondiciones:**
- Se consultan registros sin modificarlos.

### CU-ADM-09 — Consultar métricas operativas

**Actor principal:** ADMIN  
**Prioridad:** P1  
**Requerimientos:** RF-057

**Precondiciones:**
- El administrador está autenticado.

**Flujo principal:**

1. Accede al panel de métricas.
2. Selecciona un periodo.
3. El sistema calcula o recupera indicadores.
4. Muestra pedidos por estado y datos operativos básicos.
5. El administrador consulta los resultados.

**Flujos alternativos:**
- A1. Cambiar el periodo.
- A2. Consultar una categoría específica.

**Excepciones:**
- E1. Datos no disponibles.
- E2. Error de procesamiento.

**Postcondiciones:**
- Se muestran indicadores de supervisión.

## 8. Casos de uso automáticos del sistema

### CU-SYS-01 — Detectar ocurrencias programadas

**Actor principal:** SYSTEM  
**Prioridad:** P0  
**Requerimientos:** RF-023, RF-029, RF-061

**Precondiciones:**
- Existen programaciones activas.
- El servicio de procesamiento está disponible.

**Flujo principal:**

1. El sistema consulta programaciones activas.
2. Identifica ocurrencias pendientes.
3. Verifica fecha, horario y zona horaria.
4. Comprueba que no se hayan procesado.
5. Registra las ocurrencias para generar propuestas.

**Flujos alternativos:**
- A1. No existen ocurrencias pendientes.
- A2. Una programación fue pausada antes de ejecutarse.

**Excepciones:**
- E1. Fallo de consulta.
- E2. Ejecución concurrente.
- E3. Interrupción del proceso.

**Postcondiciones:**
- Las ocurrencias válidas quedan identificadas sin duplicaciones.

### CU-SYS-02 — Generar propuesta fija

**Actor principal:** SYSTEM  
**Prioridad:** P0  
**Requerimientos:** RF-021, RF-029, RF-036

**Precondiciones:**
- Existe una ocurrencia válida de modalidad fija.

**Flujo principal:**

1. El sistema obtiene la programación.
2. Consulta restaurante y productos configurados.
3. Verifica disponibilidad, horarios y cobertura.
4. Calcula la cotización actual.
5. Registra una propuesta pendiente.
6. Solicita el envío de la notificación.

**Flujos alternativos:**
- A1. El precio cambió respecto a una ocurrencia anterior y se muestra el importe actualizado.
- A2. La propuesta requiere revisión adicional del usuario.

**Excepciones:**
- E1. Producto agotado.
- E2. Restaurante cerrado o suspendido.
- E3. Dirección fuera de cobertura.
- E4. Error al generar la propuesta.

**Postcondiciones:**
- Se crea una propuesta válida o se registra la imposibilidad de generarla.

### CU-SYS-03 — Generar propuesta mediante recomendaciones

**Actor principal:** SYSTEM  
**Prioridad:** P0  
**Requerimientos:** RF-014, RF-022, RF-029, RF-030

**Precondiciones:**
- Existe una ocurrencia válida de modalidad variable.
- La programación contiene criterios alimenticios.

**Flujo principal:**

1. El sistema obtiene los criterios de la programación.
2. Consulta restaurantes disponibles.
3. Filtra productos por categorías.
4. Evalúa restricciones e información alimenticia.
5. Descarta incompatibilidades conocidas.
6. Selecciona una opción válida.
7. Calcula la cotización.
8. Registra la propuesta.
9. Solicita una notificación al usuario.

**Flujos alternativos:**
- A1. Existen varias opciones compatibles y el sistema selecciona una mediante reglas de recomendación.
- A2. La información alimenticia es insuficiente y se evita presentar la opción como segura.

**Excepciones:**
- E1. No existen productos compatibles.
- E2. No existen restaurantes disponibles.
- E3. Fallo del servicio de recomendaciones.

**Postcondiciones:**
- Se registra una propuesta concreta o una ocurrencia sin opción disponible.
- No se genera una compra automáticamente.

### CU-SYS-04 — Enviar notificación de propuesta

**Actor principal:** SYSTEM  
**Actor secundario:** Proveedor de notificaciones  
**Prioridad:** P0  
**Requerimientos:** RF-031, RF-033, RF-062

**Precondiciones:**
- Existe una propuesta pendiente.

**Flujo principal:**

1. El sistema crea el evento de notificación.
2. Identifica los dispositivos autorizados.
3. Prepara el contenido correspondiente.
4. Solicita el envío al proveedor.
5. Registra el resultado conocido.
6. Mantiene la propuesta disponible dentro de la aplicación.

**Flujos alternativos:**
- A1. El dispositivo admite acciones interactivas.
- A2. El dispositivo requiere abrir la aplicación.
- A3. El usuario no tiene notificaciones habilitadas.

**Excepciones:**
- E1. Proveedor no disponible.
- E2. Token de dispositivo inválido.
- E3. Propuesta expirada antes del envío.

**Postcondiciones:**
- El intento queda registrado.
- No se realiza una compra por el simple envío de una notificación.

### CU-SYS-05 — Expirar propuesta no confirmada

**Actor principal:** SYSTEM  
**Prioridad:** P0  
**Requerimientos:** RF-035, RF-061, RF-063

**Precondiciones:**
- Existe una propuesta pendiente.
- Su plazo de confirmación ha finalizado.

**Flujo principal:**

1. El sistema identifica propuestas vencidas.
2. Verifica que no hayan sido confirmadas.
3. Cambia su estado a expirada.
4. Registra el evento.
5. Invalida nuevas confirmaciones de esa propuesta.

**Flujos alternativos:**
- A1. La propuesta ya fue rechazada.
- A2. La propuesta ya fue confirmada.

**Excepciones:**
- E1. Confirmación y expiración concurrentes.
- E2. Error temporal de almacenamiento.

**Postcondiciones:**
- La propuesta termina en un estado consistente.
- No se genera una compra sin confirmación.

### CU-SYS-06 — Validar y procesar confirmación

**Actor principal:** SYSTEM  
**Actores secundarios:** USER, proveedor de pagos  
**Prioridad:** P0  
**Requerimientos:** RF-036, RF-038, RF-039, RF-061, RF-063

**Precondiciones:**
- Existe una solicitud de confirmación.
- La propuesta está vigente.
- Se dispone de una autorización verificable.

**Flujo principal:**

1. El sistema valida identidad y propiedad.
2. Verifica el estado de la propuesta.
3. Comprueba disponibilidad y cobertura.
4. Valida precios y condiciones.
5. Comprueba la autorización de pago.
6. Reserva de forma lógica la operación mediante una clave idempotente.
7. Inicia o completa el procesamiento del pago.
8. Registra el pedido con los datos confirmados.
9. Actualiza la propuesta.
10. Informa el resultado.

**Flujos alternativos:**
- A1. Se requiere autenticación adicional.
- A2. El pago continúa pendiente.
- A3. Se recibe un reintento de la misma confirmación y se devuelve el resultado existente.

**Excepciones:**
- E1. Propuesta expirada.
- E2. Condiciones de compra modificadas.
- E3. Pago rechazado.
- E4. Respuesta tardía del proveedor.
- E5. Fallo de persistencia.

**Postcondiciones:**
- La operación queda completada o en un estado controlado.
- No se generan pedidos ni cobros duplicados.
- Los fallos parciales quedan disponibles para conciliación.

### CU-SYS-07 — Asignar repartidor

**Actor principal:** SYSTEM  
**Actores secundarios:** DELIVERY, ADMIN  
**Prioridad:** P0  
**Requerimientos:** RF-047, RF-048

**Precondiciones:**
- Existe un pedido aceptado que requiere entrega.
- Hay repartidores habilitados o se permite asignación administrativa.

**Flujo principal:**

1. El sistema identifica el pedido.
2. Consulta repartidores habilitados.
3. Verifica condiciones básicas de asignación.
4. Selecciona un repartidor elegible.
5. Registra la asignación.
6. Notifica al repartidor.

**Flujos alternativos:**
- A1. El administrador realiza una asignación autorizada.
- A2. No hay repartidores disponibles y el pedido queda pendiente de asignación.

**Excepciones:**
- E1. Repartidor suspendido.
- E2. Asignación concurrente incompatible.
- E3. Pedido cancelado.

**Postcondiciones:**
- Existe una asignación válida o un estado pendiente controlado.

### CU-SYS-08 — Gestionar cambios de estado

**Actor principal:** SYSTEM  
**Prioridad:** P0  
**Requerimientos:** RF-037, RF-062, RF-063

**Precondiciones:**
- Se solicita una transición de estado.

**Flujo principal:**

1. El sistema identifica el recurso.
2. Consulta su estado actual.
3. Verifica el actor responsable.
4. Valida la transición solicitada.
5. Actualiza el estado.
6. Registra el evento.
7. Genera las notificaciones correspondientes.

**Flujos alternativos:**
- A1. La transición ya fue aplicada y se devuelve el estado existente.
- A2. Una notificación falla, pero la transición válida permanece registrada.

**Excepciones:**
- E1. Transición no permitida.
- E2. Actor sin autorización.
- E3. Actualización concurrente incompatible.

**Postcondiciones:**
- El recurso conserva un estado válido y auditable.

## 9. Flujos integrales del MVP

### 9.1. Flujo de pedido convencional

1. USER consulta restaurantes.
2. USER selecciona productos.
3. SYSTEM calcula la cotización.
4. USER confirma.
5. SYSTEM valida y procesa el pedido.
6. RESTAURANT acepta y prepara.
7. SYSTEM asigna repartidor.
8. DELIVERY recoge el pedido.
9. DELIVERY realiza la entrega.
10. USER consulta el resultado.

### 9.2. Flujo de pedido recurrente fijo

1. USER configura restaurante, productos, días y horarios.
2. SYSTEM almacena la programación.
3. SYSTEM detecta la ocurrencia.
4. SYSTEM verifica condiciones y genera una propuesta.
5. SYSTEM envía una notificación.
6. USER confirma desde la notificación o dentro de la aplicación.
7. SYSTEM revalida y procesa el pedido.
8. RESTAURANT prepara los alimentos.
9. DELIVERY realiza la entrega.

### 9.3. Flujo de pedido recurrente mediante recomendaciones

1. USER configura categorías, restricciones, días y horarios.
2. SYSTEM almacena la programación.
3. SYSTEM detecta una ocurrencia.
4. SYSTEM busca opciones compatibles.
5. SYSTEM selecciona restaurante y platillos.
6. SYSTEM genera una propuesta con su cotización.
7. USER revisa y confirma o rechaza.
8. Si confirma, SYSTEM procesa el pedido.
9. RESTAURANT prepara.
10. DELIVERY entrega.

### 9.4. Flujo sin confirmación

1. SYSTEM genera una propuesta.
2. SYSTEM solicita la notificación.
3. USER no responde.
4. Finaliza el plazo de confirmación.
5. SYSTEM marca la propuesta como expirada.
6. No se crea un pedido.
7. Las futuras ocurrencias permanecen programadas.

## 10. Reglas comunes de excepción

### EX-01 — Pérdida de conectividad

Cuando se pierde la conexión durante una operación, el sistema deberá permitir consultar su resultado antes de repetirla.

### EX-02 — Solicitudes duplicadas

Los reintentos de confirmación deberán utilizar mecanismos idempotentes.

### EX-03 — Producto agotado

Si un producto deja de estar disponible, no se procesará una compra que dependa de él sin resolver la incompatibilidad.

### EX-04 — Cambio de precio

Cuando cambie una condición económica relevante respecto a la propuesta autorizada, se solicitará una nueva confirmación.

### EX-05 — Cuenta suspendida

Las cuentas suspendidas no podrán ejecutar operaciones protegidas.

### EX-06 — Pago incierto

Cuando el resultado de un pago sea desconocido, el sistema deberá verificarlo o conciliarlo antes de generar otro intento que pueda producir un cobro duplicado.

### EX-07 — Error de notificación

Un fallo en la entrega de una notificación no autoriza al sistema a realizar una compra.

### EX-08 — Concurrencia de estados

Las operaciones simultáneas deberán resolverse de manera que un recurso no termine en estados contradictorios.

## 11. Matriz de trazabilidad

La matriz relaciona los casos de uso documentados con los principales requerimientos funcionales del MVP.

| Caso de uso | Requerimientos RF |
|---|---|
| CU-USR-01 | RF-001 |
| CU-USR-02 | RF-002, RF-006 |
| CU-USR-03 | RF-007 a RF-010 |
| CU-USR-04 | RF-011 a RF-014, RF-059, RF-060 |
| CU-USR-05 | RF-018 a RF-020, RF-036, RF-038, RF-039, RF-059 |
| CU-USR-06 | RF-021, RF-023, RF-024, RF-060 |
| CU-USR-07 | RF-022, RF-023, RF-029, RF-030 |
| CU-USR-08 | RF-024 a RF-028 |
| CU-USR-09 | RF-031 a RF-036, RF-038, RF-039, RF-061 |
| CU-USR-10 | RF-040, RF-041, RF-063 |
| CU-RES-01 | RF-002, RF-006 |
| CU-RES-02 | RF-043, RF-060 |
| CU-RES-03 | RF-015, RF-017 |
| CU-RES-04 | RF-016 |
| CU-RES-05 | RF-040, RF-044 |
| CU-RES-06 | RF-045, RF-063 |
| CU-RES-07 | RF-046, RF-063 |
| CU-RES-08 | RF-046, RF-047, RF-063 |
| CU-DEL-01 | RF-002, RF-006 |
| CU-DEL-02 | RF-047, RF-048 |
| CU-DEL-03 | RF-048 |
| CU-DEL-04 | RF-049, RF-063 |
| CU-DEL-05 | RF-050, RF-063 |
| CU-DEL-06 | RF-050, RF-063 |
| CU-DEL-07 | RF-051 |
| CU-DEL-08 | RF-041 |
| CU-ADM-01 | RF-002, RF-006 |
| CU-ADM-02 | RF-052 |
| CU-ADM-03 | RF-053 |
| CU-ADM-04 | RF-054 |
| CU-ADM-05 | RF-040, RF-055 |
| CU-ADM-06 | RF-047, RF-048, RF-055 |
| CU-ADM-07 | RF-056 |
| CU-ADM-08 | RF-062 |
| CU-ADM-09 | RF-057 |
| CU-SYS-01 | RF-023, RF-029, RF-061 |
| CU-SYS-02 | RF-021, RF-029, RF-036 |
| CU-SYS-03 | RF-014, RF-022, RF-029, RF-030 |
| CU-SYS-04 | RF-031, RF-033, RF-062 |
| CU-SYS-05 | RF-035, RF-061, RF-063 |
| CU-SYS-06 | RF-036, RF-038, RF-039, RF-061, RF-063 |
| CU-SYS-07 | RF-047, RF-048 |
| CU-SYS-08 | RF-037, RF-062, RF-063 |

### 11.1. Requerimientos transversales

Los siguientes requerimientos se aplican a varios casos de uso y podrán validarse mediante pruebas complementarias:

- RF-003: cierre de sesión.
- RF-004: recuperación de acceso.
- RF-005: administración del perfil propio.
- RF-017: información alimenticia.
- RF-034: rechazo de propuestas.
- RF-037: notificaciones de estado.
- RF-042: cancelación de pedidos.
- RF-058: gestión de direcciones.
- RF-061: prevención de duplicados.
- RF-062: registro de eventos.
- RF-063: validación de transiciones.

Las operaciones de cierre de sesión, recuperación de acceso, cancelación de pedidos y administración de direcciones deberán contar con pruebas específicas, aunque se hayan agrupado como funcionalidades transversales.

## 12. Criterios de aceptación generales

Los casos de uso del MVP se considerarán correctamente implementados cuando:

1. Los cuatro actores puedan acceder a sus funciones autorizadas.
2. Los usuarios puedan configurar preferencias y restricciones alimenticias.
3. Los restaurantes puedan administrar sus productos.
4. Los usuarios puedan realizar pedidos convencionales.
5. Se puedan crear ambas modalidades de programación recurrente.
6. El sistema genere propuestas en los horarios correspondientes.
7. Las propuestas puedan confirmarse dentro de la aplicación.
8. Las notificaciones interactivas permitan confirmaciones rápidas en dispositivos compatibles.
9. Ninguna compra se procese sin autorización válida.
10. Las solicitudes duplicadas no generen múltiples pedidos o cobros.
11. Los restaurantes puedan gestionar la preparación.
12. Los repartidores puedan completar entregas asignadas.
13. Los administradores puedan supervisar las operaciones.
14. Los errores de disponibilidad, pagos y comunicación se manejen de forma controlada.
15. Los cambios importantes de estado queden registrados.

## 13. Relación con otros documentos

Este documento deberá utilizarse junto con:

- `01-descripcion-general.md`: contexto y funcionamiento del proyecto.
- `02-objetivos-y-alcance.md`: objetivos y límites del MVP.
- `03-actores-y-roles.md`: responsabilidades y permisos.
- `04-requerimientos-funcionales.md`: funcionalidades e identificadores RF.
- `05-requerimientos-no-funcionales.md`: criterios de calidad.
- `07-flujos-de-usuario.md`: recorridos e interacciones entre pantallas.
- `08-reglas-de-negocio.md`: restricciones y decisiones operativas.

## 14. Conclusión

Los casos de uso documentados describen las principales interacciones de DietDelivery y establecen una base verificable para el desarrollo de la aplicación.

Se ha priorizado el funcionamiento del MVP, especialmente la configuración alimenticia, las dos modalidades de programación recurrente, los dos mecanismos de confirmación y la coordinación entre usuarios, restaurantes y repartidores.

Los flujos y excepciones permitirán diseñar los componentes del sistema, identificar sus dependencias y construir pruebas que verifiquen el comportamiento esperado de cada operación.

---

**DietDelivery — Planifica tu alimentación, confirma y recibe.**