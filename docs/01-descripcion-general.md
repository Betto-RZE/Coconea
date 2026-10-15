# Descripción General del Proyecto

**Proyecto:** DietDelivery  
**Versión del documento:** 1.0  
**Estado:** Fase de análisis y planificación

---

## 1. Introducción

DietDelivery es una plataforma digital de reparto de alimentos enfocada en la planificación alimenticia y la automatización de pedidos recurrentes.

El proyecto surge como una alternativa a las aplicaciones tradicionales de entrega de comida, como DiDi Food o Rappi, incorporando herramientas que permiten a los usuarios organizar anticipadamente su alimentación y reducir el tiempo dedicado a realizar pedidos.

La plataforma permitirá establecer preferencias alimenticias, registrar restricciones de consumo, explorar restaurantes compatibles y configurar pedidos recurrentes de acuerdo con días y horarios específicos.

Su característica principal consiste en permitir que el usuario configure previamente sus pedidos y posteriormente pueda confirmarlos mediante una notificación, sin necesidad de repetir todo el proceso de selección y compra.

## 2. Planteamiento del problema

Las aplicaciones convencionales de reparto de alimentos están diseñadas principalmente para realizar pedidos individuales bajo demanda.

Aunque estas plataformas ofrecen una amplia variedad de restaurantes y productos, los usuarios deben repetir constantemente diversas acciones:

1. Acceder a la aplicación.
2. Buscar un restaurante.
3. Consultar su menú.
4. Seleccionar los alimentos.
5. Configurar el pedido.
6. Verificar los datos de entrega.
7. Confirmar la compra.

Este procedimiento puede resultar repetitivo para personas que mantienen hábitos alimenticios constantes o siguen planes de alimentación específicos.

Adicionalmente, la búsqueda manual de alimentos compatibles con determinadas preferencias o restricciones puede requerir tiempo y esfuerzo.

DietDelivery propone solucionar esta problemática mediante un sistema de planificación alimenticia y pedidos recurrentes con confirmación simplificada.

## 3. Descripción de la solución

DietDelivery permitirá a los usuarios crear un perfil alimenticio personalizado y utilizarlo para descubrir restaurantes y platillos compatibles con sus necesidades.

El sistema contará con herramientas para programar pedidos que se repetirán en fechas y horarios determinados.

Cuando llegue el momento de realizar un pedido programado, la plataforma enviará una notificación para solicitar la confirmación del usuario.

Una vez confirmado, el sistema verificará la disponibilidad, el precio y las condiciones del pedido, y continuará con su procesamiento mediante el restaurante y el servicio de reparto.

La plataforma buscará minimizar la intervención manual del usuario sin eliminar su control sobre las compras.

## 4. Características principales

### 4.1. Perfil alimenticio personalizado

Los usuarios podrán registrar información relacionada con sus preferencias alimenticias.

La configuración contemplará dos modalidades complementarias.

**Preferencias alimenticias:**

- Carnes.
- Pollo.
- Pescados y mariscos.
- Ensaladas.
- Verduras.
- Comida vegetariana.
- Comida vegana.
- Otras categorías disponibles.

**Restricciones alimenticias:**

- Ingredientes que el usuario desea evitar.
- Alérgenos declarados por el usuario.
- Restricciones relacionadas con tipos de alimentos.
- Preferencias de preparación.
- Otras restricciones configurables.

Esta información se utilizará para filtrar y recomendar opciones alimenticias.

Las recomendaciones se basarán en la información disponible de los restaurantes y no representarán una garantía médica o nutricional. Los usuarios deberán poder consultar los ingredientes y advertencias relevantes antes de confirmar sus pedidos.

### 4.2. Recomendaciones de restaurantes

El sistema mostrará restaurantes y platillos que coincidan con las preferencias del usuario.

Las recomendaciones podrán considerar:

- Categorías alimenticias.
- Restricciones registradas.
- Disponibilidad de productos.
- Ubicación y cobertura de entrega.
- Horarios de operación.
- Preferencias previamente seleccionadas.

El objetivo es facilitar el descubrimiento de opciones compatibles sin realizar búsquedas extensas.

### 4.3. Programación de pedidos recurrentes

Los usuarios podrán establecer planes de pedidos para determinados días y horarios.

La plataforma ofrecerá dos modalidades.

**Modalidad A: pedido recurrente fijo**

El usuario seleccionará previamente un restaurante y uno o varios platillos específicos.

Ejemplo:

- Lunes, miércoles y viernes.
- 2:00 p. m.
- Restaurante previamente seleccionado.
- Pechuga de pollo con verduras.

Cuando corresponda realizar el pedido, el sistema notificará al usuario para solicitar su confirmación.

**Modalidad B: pedido recurrente mediante recomendaciones**

El usuario programará una categoría o conjunto de preferencias alimenticias sin seleccionar obligatoriamente un platillo fijo.

Ejemplo:

- Martes y jueves.
- 3:00 p. m.
- Categoría: pescado.
- Restricción: sin ingredientes específicos indicados por el usuario.

El sistema buscará opciones compatibles y presentará una recomendación para su confirmación.

En ambas modalidades, el usuario conservará el control sobre la aceptación del pedido.

### 4.4. Notificaciones inteligentes

DietDelivery contará con un sistema de notificaciones que informará al usuario cuando corresponda realizar un pedido programado.

Las notificaciones podrán presentar información como:

- Restaurante.
- Platillo seleccionado o recomendado.
- Precio actualizado.
- Costo de envío y cargos aplicables.
- Dirección de entrega.
- Horario estimado.
- Opción para confirmar o rechazar el pedido.

El sistema permitirá dos métodos de confirmación:

**Confirmación rápida:** desde una notificación interactiva, cuando el dispositivo y el sistema operativo lo permitan y siempre que los datos y autorizaciones requeridos estén vigentes.

**Confirmación dentro de la aplicación:** mediante una pantalla donde el usuario podrá revisar y aceptar los detalles del pedido.

Si se requiere actualizar el pago, revisar un cambio de precio o completar una autorización adicional, el sistema dirigirá al usuario a la aplicación.

### 4.5. Procesamiento de pedidos

Después de recibir la confirmación del usuario, el sistema iniciará el proceso de compra.

Este proceso incluirá:

1. Validación de la disponibilidad de los productos.
2. Verificación de precios y condiciones.
3. Validación del método de pago autorizado.
4. Creación y procesamiento del pedido.
5. Envío de la solicitud al restaurante.
6. Preparación de los alimentos.
7. Asignación del servicio de reparto.
8. Entrega al usuario.

En caso de que algún producto no esté disponible o existan cambios que requieran autorización, el sistema deberá informar al usuario antes de continuar.

### 4.6. Gestión de programaciones

El usuario podrá administrar sus pedidos recurrentes mediante opciones para:

- Crear nuevas programaciones.
- Modificar días y horarios.
- Cambiar restaurantes o platillos.
- Pausar temporalmente una programación.
- Reactivar programaciones.
- Eliminar programaciones.
- Omitir una ocurrencia sin cancelar las siguientes.

### 4.7. Seguimiento de pedidos

Una vez realizado un pedido, el usuario podrá consultar su estado.

Los estados principales contemplados serán:

- Pendiente de confirmación.
- Confirmado.
- En procesamiento.
- Aceptado por el restaurante.
- En preparación.
- Listo para recoger.
- En camino.
- Entregado.
- Cancelado.

Los estados definitivos y sus transiciones serán documentados en las reglas de negocio.

## 5. Actores del sistema

DietDelivery contempla cuatro actores principales.

### 5.1. Usuario

Es la persona que utiliza la plataforma para gestionar su alimentación y solicitar productos a domicilio.

Sus principales actividades serán configurar preferencias, consultar recomendaciones, programar pedidos, confirmar compras y consultar entregas.

### 5.2. Restaurante

Es el establecimiento responsable de ofrecer los alimentos disponibles dentro de la plataforma.

Podrá administrar su catálogo, actualizar productos y precios, registrar información sobre ingredientes y restricciones, gestionar disponibilidad y procesar pedidos.

### 5.3. Repartidor

Es la persona encargada de transportar los pedidos desde los establecimientos hasta las direcciones indicadas por los usuarios.

Podrá gestionar entregas asignadas, consultar información necesaria para la entrega y actualizar su estado.

### 5.4. Administrador

Es el responsable de supervisar y administrar el funcionamiento general de DietDelivery.

Podrá gestionar cuentas, revisar establecimientos, supervisar operaciones, atender incidencias y controlar determinados parámetros del sistema.

Los permisos específicos de cada actor se documentarán por separado.

## 6. Funcionamiento general de la plataforma

El funcionamiento de DietDelivery se dividirá en cinco etapas.

### Etapa 1. Configuración inicial

El usuario crea su cuenta, registra sus direcciones de entrega y establece sus preferencias o restricciones alimenticias.

### Etapa 2. Exploración y selección

El sistema presenta restaurantes y platillos compatibles.

El usuario puede seleccionar productos específicos o utilizar recomendaciones basadas en sus preferencias.

### Etapa 3. Planificación

El usuario define los días y horarios de sus pedidos recurrentes, así como la modalidad de selección de alimentos.

### Etapa 4. Confirmación y procesamiento

Cuando llega el momento programado, el sistema prepara una propuesta de pedido y solicita la confirmación del usuario.

Si el usuario confirma y las condiciones del pedido son válidas, se procesa la compra.

Si rechaza la propuesta o no responde dentro del plazo establecido, no se realiza el pedido correspondiente.

### Etapa 5. Preparación y entrega

El restaurante recibe y prepara el pedido.

Posteriormente, un repartidor recoge los alimentos y realiza la entrega al usuario.

La plataforma permite consultar el estado del pedido durante el proceso.

## 7. Diferenciación frente a plataformas tradicionales

| Característica | Delivery tradicional | DietDelivery |
|---|---|---|
| Pedidos individuales | Sí | Sí |
| Pedidos recurrentes configurables | No siempre | Sí |
| Preferencias alimenticias persistentes | Variable | Sí |
| Restricciones alimenticias personalizadas | Variable | Sí |
| Recomendaciones según perfil alimenticio | Variable | Sí |
| Programación semanal | No siempre | Sí |
| Confirmación rápida de pedidos programados | No siempre | Sí |
| Selección automática de propuestas de comida | No siempre | Sí |

La principal diferencia de DietDelivery será su enfoque en la planificación y repetición de pedidos, en lugar de depender exclusivamente de compras individuales.

## 8. Público objetivo

La plataforma estará orientada principalmente a:

- Personas que siguen rutinas alimenticias.
- Usuarios que realizan pedidos frecuentes.
- Estudiantes y trabajadores con horarios establecidos.
- Personas que buscan reducir el tiempo dedicado a seleccionar alimentos.
- Usuarios con preferencias o restricciones alimenticias.
- Personas interesadas en organizar sus comidas semanalmente.

La aplicación no sustituirá la asesoría de profesionales de nutrición ni ofrecerá diagnósticos médicos.

## 9. Beneficios esperados

**Para los usuarios:**

- Menor tiempo dedicado a realizar pedidos.
- Mejor organización de horarios alimenticios.
- Acceso simplificado a opciones compatibles.
- Mayor comodidad para realizar compras recurrentes.
- Control sobre cada pedido antes de su procesamiento.

**Para los restaurantes:**

- Acceso a clientes con hábitos de compra recurrentes.
- Mayor visibilidad de productos compatibles con determinadas preferencias.
- Oportunidades de fidelización de clientes.
- Posibilidad de anticipar tendencias de demanda.

**Para los repartidores:**

- Acceso a solicitudes de entrega generadas mediante la plataforma.
- Herramientas para consultar y gestionar entregas asignadas.

**Para la administración:**

- Supervisión centralizada de operaciones.
- Gestión de los diferentes participantes.
- Herramientas para monitorear el servicio y resolver incidencias.

## 10. Consideraciones generales

El desarrollo de DietDelivery deberá contemplar aspectos importantes para garantizar una experiencia confiable.

Entre ellos se encuentran:

- Protección de datos personales y alimenticios.
- Gestión segura de pagos.
- Control de acceso según los roles.
- Disponibilidad y actualización de menús.
- Manejo de productos agotados.
- Confirmación explícita de compras.
- Prevención de pedidos duplicados.
- Gestión de errores y fallos de notificación.
- Compatibilidad con diferentes dispositivos.
- Manejo de cancelaciones y reembolsos.

La implementación específica de estos aspectos se definirá en los documentos técnicos correspondientes.

## 11. Estado actual del proyecto

Coconea se encuentra en fase de análisis y planificación.

Las funcionalidades descritas representan el comportamiento esperado de la plataforma y no implican que hayan sido implementadas.

Las siguientes etapas contemplan la definición de objetivos, alcance, requerimientos, casos de uso, reglas de negocio, arquitectura y tecnologías de desarrollo.

---

**DietDelivery — Planifica tu alimentación, confirma y recibe.**