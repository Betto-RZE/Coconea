# Actores y Roles del Sistema

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación

---

## 1. Introducción

DietDelivery es una plataforma de reparto de alimentos que conecta a usuarios, restaurantes y repartidores mediante un sistema centralizado de pedidos convencionales y recurrentes.

Para garantizar el funcionamiento organizado y seguro de la aplicación, se establecen cuatro actores principales, cada uno con responsabilidades y permisos específicos.

Los actores definidos son:

1. Usuario.
2. Restaurante.
3. Repartidor.
4. Administrador.

Cada actor tendrá acceso únicamente a las funcionalidades necesarias para desempeñar sus actividades dentro de la plataforma.

La gestión de permisos se basará en un modelo de control de acceso por roles (RBAC), complementado con validaciones de propiedad de los recursos y del estado de cada operación.

## 2. Modelo general de roles

| Código | Rol | Descripción |
|---|---|---|
| ROL-01 | USER | Cliente que consulta, programa y realiza pedidos de alimentos. |
| ROL-02 | RESTAURANT | Establecimiento que ofrece productos y administra pedidos. |
| ROL-03 | DELIVERY | Repartidor encargado de transportar pedidos. |
| ROL-04 | ADMIN | Responsable de la administración y supervisión general. |

Los códigos definidos serán identificadores lógicos de referencia y podrán adaptarse a las convenciones del stack tecnológico seleccionado.

### 2.1. Principios de autorización

El sistema deberá respetar los siguientes principios:

- **Mínimo privilegio:** cada actor contará únicamente con los permisos necesarios.
- **Autenticación obligatoria:** las operaciones privadas requerirán una sesión válida.
- **Separación de responsabilidades:** las funciones de cada actor estarán claramente delimitadas.
- **Control de propiedad:** los actores solo podrán modificar recursos propios o expresamente asignados.
- **Validación en el servidor:** las restricciones no dependerán exclusivamente de la interfaz.
- **Trazabilidad:** las operaciones relevantes deberán registrar información de auditoría.
- **Protección de información:** cada actor visualizará únicamente los datos necesarios para sus actividades.

## 3. Actor 1: Usuario

**Identificador:** ROL-01  
**Código:** USER  
**Descripción:** Persona que utiliza DietDelivery para descubrir alimentos, configurar preferencias, programar pedidos y recibir entregas.

### 3.1. Responsabilidades

- Mantener actualizada su información personal.
- Registrar direcciones de entrega válidas.
- Configurar sus preferencias y restricciones alimenticias.
- Seleccionar restaurantes y productos.
- Administrar sus programaciones recurrentes.
- Revisar las condiciones de compra antes de confirmar.
- Autorizar los pedidos que desea realizar.
- Proporcionar información necesaria para recibir las entregas.

### 3.2. Permisos

**Gestión de cuenta**

- Registrarse en la plataforma.
- Iniciar y cerrar sesión.
- Consultar y actualizar su perfil.
- Administrar sus direcciones.
- Cambiar sus credenciales mediante los mecanismos autorizados.

**Gestión alimenticia**

- Registrar categorías alimenticias preferidas.
- Registrar restricciones e ingredientes que desea evitar.
- Modificar sus preferencias.
- Consultar recomendaciones compatibles.
- Visualizar ingredientes y advertencias disponibles de los productos.

**Gestión de pedidos**

- Explorar restaurantes y menús.
- Crear pedidos convencionales.
- Consultar los detalles y costos de sus pedidos.
- Confirmar o rechazar propuestas recurrentes.
- Consultar el historial de pedidos.
- Solicitar cancelaciones conforme a las reglas establecidas.
- Consultar el estado de preparación y entrega.

**Gestión de programaciones**

- Crear programaciones recurrentes.
- Seleccionar restaurantes y platillos fijos.
- Configurar programaciones basadas en recomendaciones.
- Definir días y horarios.
- Modificar programaciones futuras.
- Pausar y reactivar programaciones.
- Eliminar programaciones.
- Omitir ocurrencias específicas.

**Notificaciones**

- Recibir avisos sobre pedidos programados.
- Confirmar pedidos desde la aplicación.
- Confirmar mediante notificaciones interactivas compatibles.
- Consultar propuestas pendientes.
- Administrar las preferencias de notificación disponibles.

### 3.3. Restricciones

El usuario no podrá:

- Acceder a información privada de otros usuarios.
- Modificar menús, precios o disponibilidad de restaurantes.
- Administrar cuentas de repartidores.
- Modificar estados internos de preparación o entrega.
- Consultar información administrativa restringida.
- Confirmar pedidos pertenecientes a otras cuentas.
- Procesar compras sin una autorización válida.
- Alterar directamente los precios calculados por el servidor.

### 3.4. Casos de uso principales

| Código | Caso de uso |
|---|---|
| CU-USR-01 | Registrar cuenta. |
| CU-USR-02 | Iniciar sesión. |
| CU-USR-03 | Administrar perfil alimenticio. |
| CU-USR-04 | Consultar restaurantes recomendados. |
| CU-USR-05 | Realizar pedido convencional. |
| CU-USR-06 | Crear programación recurrente fija. |
| CU-USR-07 | Crear programación mediante recomendaciones. |
| CU-USR-08 | Administrar programaciones. |
| CU-USR-09 | Confirmar o rechazar propuesta de pedido. |
| CU-USR-10 | Consultar seguimiento e historial. |

## 4. Actor 2: Restaurante

**Identificador:** ROL-02  
**Código:** RESTAURANT  
**Descripción:** Establecimiento registrado que ofrece alimentos y gestiona las solicitudes de preparación realizadas mediante DietDelivery.

### 4.1. Responsabilidades

- Mantener actualizada la información del establecimiento.
- Publicar productos y precios correctos.
- Declarar ingredientes y alérgenos conocidos.
- Mantener actualizada la disponibilidad de los alimentos.
- Atender las solicitudes de pedidos.
- Preparar los productos aceptados.
- Comunicar oportunamente los cambios de estado.
- Entregar los pedidos preparados al repartidor correspondiente.

### 4.2. Permisos

**Gestión del establecimiento**

- Acceder al panel del restaurante.
- Consultar y actualizar la información autorizada.
- Administrar horarios de atención.
- Configurar la disponibilidad operativa del establecimiento.

**Gestión de productos**

- Registrar nuevos platillos.
- Editar nombres, descripciones y precios.
- Clasificar productos por categorías.
- Registrar ingredientes y alérgenos.
- Marcar productos como disponibles o agotados.
- Desactivar productos del catálogo.

**Gestión de pedidos**

- Recibir solicitudes dirigidas a su establecimiento.
- Consultar los detalles necesarios para preparar pedidos.
- Aceptar o rechazar solicitudes según las reglas de negocio.
- Actualizar estados de preparación.
- Marcar pedidos como listos para recoger.
- Consultar el historial de pedidos de su establecimiento.

### 4.3. Restricciones

El restaurante no podrá:

- Consultar pedidos de otros establecimientos.
- Modificar cuentas privadas de clientes.
- Acceder a perfiles alimenticios completos de usuarios.
- Administrar repartidores ajenos al proceso de entrega.
- Modificar pedidos confirmados de manera unilateral.
- Acceder a información bancaria sensible.
- Crear compras en nombre de usuarios sin autorización.
- Modificar configuraciones generales de la plataforma.

El restaurante recibirá únicamente la información alimenticia necesaria para preparar el pedido y atender las restricciones declaradas.

### 4.4. Casos de uso principales

| Código | Caso de uso |
|---|---|
| CU-RES-01 | Iniciar sesión como restaurante. |
| CU-RES-02 | Administrar información del establecimiento. |
| CU-RES-03 | Administrar catálogo de productos. |
| CU-RES-04 | Actualizar precios y disponibilidad. |
| CU-RES-05 | Consultar pedidos recibidos. |
| CU-RES-06 | Aceptar o rechazar pedidos. |
| CU-RES-07 | Actualizar estado de preparación. |
| CU-RES-08 | Marcar pedido como listo para recoger. |

## 5. Actor 3: Repartidor

**Identificador:** ROL-03  
**Código:** DELIVERY  
**Descripción:** Persona responsable de recoger los pedidos preparados y transportarlos hasta la dirección de entrega indicada por el usuario.

### 5.1. Responsabilidades

- Mantener actualizada su información de contacto.
- Consultar las entregas asignadas.
- Recoger los pedidos correspondientes.
- Transportar los alimentos hasta su destino.
- Actualizar oportunamente el estado de las entregas.
- Confirmar la finalización de cada servicio.
- Reportar incidencias durante el reparto.

### 5.2. Permisos

**Gestión de cuenta**

- Iniciar y cerrar sesión.
- Consultar y actualizar información personal autorizada.
- Consultar el estado de su cuenta.

**Gestión de entregas**

- Consultar las entregas asignadas.
- Visualizar información necesaria del restaurante.
- Consultar la dirección de destino.
- Consultar instrucciones de entrega.
- Confirmar la recolección de pedidos.
- Marcar entregas como en camino.
- Confirmar entregas completadas.
- Reportar incidencias.
- Consultar el historial de sus entregas.

### 5.3. Restricciones

El repartidor no podrá:

- Consultar pedidos que no le hayan sido asignados.
- Acceder a perfiles alimenticios completos.
- Modificar precios o productos.
- Crear pedidos en nombre de usuarios.
- Alterar la información de los restaurantes.
- Modificar el estado de preparación de los alimentos.
- Asignarse entregas sin autorización del sistema.
- Acceder a información bancaria sensible.
- Consultar información administrativa restringida.

La dirección y los datos de contacto necesarios para una entrega solo estarán disponibles durante el periodo autorizado de la asignación.

### 5.4. Casos de uso principales

| Código | Caso de uso |
|---|---|
| CU-DEL-01 | Iniciar sesión como repartidor. |
| CU-DEL-02 | Consultar entregas asignadas. |
| CU-DEL-03 | Consultar información de recolección. |
| CU-DEL-04 | Confirmar recolección. |
| CU-DEL-05 | Actualizar estado de entrega. |
| CU-DEL-06 | Confirmar entrega completada. |
| CU-DEL-07 | Reportar incidencia. |
| CU-DEL-08 | Consultar historial de entregas. |

## 6. Actor 4: Administrador

**Identificador:** ROL-04  
**Código:** ADMIN  
**Descripción:** Responsable de supervisar y administrar las operaciones generales de DietDelivery.

### 6.1. Responsabilidades

- Supervisar el funcionamiento de la plataforma.
- Gestionar las cuentas y permisos autorizados.
- Revisar la información de los establecimientos.
- Supervisar la operación de los repartidores.
- Monitorear pedidos y entregas.
- Atender incidencias.
- Mantener controles de seguridad y auditoría.
- Aplicar las políticas operativas de la plataforma.

### 6.2. Permisos

**Gestión de usuarios**

- Consultar cuentas registradas.
- Revisar estados de cuentas.
- Suspender o reactivar cuentas cuando corresponda.
- Consultar información estrictamente necesaria para soporte.

**Gestión de restaurantes**

- Consultar establecimientos registrados.
- Aprobar, suspender o reactivar establecimientos.
- Revisar información y catálogos publicados.
- Supervisar pedidos asociados a establecimientos.

**Gestión de repartidores**

- Consultar cuentas de repartidores.
- Gestionar estados de habilitación.
- Supervisar asignaciones y entregas.
- Atender incidencias relacionadas con el reparto.

**Gestión de pedidos**

- Consultar operaciones registradas.
- Supervisar estados de pedidos.
- Revisar incidencias y cancelaciones.
- Ejecutar acciones administrativas autorizadas y auditadas.

**Administración general**

- Consultar métricas operativas básicas.
- Gestionar determinados parámetros del sistema.
- Revisar registros de auditoría autorizados.
- Supervisar el cumplimiento de reglas de negocio.

### 6.3. Restricciones

El administrador no podrá:

- Consultar contraseñas en texto plano.
- Acceder a datos completos de tarjetas bancarias.
- Realizar compras en nombre de usuarios sin autorización.
- Modificar registros históricos de manera arbitraria.
- Utilizar información personal fuera de sus funciones autorizadas.
- Omitir los controles de auditoría.
- Alterar autorizaciones de pago.
- Acceder indiscriminadamente a restricciones alimenticias privadas.

Las operaciones administrativas sensibles deberán registrarse para permitir su revisión posterior.

### 6.4. Casos de uso principales

| Código | Caso de uso |
|---|---|
| CU-ADM-01 | Iniciar sesión como administrador. |
| CU-ADM-02 | Consultar y gestionar usuarios. |
| CU-ADM-03 | Gestionar restaurantes. |
| CU-ADM-04 | Gestionar repartidores. |
| CU-ADM-05 | Supervisar pedidos. |
| CU-ADM-06 | Consultar entregas. |
| CU-ADM-07 | Gestionar incidencias. |
| CU-ADM-08 | Consultar registros de auditoría. |
| CU-ADM-09 | Consultar métricas operativas. |

## 7. Matriz de control de acceso

La siguiente matriz define los permisos generales de cada actor para las funcionalidades principales del MVP.

**Leyenda:**

- **P:** Permitido.
- **L:** Permitido con alcance limitado.
- **—:** No permitido.

| Funcionalidad | USER | RESTAURANT | DELIVERY | ADMIN |
|---|:---:|:---:|:---:|:---:|
| Administrar perfil propio | P | P | P | P |
| Gestionar direcciones de cliente | P | — | — | L |
| Gestionar preferencias alimenticias | P | — | — | — |
| Consultar catálogo público | P | P | L | P |
| Administrar menú | — | P | — | L |
| Actualizar disponibilidad | — | P | — | L |
| Crear pedido convencional | P | — | — | — |
| Crear programación recurrente | P | — | — | — |
| Modificar programación propia | P | — | — | — |
| Confirmar propuesta de compra | P | — | — | — |
| Consultar pedidos | L | L | L | L |
| Aceptar pedido como restaurante | — | P | — | — |
| Actualizar preparación | — | P | — | — |
| Consultar entregas asignadas | — | — | P | L |
| Actualizar estado de entrega | — | — | P | L |
| Administrar cuentas de usuarios | — | — | — | P |
| Habilitar restaurantes | — | — | — | P |
| Habilitar repartidores | — | — | — | P |
| Gestionar incidencias | L | L | L | P |
| Consultar métricas generales | — | — | — | P |
| Consultar auditoría | — | — | — | L |

### 7.1. Interpretación de permisos limitados

Los permisos marcados como limitados dependerán del contexto.

Ejemplos:

- Un usuario únicamente podrá consultar sus propios pedidos.
- Un restaurante únicamente podrá consultar pedidos asociados a su establecimiento.
- Un repartidor únicamente podrá consultar pedidos necesarios para sus entregas asignadas.
- Un administrador podrá consultar pedidos dentro de sus responsabilidades de supervisión.
- Las modificaciones administrativas de catálogos o entregas requerirán una causa justificada y un registro de auditoría.

## 8. Relaciones entre actores

Los cuatro actores interactuarán mediante los procesos operativos de DietDelivery.

### 8.1. Usuario y restaurante

El usuario consulta productos publicados por los restaurantes y realiza solicitudes de compra.

El restaurante recibe los pedidos confirmados, acepta las solicitudes correspondientes y prepara los alimentos.

### 8.2. Restaurante y repartidor

Cuando un pedido está listo para recogerse, el repartidor asignado recibe la información necesaria para acudir al establecimiento.

El restaurante entrega los productos y el repartidor confirma su recolección.

### 8.3. Repartidor y usuario

El repartidor transporta el pedido y realiza la entrega.

El usuario recibe los alimentos y puede consultar el estado del servicio.

### 8.4. Administrador y demás actores

El administrador supervisa el funcionamiento de los módulos y puede intervenir ante incidencias mediante acciones autorizadas.

## 9. Reglas de acceso para pedidos recurrentes

Debido a que los pedidos recurrentes representan la funcionalidad principal de DietDelivery, se establecen reglas específicas.

**RA-01. Propiedad de programación**

Cada programación recurrente pertenecerá a un usuario determinado.

**RA-02. Modificación de programación**

Únicamente el propietario podrá modificar o eliminar su programación mediante las funciones normales de usuario.

**RA-03. Generación de propuestas**

Las propuestas serán generadas por el sistema a partir de programaciones activas y válidas.

**RA-04. Confirmación de compra**

La confirmación de una propuesta solo podrá realizarla el usuario propietario mediante una sesión o mecanismo de autorización válido.

**RA-05. Confirmación desde notificaciones**

Las acciones de confirmación rápida deberán utilizar mecanismos seguros que permitan verificar la identidad y la autorización correspondiente.

**RA-06. Ausencia de confirmación**

Una propuesta rechazada o expirada no generará una compra.

**RA-07. Prevención de duplicados**

Cada propuesta solo podrá convertirse en un pedido mediante una operación válida e idempotente.

**RA-08. Cambios en el pedido**

Los cambios relevantes en productos, precio, disponibilidad o condiciones requerirán una nueva validación y, cuando corresponda, una nueva confirmación.

**RA-09. Acceso del restaurante**

Los restaurantes únicamente visualizarán pedidos efectivamente procesados y dirigidos a sus establecimientos.

**RA-10. Acceso del repartidor**

Los repartidores únicamente visualizarán la información de los pedidos que les hayan sido asignados.

## 10. Gestión de identidades y cuentas

### 10.1. Identidad individual

Cada persona que utilice la plataforma deberá contar con una identidad autenticable.

### 10.2. Asociación con establecimientos

Los restaurantes podrán representarse como entidades comerciales asociadas a cuentas autorizadas.

Para el MVP, se contempla una cuenta operativa principal por establecimiento.

La posibilidad de contar con varios empleados y diferentes niveles de permisos dentro de un mismo restaurante se considerará para versiones posteriores.

### 10.3. Roles múltiples

El MVP priorizará una experiencia operativa separada para cada rol.

La asignación de múltiples roles a una misma identidad podrá incorporarse posteriormente, siempre que se mantenga la separación de permisos y contextos.

### 10.4. Estados de cuenta

Las cuentas podrán contemplar estados como:

- Pendiente de verificación.
- Activa.
- Suspendida.
- Desactivada.

Las transiciones y condiciones específicas se definirán en las reglas de negocio.

## 11. Reglas generales de seguridad

### 11.1. Autenticación

Las operaciones privadas requerirán autenticación mediante mecanismos seguros.

### 11.2. Autorización

El backend verificará el rol, la propiedad del recurso y las condiciones de la operación antes de ejecutarla.

### 11.3. Protección de credenciales

Las contraseñas deberán almacenarse mediante algoritmos de hash adecuados y nunca en texto plano.

### 11.4. Protección de datos

La información personal y alimenticia deberá tratarse conforme a las políticas de privacidad y legislación aplicable.

### 11.5. Sesiones

Las sesiones deberán contar con mecanismos de expiración, revocación y protección frente a accesos no autorizados.

### 11.6. Auditoría

Las operaciones sensibles, como suspensiones de cuentas, cambios administrativos y confirmaciones de pedidos, deberán generar registros verificables.

### 11.7. Validación de operaciones

Los permisos deberán verificarse en cada solicitud relevante, independientemente de los controles visibles en la interfaz.

## 12. Funcionalidades de roles para versiones futuras

Se contemplan las siguientes ampliaciones:

### Restaurantes

- Múltiples empleados por establecimiento.
- Roles internos de gerente, cajero y cocina.
- Permisos configurables por sucursal.
- Administración de múltiples sucursales.

### Repartidores

- Administración avanzada de disponibilidad.
- Preferencias de zonas de reparto.
- Estadísticas de desempeño.
- Gestión avanzada de rutas.

### Administradores

- Roles de soporte y supervisión.
- Permisos administrativos granulares.
- Paneles de análisis avanzados.
- Flujos de aprobación para operaciones sensibles.

### Usuarios

- Cuentas familiares.
- Perfiles alimenticios para varios integrantes.
- Programaciones compartidas.
- Gestión de pedidos grupales.

## 13. Criterios de aceptación

| ID | Criterio |
|---|---|
| CR-01 | Cada actor puede autenticarse y acceder a sus funcionalidades permitidas. |
| CR-02 | Los permisos se validan desde el servidor. |
| CR-03 | Los usuarios no pueden consultar recursos privados de otros usuarios. |
| CR-04 | Los restaurantes no pueden administrar establecimientos ajenos. |
| CR-05 | Los repartidores no pueden consultar entregas no asignadas. |
| CR-06 | Los administradores cuentan con permisos de supervisión controlados. |
| CR-07 | Solo el propietario puede confirmar sus propuestas recurrentes. |
| CR-08 | Las confirmaciones duplicadas no generan múltiples pedidos. |
| CR-09 | Las operaciones administrativas sensibles quedan registradas. |
| CR-10 | Los datos personales se muestran únicamente a los actores autorizados. |
| CR-11 | Los cambios de estado se validan según el rol y las reglas de negocio. |
| CR-12 | Una cuenta suspendida no puede ejecutar operaciones protegidas. |

## 14. Conclusión

La definición de actores y roles establece las responsabilidades y los límites de acceso de los participantes de DietDelivery.

El modelo propuesto permitirá organizar las operaciones de la plataforma y desarrollar un sistema de autorización consistente con las necesidades de cada actor.

La combinación de permisos basados en roles, controles de propiedad, validaciones de estado y mecanismos de auditoría proporcionará las bases necesarias para implementar los módulos funcionales y proteger la información de la aplicación.

---

**DietDelivery — Planifica tu alimentación, confirma y recibe.**