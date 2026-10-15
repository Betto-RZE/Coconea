# Reglas de Negocio del Sistema

**Proyecto:** Coconea  
**Versión:** 1.0  
**Estado:** Análisis y planificación  
**Alcance:** Producto Mínimo Viable (MVP)

---

## 1. Introducción

El presente documento establece las reglas de negocio de Coconea, una plataforma de reparto de alimentos que permite realizar pedidos convencionales y programar pedidos recurrentes de acuerdo con las preferencias y restricciones alimenticias de los usuarios.

Las reglas de negocio definen las condiciones, restricciones, validaciones y decisiones que gobiernan el comportamiento de la plataforma.

A diferencia de los requerimientos funcionales, que describen lo que el sistema debe hacer, las reglas de negocio establecen bajo qué condiciones puede realizarse cada operación.

Estas reglas serán utilizadas durante el diseño de la arquitectura, el modelo de datos, las APIs, las interfaces y las pruebas.

## 2. Objetivos

Este documento tiene los siguientes objetivos:

1. Establecer reglas claras para las operaciones de los cuatro actores.
2. Garantizar que ninguna compra recurrente se realice sin autorización.
3. Definir el funcionamiento de las programaciones fijas y por recomendaciones.
4. Establecer condiciones para pagos, cancelaciones y entregas.
5. Prevenir operaciones duplicadas o inconsistentes.
6. Mantener la integridad de los estados del sistema.
7. Proporcionar trazabilidad con los requerimientos funcionales y casos de uso.

## 3. Convenciones

### 3.1. Identificadores

Cada regla utilizará un identificador único con el formato `RN-XXX`.

### 3.2. Prioridades

| Prioridad | Descripción |
|---|---|
| P0 — Crítica | Regla indispensable para la operación segura del MVP. |
| P1 — Alta | Regla necesaria para completar el MVP. |
| P2 — Media | Regla prevista para versiones posteriores. |
| P3 — Baja | Mejora opcional. |

### 3.3. Estructura

Cada regla incluirá:

- Identificador.
- Nombre.
- Prioridad.
- Actores involucrados.
- Condición.
- Validación.
- Excepción.
- Trazabilidad con RF y CU.

Las reglas deberán aplicarse principalmente en el servidor. Las validaciones de interfaz no sustituyen los controles del sistema.

---

# 4. Reglas de identidad y acceso

### RN-001 — Identidad única de cuenta

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Se solicita registrar una cuenta.

**Regla:** No podrán existir dos cuentas activas con el mismo identificador de autenticación normalizado.

**Validación:** Comprobar unicidad antes de registrar y mediante una restricción de persistencia.

**Excepción:** Si la cuenta ya existe, se rechaza el registro sin modificarla.

**Trazabilidad:** RF-001, RF-002; CU-USR-01.

### RN-002 — Autenticación obligatoria

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Se intenta acceder a una operación protegida.

**Regla:** El actor deberá contar con una sesión válida.

**Validación:** Verificar credenciales y estado de sesión en el servidor.

**Excepción:** Se solicita autenticación si la sesión no es válida.

**Trazabilidad:** RF-002, RF-003, RF-006; CU-USR-02, CU-RES-01, CU-DEL-01, CU-ADM-01.

### RN-003 — Autorización por rol

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Un actor solicita una operación.

**Regla:** Solo podrá realizar acciones permitidas para su rol.

**Validación:** Comprobar permisos antes de ejecutar la operación.

**Excepción:** Las solicitudes no autorizadas se rechazan y se registran cuando corresponda.

**Trazabilidad:** RF-006; CU-USR-02, CU-RES-01, CU-DEL-01, CU-ADM-01.

### RN-004 — Propiedad de recursos

**Prioridad:** P0  
**Actores:** USER, RESTAURANT, DELIVERY  
**Condición:** Se solicita consultar o modificar información privada.

**Regla:** Los actores únicamente podrán acceder a los recursos propios o explícitamente asignados.

**Validación:** Verificar propietario, establecimiento o asignación.

**Excepción:** El administrador podrá acceder a información autorizada para supervisión.

**Trazabilidad:** RF-006, RF-040, RF-048; CU-USR-10, CU-RES-05, CU-DEL-02.

### RN-005 — Suspensión de cuentas

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Una cuenta cambia a estado suspendido.

**Regla:** La cuenta suspendida no podrá iniciar nuevas operaciones protegidas.

**Validación:** Verificar el estado de la cuenta en operaciones críticas.

**Excepción:** Las operaciones ya iniciadas deberán resolverse de forma controlada.

**Trazabilidad:** RF-002, RF-052, RF-053, RF-054; CU-ADM-02, CU-ADM-03, CU-ADM-04.

---

# 5. Reglas de preferencias y restricciones alimenticias

### RN-006 — Preferencias múltiples

**Prioridad:** P0  
**Actores:** USER  
**Condición:** El usuario configura su perfil alimenticio.

**Regla:** Podrá seleccionar varias categorías de alimentos.

**Validación:** Comprobar que las categorías existan en el catálogo permitido.

**Excepción:** Las categorías inválidas se rechazan.

**Trazabilidad:** RF-007; CU-USR-03.

### RN-007 — Restricciones alimenticias

**Prioridad:** P0  
**Actores:** USER  
**Condición:** El usuario registra ingredientes o alérgenos que desea evitar.

**Regla:** El sistema deberá considerar las restricciones al evaluar compatibilidad.

**Validación:** Comparar las restricciones con la información alimenticia declarada.

**Excepción:** Si la información es insuficiente, no se podrá afirmar que el producto es seguro.

**Trazabilidad:** RF-008, RF-014; CU-USR-03, CU-USR-04.

### RN-008 — Incompatibilidades conocidas

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se generan recomendaciones alimenticias.

**Regla:** No se recomendarán automáticamente productos con ingredientes incompatibles conocidos.

**Validación:** Comparar ingredientes y alérgenos con las restricciones aplicables.

**Excepción:** Los productos con información incompleta deberán identificarse como no verificados y no podrán seleccionarse automáticamente como compatibles.

**Trazabilidad:** RF-010, RF-014, RF-030; CU-USR-04, CU-SYS-03.

### RN-009 — Responsabilidad de información alimenticia

**Prioridad:** P0  
**Actores:** RESTAURANT  
**Condición:** Se publica o modifica un producto.

**Regla:** El restaurante será responsable de declarar correctamente los ingredientes y alérgenos conocidos.

**Validación:** Verificar que los campos requeridos estén completos o marcados explícitamente como información no disponible.

**Excepción:** La información incompleta impedirá presentar el producto como compatible de forma verificada.

**Trazabilidad:** RF-015, RF-017; CU-RES-03.

### RN-010 — Alcance de recomendaciones alimenticias

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** El sistema presenta recomendaciones.

**Regla:** Las recomendaciones son sugerencias de consumo basadas en datos declarados y no constituyen asesoramiento médico.

**Validación:** Las interfaces deberán evitar afirmaciones de seguridad médica o ausencia garantizada de contaminación cruzada.

**Excepción:** Las necesidades médicas deberán atenderse mediante profesionales competentes y confirmación directa con el establecimiento.

**Trazabilidad:** RF-010, RF-014; CU-USR-04.

### RN-011 — Actualización de preferencias

**Prioridad:** P1  
**Actores:** USER  
**Condición:** El usuario modifica su perfil alimenticio.

**Regla:** Los cambios se aplicarán a nuevas evaluaciones y propuestas futuras.

**Validación:** Utilizar la versión vigente del perfil cuando se genere una propuesta, respetando los criterios específicos de cada programación.

**Excepción:** Los pedidos confirmados conservarán su información histórica.

**Trazabilidad:** RF-009, RF-022, RF-030; CU-USR-03, CU-USR-07.

---

# 6. Reglas de restaurantes y catálogo

### RN-012 — Restaurante habilitado

**Prioridad:** P0  
**Actores:** RESTAURANT, ADMIN  
**Condición:** Se intenta ofrecer o procesar un pedido.

**Regla:** El establecimiento deberá estar habilitado administrativamente.

**Validación:** Verificar el estado del restaurante.

**Excepción:** Un restaurante suspendido no podrá recibir nuevos pedidos.

**Trazabilidad:** RF-011, RF-043, RF-053; CU-RES-02, CU-ADM-03.

### RN-013 — Producto disponible

**Prioridad:** P0  
**Actores:** RESTAURANT, USER  
**Condición:** Se intenta comprar un producto.

**Regla:** El producto deberá estar activo y disponible al confirmar.

**Validación:** Consultar su estado vigente.

**Excepción:** Los productos agotados o desactivados no podrán procesarse como disponibles.

**Trazabilidad:** RF-012, RF-016, RF-036; CU-USR-05, CU-RES-04.

### RN-014 — Precio vigente

**Prioridad:** P0  
**Actores:** RESTAURANT, USER  
**Condición:** Se prepara una cotización.

**Regla:** La cotización deberá utilizar los precios vigentes al momento de generarse.

**Validación:** Consultar los precios autorizados del catálogo.

**Excepción:** Los cambios posteriores a una autorización requerirán una nueva confirmación si afectan las condiciones económicas de la compra.

**Trazabilidad:** RF-016, RF-019, RF-036; CU-USR-05, CU-USR-09.

### RN-015 — Horarios del restaurante

**Prioridad:** P0  
**Actores:** RESTAURANT, SYSTEM  
**Condición:** Se genera o confirma una propuesta.

**Regla:** El establecimiento deberá estar disponible para atender el pedido en el horario correspondiente.

**Validación:** Comprobar horarios, excepciones y estado operativo.

**Excepción:** Si el restaurante no puede atenderlo, la propuesta no deberá procesarse.

**Trazabilidad:** RF-043, RF-060; CU-RES-02, CU-SYS-02.

### RN-016 — Cobertura de entrega

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se selecciona una dirección.

**Regla:** La dirección deberá encontrarse dentro de la zona de cobertura aplicable.

**Validación:** Evaluar dirección, restaurante y reglas de cobertura.

**Excepción:** Los pedidos fuera de cobertura serán rechazados antes del pago.

**Trazabilidad:** RF-058, RF-059; CU-USR-05, CU-SYS-02.

### RN-017 — Restaurante único por pedido

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Se agregan productos al carrito.

**Regla:** Cada pedido del MVP contendrá productos de un solo restaurante.

**Validación:** Verificar que todos los productos correspondan al mismo establecimiento.

**Excepción:** Al seleccionar otro restaurante, el usuario deberá iniciar un carrito independiente o confirmar el reemplazo del actual.

**Trazabilidad:** RF-018; CU-USR-05.

---

# 7. Reglas de programación recurrente

### RN-018 — Modalidades admitidas

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Se crea una programación.

**Regla:** El usuario deberá seleccionar una de dos modalidades: fija o por recomendaciones.

**Validación:** Verificar que la modalidad sea válida.

**Excepción:** Las modalidades no reconocidas serán rechazadas.

**Trazabilidad:** RF-021, RF-022; CU-USR-06, CU-USR-07.

### RN-019 — Programación fija

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Se configura una programación fija.

**Regla:** Deberán especificarse restaurante, productos, cantidades, días, horario y dirección.

**Validación:** Comprobar integridad de la configuración.

**Excepción:** Si falta información obligatoria, la programación no podrá activarse.

**Trazabilidad:** RF-021, RF-023; CU-USR-06.

### RN-020 — Programación por recomendaciones

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se configura una programación variable.

**Regla:** El usuario definirá criterios alimenticios y horarios; el sistema seleccionará posteriormente una propuesta concreta.

**Validación:** Verificar categorías, restricciones, días, horario y dirección.

**Excepción:** Si no existen opciones compatibles para una ocurrencia, se registrará sin generar compra.

**Trazabilidad:** RF-022, RF-030; CU-USR-07, CU-SYS-03.

### RN-021 — Días y horarios válidos

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Se configura una recurrencia.

**Regla:** La programación deberá contener al menos un día válido y un horario interpretable.

**Validación:** Verificar formato, calendario y zona horaria.

**Excepción:** Las configuraciones inválidas serán rechazadas.

**Trazabilidad:** RF-023; CU-USR-06, CU-USR-07.

### RN-022 — Estado activo

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Llega el momento de generar una ocurrencia.

**Regla:** Solo las programaciones activas podrán generar nuevas propuestas.

**Validación:** Verificar el estado antes de procesar.

**Excepción:** Las programaciones pausadas o eliminadas se omitirán.

**Trazabilidad:** RF-026, RF-029; CU-USR-08, CU-SYS-01.

### RN-023 — Modificaciones futuras

**Prioridad:** P1  
**Actores:** USER  
**Condición:** Se edita una programación.

**Regla:** Las modificaciones afectarán únicamente las ocurrencias futuras que todavía no se hayan convertido en pedidos confirmados.

**Validación:** Identificar las ocurrencias afectadas.

**Excepción:** Los pedidos ya confirmados conservarán sus condiciones.

**Trazabilidad:** RF-025; CU-USR-08.

### RN-024 — Omisión individual

**Prioridad:** P1  
**Actores:** USER  
**Condición:** El usuario omite una fecha programada.

**Regla:** Se omitirá únicamente la ocurrencia seleccionada.

**Validación:** Verificar propiedad y estado de la ocurrencia.

**Excepción:** No se podrá utilizar esta acción para cancelar un pedido ya confirmado.

**Trazabilidad:** RF-028; CU-USR-08.

### RN-025 — Una propuesta activa por ocurrencia

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se procesa una ocurrencia programada.

**Regla:** Una ocurrencia no podrá producir múltiples propuestas activas simultáneamente.

**Validación:** Utilizar una clave única por programación y ocurrencia.

**Excepción:** Los reintentos deberán recuperar o actualizar el resultado existente sin duplicarlo.

**Trazabilidad:** RF-029, RF-061; CU-SYS-01, CU-SYS-02, CU-SYS-03.

### RN-026 — Programar no significa comprar

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se crea o ejecuta una programación.

**Regla:** La programación solo autoriza generar propuestas; no autoriza realizar cargos automáticos.

**Validación:** Exigir confirmación explícita para cada compra.

**Excepción:** Ninguna configuración de programación del MVP podrá omitir esta autorización.

**Trazabilidad:** RF-021, RF-022, RF-029, RF-032; CU-USR-06, CU-USR-07, CU-USR-09.

---

# 8. Reglas de recomendaciones

### RN-027 — Compatibilidad obligatoria

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se genera una propuesta por recomendaciones.

**Regla:** La selección deberá respetar las restricciones alimenticias aplicables y evitar incompatibilidades conocidas.

**Validación:** Comparar restricciones con ingredientes y alérgenos declarados.

**Excepción:** Los productos sin información suficiente no se considerarán automáticamente compatibles.

**Trazabilidad:** RF-014, RF-030; CU-USR-04, CU-SYS-03.

### RN-028 — Disponibilidad y cobertura

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se evalúan restaurantes candidatos.

**Regla:** Solo se seleccionarán opciones que cumplan disponibilidad, horario y cobertura.

**Validación:** Consultar las condiciones vigentes.

**Excepción:** Si no hay candidatos válidos, se registra la ocurrencia sin propuesta de compra.

**Trazabilidad:** RF-011, RF-030, RF-059, RF-060; CU-SYS-03.

### RN-029 — Recomendaciones basadas en reglas

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se selecciona una recomendación para el MVP.

**Regla:** Las recomendaciones utilizarán filtros y reglas deterministas o configurables, sin requerir inteligencia artificial avanzada.

**Validación:** Comprobar que las opciones seleccionadas cumplen los criterios registrados.

**Excepción:** Los modelos avanzados de personalización se reservan para versiones futuras.

**Trazabilidad:** RF-014, RF-030, RF-064; CU-SYS-03.

### RN-030 — Propuesta concreta

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se genera una propuesta recurrente.

**Regla:** Antes de solicitar confirmación deberán identificarse restaurante, productos, cantidades, dirección e importe total.

**Validación:** Verificar la integridad de la propuesta.

**Excepción:** Las propuestas incompletas no podrán confirmarse.

**Trazabilidad:** RF-019, RF-030, RF-032; CU-USR-09, CU-SYS-03.

---

# 9. Reglas de confirmación y vigencia

### RN-031 — Confirmación explícita

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Se intenta convertir una propuesta en pedido.

**Regla:** Cada propuesta recurrente requerirá una confirmación válida del usuario.

**Validación:** Verificar identidad, propiedad, vigencia y autorización.

**Excepción:** Si no existe confirmación, no se procesa la compra.

**Trazabilidad:** RF-032, RF-033, RF-036; CU-USR-09, CU-SYS-06.

### RN-032 — Confirmación dentro de la aplicación

**Prioridad:** P0  
**Actores:** USER  
**Condición:** El usuario abre una propuesta pendiente.

**Regla:** Deberá poder revisar sus condiciones y confirmarla o rechazarla desde la aplicación.

**Validación:** Mostrar información completa y verificar la autorización.

**Excepción:** Las propuestas expiradas o inválidas no podrán confirmarse.

**Trazabilidad:** RF-032, RF-034; CU-USR-09.

### RN-033 — Confirmación mediante notificación

**Prioridad:** P0  
**Actores:** USER  
**Condición:** El dispositivo admite acciones interactivas.

**Regla:** El usuario podrá confirmar desde una notificación únicamente cuando la plataforma y las condiciones de seguridad lo permitan.

**Validación:** Verificar identidad, autorización, vigencia y condiciones económicas.

**Excepción:** Si se requiere autenticación adicional o revisión de cambios, se abrirá el flujo seguro dentro de la aplicación.

**Trazabilidad:** RF-031, RF-033; CU-USR-09, CU-SYS-04.

### RN-034 — Vigencia de propuestas

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se genera una propuesta.

**Regla:** Toda propuesta deberá tener una fecha y hora de expiración.

**Validación:** Comparar el momento de confirmación con el vencimiento almacenado.

**Excepción:** Una propuesta vencida se rechazará aunque el usuario conserve una notificación antigua.

**Trazabilidad:** RF-035; CU-SYS-05.

### RN-035 — Expiración sin compra

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Una propuesta vence sin confirmación.

**Regla:** Deberá cambiar a estado expirada sin crear pedidos ni cargos.

**Validación:** Verificar que no exista una confirmación válida previamente procesada.

**Excepción:** Las confirmaciones y expiraciones concurrentes deberán resolverse mediante una única transición válida.

**Trazabilidad:** RF-035, RF-061, RF-063; CU-SYS-05.

### RN-036 — Rechazo de propuestas

**Prioridad:** P0  
**Actores:** USER  
**Condición:** El usuario rechaza una propuesta.

**Regla:** El rechazo termina esa propuesta sin afectar automáticamente las siguientes ocurrencias.

**Validación:** Verificar propiedad y estado.

**Excepción:** Una propuesta ya confirmada no podrá rechazarse como sustituto de una cancelación.

**Trazabilidad:** RF-034; CU-USR-09.

### RN-037 — Revalidación antes del pago

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se recibe una confirmación.

**Regla:** Antes de procesar la compra deberán revalidarse precio, productos, disponibilidad, cobertura y autorización.

**Validación:** Comparar las condiciones vigentes con las aceptadas.

**Excepción:** Los cambios relevantes impedirán continuar hasta obtener nueva confirmación.

**Trazabilidad:** RF-036; CU-USR-09, CU-SYS-06.

### RN-038 — Autorización vinculada a condiciones

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se registra una autorización de compra.

**Regla:** La autorización deberá corresponder a una propuesta identificable y a condiciones económicas determinadas.

**Validación:** Verificar identificador, versión de cotización, importe, dirección y usuario.

**Excepción:** Una autorización anterior no podrá reutilizarse para aceptar condiciones diferentes.

**Trazabilidad:** RF-019, RF-032, RF-033, RF-036; CU-USR-09, CU-SYS-06.

---

# 10. Reglas de pagos

### RN-039 — Pago autorizado

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se solicita procesar un pedido.

**Regla:** No se iniciará un cobro sin una autorización de compra válida.

**Validación:** Comprobar la confirmación y el método de pago autorizado.

**Excepción:** Si la autorización es inválida, la operación se rechaza.

**Trazabilidad:** RF-020, RF-038, RF-039; CU-USR-05, CU-SYS-06.

### RN-040 — Idempotencia de cobros

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se reciben solicitudes repetidas.

**Regla:** Una misma operación lógica no podrá producir múltiples cobros.

**Validación:** Utilizar claves idempotentes y consultar el resultado previo.

**Excepción:** Si existe una operación en curso, se devuelve su estado sin iniciar un cobro independiente.

**Trazabilidad:** RF-039, RF-061; CU-SYS-06.

### RN-041 — Pago rechazado

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** El proveedor rechaza el pago.

**Regla:** El pedido no podrá considerarse pagado.

**Validación:** Verificar el estado informado por el proveedor.

**Excepción:** El usuario podrá iniciar una nueva autorización conforme a las reglas de vigencia.

**Trazabilidad:** RF-039; CU-USR-05, CU-SYS-06.

### RN-042 — Pago de resultado incierto

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se pierde la comunicación o se recibe una respuesta ambigua del proveedor.

**Regla:** El sistema no deberá asumir éxito ni fracaso sin evidencia suficiente.

**Validación:** Consultar o conciliar el estado mediante el identificador de operación.

**Excepción:** No se realizará un nuevo cobro independiente mientras exista incertidumbre sobre el anterior.

**Trazabilidad:** RF-039, RF-061, RF-062; CU-SYS-06.

### RN-043 — Protección de información de pago

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se registra o procesa un método de pago.

**Regla:** Coconea no almacenará directamente números completos de tarjetas ni códigos de seguridad.

**Validación:** Utilizar los mecanismos seguros del proveedor seleccionado.

**Excepción:** El MVP podrá utilizar un entorno de pruebas, sin procesar dinero real.

**Trazabilidad:** RF-039; CU-USR-05, CU-SYS-06.

---

# 11. Reglas de pedidos y cancelaciones

### RN-044 — Pedido con identificador único

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se crea un pedido.

**Regla:** Cada pedido deberá tener un identificador único y conservar sus condiciones confirmadas.

**Validación:** Aplicar restricciones de unicidad y almacenar el detalle histórico.

**Excepción:** Los reintentos recuperarán la operación existente.

**Trazabilidad:** RF-038, RF-061; CU-USR-05, CU-SYS-06.

### RN-045 — Cancelación condicionada por estado

**Prioridad:** P1  
**Actores:** USER, RESTAURANT, ADMIN  
**Condición:** Se solicita cancelar un pedido.

**Regla:** La cancelación dependerá del estado del pedido y de las condiciones aplicables.

**Validación:** Verificar solicitante, estado y política de cancelación.

**Excepción:** Una entrega completada no podrá cancelarse mediante el flujo ordinario.

**Trazabilidad:** RF-042, RF-063; CU-USR-10, CU-ADM-05.

### RN-046 — Cancelación y reembolso

**Prioridad:** P1  
**Actores:** SYSTEM, ADMIN  
**Condición:** Un pedido pagado se cancela y corresponde devolver dinero.

**Regla:** El reembolso deberá gestionarse mediante una operación identificable y rastreable.

**Validación:** Verificar importe elegible, estado de pago y operaciones de reembolso previas.

**Excepción:** Los reintentos no deberán producir reembolsos duplicados.

**Trazabilidad:** RF-039, RF-042, RF-062; CU-RES-06, CU-ADM-05.

### RN-047 — Conservación del historial

**Prioridad:** P1  
**Actores:** Todos  
**Condición:** Un pedido finaliza o se cancela.

**Regla:** Se conservará su historial operativo durante el periodo de retención aplicable.

**Validación:** Mantener eventos y datos históricos necesarios.

**Excepción:** Las solicitudes de eliminación de datos se resolverán conforme a las obligaciones legales de conservación.

**Trazabilidad:** RF-040, RF-041, RF-062; CU-USR-10, CU-DEL-08, CU-ADM-08.

---

# 12. Reglas de preparación y restaurantes

### RN-048 — Aceptación de pedidos

**Prioridad:** P0  
**Actores:** RESTAURANT  
**Condición:** El restaurante recibe un pedido pendiente.

**Regla:** Solo el establecimiento destinatario podrá aceptarlo o rechazarlo.

**Validación:** Verificar propiedad y estado del pedido.

**Excepción:** Los pedidos cancelados o previamente resueltos no podrán aceptarse nuevamente.

**Trazabilidad:** RF-044, RF-045; CU-RES-05, CU-RES-06.

### RN-049 — Preparación posterior a aceptación

**Prioridad:** P0  
**Actores:** RESTAURANT  
**Condición:** Se intenta iniciar la preparación.

**Regla:** El pedido deberá haber sido aceptado.

**Validación:** Comprobar la transición permitida.

**Excepción:** Se rechazan transiciones desde estados incompatibles.

**Trazabilidad:** RF-046, RF-063; CU-RES-07.

### RN-050 — Pedido listo para recoger

**Prioridad:** P0  
**Actores:** RESTAURANT  
**Condición:** Finaliza la preparación.

**Regla:** El restaurante deberá marcar el pedido como listo antes de que se registre su recolección.

**Validación:** Verificar el estado previo.

**Excepción:** No podrá registrarse la recolección de un pedido que todavía no está listo.

**Trazabilidad:** RF-046, RF-049, RF-063; CU-RES-08, CU-DEL-04.

---

# 13. Reglas de repartidores y entregas

### RN-051 — Repartidor habilitado

**Prioridad:** P0  
**Actores:** DELIVERY, ADMIN  
**Condición:** Se intenta asignar una entrega.

**Regla:** El repartidor deberá contar con una cuenta habilitada.

**Validación:** Verificar su estado administrativo.

**Excepción:** Los repartidores suspendidos no podrán recibir nuevas asignaciones.

**Trazabilidad:** RF-047, RF-054; CU-SYS-07, CU-ADM-04.

### RN-052 — Asignación válida

**Prioridad:** P0  
**Actores:** SYSTEM, ADMIN  
**Condición:** Se asigna un pedido.

**Regla:** Una entrega deberá tener como máximo un repartidor activo asignado simultáneamente.

**Validación:** Verificar asignaciones existentes y aplicar controles de concurrencia.

**Excepción:** Una reasignación deberá cerrar o revocar la asignación anterior antes de activar la nueva.

**Trazabilidad:** RF-047, RF-061; CU-SYS-07.

### RN-053 — Recolección autorizada

**Prioridad:** P0  
**Actores:** DELIVERY  
**Condición:** El repartidor confirma la recolección.

**Regla:** Solo el repartidor asignado podrá confirmar la recolección de un pedido listo.

**Validación:** Verificar asignación, identidad y estado.

**Excepción:** Se rechazan recolecciones duplicadas o no autorizadas.

**Trazabilidad:** RF-049, RF-063; CU-DEL-04.

### RN-054 — Confirmación de entrega

**Prioridad:** P0  
**Actores:** DELIVERY  
**Condición:** Se solicita finalizar una entrega.

**Regla:** La entrega deberá encontrarse en un estado válido y pertenecer al repartidor asignado.

**Validación:** Comprobar identidad, asignación y transición.

**Excepción:** No podrá completarse una entrega cancelada o previamente finalizada.

**Trazabilidad:** RF-050, RF-063; CU-DEL-06.

### RN-055 — Registro de incidencias

**Prioridad:** P1  
**Actores:** DELIVERY, ADMIN  
**Condición:** Ocurre un problema durante la entrega.

**Regla:** Las incidencias deberán registrarse y vincularse al pedido o entrega correspondiente.

**Validación:** Verificar que el actor tenga relación autorizada con la operación.

**Excepción:** Las incidencias no permitirán modificar estados arbitrariamente.

**Trazabilidad:** RF-051, RF-056; CU-DEL-07, CU-ADM-07.

---

# 14. Reglas de estados y consistencia

### RN-056 — Estados válidos de programación

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se modifica una programación.

**Regla:** Los estados permitidos serán activa, pausada y eliminada.

**Validación:** Verificar transiciones autorizadas.

**Excepción:** Una programación eliminada no podrá reactivarse mediante el flujo ordinario.

**Trazabilidad:** RF-026, RF-027, RF-063; CU-USR-08.

### RN-057 — Estados válidos de propuesta

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se actualiza una propuesta.

**Regla:** Los estados serán pendiente, en procesamiento, confirmada, rechazada, expirada y fallida.

**Validación:** Aplicar una máquina de estados controlada.

**Excepción:** Los estados finales no podrán regresar arbitrariamente a pendiente.

**Trazabilidad:** RF-032 a RF-036, RF-063; CU-USR-09, CU-SYS-05, CU-SYS-06.

### RN-058 — Estados de pedido

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Se actualiza un pedido.

**Regla:** El pedido deberá seguir transiciones compatibles con el procesamiento, aceptación, preparación y entrega.

**Estados operativos del MVP:**

1. Pendiente de procesamiento.
2. Pendiente de aceptación.
3. Aceptado.
4. En preparación.
5. Listo para recoger.
6. Recogido.
7. En camino.
8. Entregado.
9. Cancelado.

El estado de pago y el estado de asignación se gestionarán de forma independiente cuando corresponda.

**Validación:** Verificar transición, actor y estado previo.

**Excepción:** Se rechazarán saltos incompatibles.

**Trazabilidad:** RF-038, RF-045, RF-046, RF-050, RF-063; CU-SYS-08.

### RN-059 — Estados terminales

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Un recurso alcanza un estado final.

**Regla:** Los estados terminales no podrán modificarse mediante operaciones ordinarias incompatibles.

**Validación:** Verificar la máquina de estados.

**Excepción:** Las correcciones administrativas deberán utilizar procedimientos autorizados y auditados.

**Trazabilidad:** RF-062, RF-063; CU-SYS-08.

### RN-060 — Consistencia transaccional

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Una operación modifica varios recursos relacionados.

**Regla:** Los cambios deberán mantenerse consistentes incluso ante fallos parciales.

**Validación:** Utilizar mecanismos transaccionales, operaciones compensatorias o conciliación según corresponda.

**Excepción:** Si no puede completarse una operación, se registrará un estado controlado para recuperación.

**Trazabilidad:** RF-038, RF-039, RF-061, RF-062; CU-SYS-06, CU-SYS-08.

### RN-061 — Idempotencia de operaciones críticas

**Prioridad:** P0  
**Actores:** SYSTEM  
**Condición:** Se repite una solicitud crítica.

**Regla:** Los reintentos de generación de propuestas, confirmaciones, cobros y asignaciones no deberán producir efectos duplicados.

**Validación:** Utilizar identificadores únicos y controles de concurrencia.

**Excepción:** Se devolverá el resultado existente o el estado de procesamiento.

**Trazabilidad:** RF-029, RF-038, RF-039, RF-047, RF-061; CU-SYS-01, CU-SYS-06, CU-SYS-07.

---

# 15. Reglas de notificaciones

### RN-062 — Notificaciones informativas

**Prioridad:** P0  
**Actores:** USER, SYSTEM  
**Condición:** Se genera un evento notificable.

**Regla:** La notificación informa sobre una operación, pero no constituye una autorización por sí misma.

**Validación:** Separar el envío de la notificación del procesamiento de la compra.

**Excepción:** Los fallos de notificación no deberán generar pedidos.

**Trazabilidad:** RF-031, RF-037; CU-SYS-04.

### RN-063 — Disponibilidad dentro de la aplicación

**Prioridad:** P0  
**Actores:** USER  
**Condición:** Existe una propuesta pendiente.

**Regla:** La propuesta deberá poder consultarse dentro de la aplicación aunque la notificación no llegue.

**Validación:** Mantener la propuesta almacenada y accesible para su propietario durante su vigencia.

**Excepción:** Las propuestas expiradas podrán mostrarse como históricas, pero no confirmarse.

**Trazabilidad:** RF-031, RF-032; CU-USR-09, CU-SYS-04.

### RN-064 — Reintentos de notificación

**Prioridad:** P1  
**Actores:** SYSTEM  
**Condición:** Falla temporalmente un envío.

**Regla:** El sistema podrá reintentar la notificación mientras la propuesta siga vigente.

**Validación:** Verificar vigencia y resultado anterior.

**Excepción:** No se enviarán nuevas solicitudes de confirmación para propuestas expiradas.

**Trazabilidad:** RF-031, RF-035, RF-062; CU-SYS-04, CU-SYS-05.

---

# 16. Reglas administrativas y auditoría

### RN-065 — Gestión administrativa autorizada

**Prioridad:** P0  
**Actores:** ADMIN  
**Condición:** Se modifica el estado de una cuenta o establecimiento.

**Regla:** Solo los administradores autorizados podrán ejecutar estas operaciones.

**Validación:** Verificar permisos y registrar la acción.

**Excepción:** Las operaciones que excedan los permisos se rechazarán.

**Trazabilidad:** RF-052, RF-053, RF-054; CU-ADM-02, CU-ADM-03, CU-ADM-04.

### RN-066 — Auditoría de acciones críticas

**Prioridad:** P0  
**Actores:** Todos  
**Condición:** Se ejecuta una operación crítica.

**Regla:** Las confirmaciones, pagos, cambios administrativos y transiciones relevantes deberán dejar evidencia de auditoría.

**Validación:** Registrar actor, acción, fecha e identificador de recurso.

**Excepción:** Los registros no deberán almacenar credenciales ni secretos.

**Trazabilidad:** RF-062; CU-ADM-08, CU-SYS-08.

### RN-067 — Limitación de facultades administrativas

**Prioridad:** P0  
**Actores:** ADMIN  
**Condición:** Un administrador interviene en un pedido.

**Regla:** La supervisión administrativa no autoriza crear compras o cargos sin consentimiento válido del usuario.

**Validación:** Verificar la existencia de autorización antes de cualquier operación económica.

**Excepción:** Los procedimientos de corrección o reembolso deberán seguir sus reglas específicas.

**Trazabilidad:** RF-039, RF-055, RF-062; CU-ADM-05.

---

# 17. Parámetros configurables

Algunas reglas requieren valores operativos que todavía no se han definido definitivamente.

Estos parámetros deberán almacenarse o documentarse de forma centralizada y validarse antes de la puesta en producción.

| Parámetro | Valor inicial propuesto | Observación |
|---|---|---|
| Vigencia de propuesta | 15 minutos | Sujeto a pruebas de experiencia de usuario. |
| Días de recurrencia | Lunes a domingo | Configurables por usuario. |
| Zona horaria | Zona de la dirección o configuración explícita | Evitar depender de la hora del dispositivo. |
| Número de restaurantes por pedido | 1 | Restricción del MVP. |
| Confirmación por compra recurrente | Obligatoria | No configurable para omitirla. |
| Reintentos de notificación | Hasta 3 intentos elegibles | Sin exceder la vigencia. |
| Reintentos de pago | Según proveedor y estado | Siempre idempotentes. |
| Área de cobertura | Zona piloto definida | Pendiente de delimitación. |
| Política de cancelación | Pendiente de aprobación | Debe considerar estados y reembolsos. |
| Método de asignación | Básico | Sin optimización avanzada de rutas. |

Los valores propuestos no constituyen decisiones técnicas definitivas y podrán ajustarse antes de implementar el MVP.

---

# 18. Matriz de trazabilidad resumida

| Grupo | Reglas | RF principales | Casos de uso |
|---|---|---|---|
| Identidad y acceso | RN-001 a RN-005 | RF-001 a RF-006 | CU-USR-01/02, CU-ADM-01/04 |
| Preferencias alimenticias | RN-006 a RN-011 | RF-007 a RF-010, RF-014, RF-017 | CU-USR-03/04, CU-RES-03 |
| Restaurantes y catálogo | RN-012 a RN-017 | RF-011, RF-016, RF-018, RF-043, RF-059/060 | CU-RES-02/04, CU-USR-05 |
| Programaciones | RN-018 a RN-026 | RF-021 a RF-030 | CU-USR-06/08, CU-SYS-01/03 |
| Recomendaciones | RN-027 a RN-030 | RF-014, RF-019, RF-030 | CU-USR-04, CU-SYS-03 |
| Confirmaciones | RN-031 a RN-038 | RF-031 a RF-036, RF-061 | CU-USR-09, CU-SYS-04/06 |
| Pagos | RN-039 a RN-043 | RF-020, RF-038/039, RF-061 | CU-USR-05, CU-SYS-06 |
| Pedidos y cancelaciones | RN-044 a RN-047 | RF-038 a RF-042 | CU-USR-05/10, CU-ADM-05 |
| Preparación | RN-048 a RN-050 | RF-044 a RF-046, RF-049 | CU-RES-05/08 |
| Entregas | RN-051 a RN-055 | RF-047 a RF-051, RF-054/056 | CU-DEL-04/07, CU-SYS-07 |
| Estados y consistencia | RN-056 a RN-061 | RF-026/027, RF-038/039, RF-061/063 | CU-USR-08/09, CU-SYS-05/08 |
| Notificaciones | RN-062 a RN-064 | RF-031, RF-032, RF-035/037 | CU-USR-09, CU-SYS-04 |
| Administración y auditoría | RN-065 a RN-067 | RF-039, RF-052 a RF-055, RF-062 | CU-ADM-02/05/08 |

## 19. Criterios generales de validación

Las reglas de negocio se considerarán implementadas cuando:

1. Todas las operaciones protegidas verifiquen identidad y permisos.
2. Las recomendaciones respeten las restricciones alimenticias declaradas.
3. Los restaurantes y productos cumplan condiciones de disponibilidad.
4. Las programaciones se ejecuten en los horarios correspondientes.
5. Cada ocurrencia genere como máximo una propuesta activa.
6. Las propuestas incluyan información suficiente para decidir.
7. Los usuarios puedan confirmar dentro de la aplicación.
8. La confirmación por notificación funcione en plataformas compatibles.
9. Las propuestas rechazadas o expiradas no generen compras.
10. Los cambios relevantes requieran nueva autorización.
11. Los pagos y pedidos se procesen sin duplicaciones.
12. Las cancelaciones respeten las condiciones definidas.
13. Los restaurantes gestionen únicamente pedidos propios.
14. Los repartidores gestionen únicamente entregas asignadas.
15. Los administradores actúen dentro de sus permisos.
16. Los estados y registros mantengan consistencia ante fallos.

## 20. Conclusión

Las reglas de negocio definidas establecen las condiciones esenciales para el funcionamiento de Coconea.

El principio central de la plataforma es que la programación recurrente facilita la planificación de comidas, pero nunca sustituye la autorización explícita del usuario para realizar una compra.

Asimismo, las reglas garantizan la separación de responsabilidades entre usuarios, restaurantes, repartidores y administradores, y establecen mecanismos para proteger la integridad de pedidos, pagos y entregas.

Este documento servirá como referencia para el modelo de datos, la arquitectura, el diseño de APIs y las pruebas del MVP.

---

**Coconea — Planifica tu alimentación, confirma y recibe.**