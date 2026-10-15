# 14. Sistema de Diseño — Coconea

**Proyecto:** Coconea  
**Versión:** 1.0 (Versión Activa: Cálida, Artesanal & Café / Crema)  
**Estado:** Aprobado  
**Alcance:** Todas las aplicaciones cliente (`customer`, `restaurant`, `delivery`, `admin`)  

---

## 1. Identidad y Filosofía de Diseño

Coconea se aleja deliberadamente de los estilos corporativos fríos, asépticos o con verdes genéricos. Su identidad visual evoca la experiencia de una **cocina y cafetería artesanal de alta especialidad**: un entorno cálido, confiable, humano y sereno, donde planificar la alimentación diaria no resulte abrumador ni impersonal.

### Lema de Marca
> «Coconea — Planifica tu alimentación, confirma y recibe.»

---

## 2. Paleta Cromática y Tokens Semánticos

La paleta se fundamenta en tonos tierra, café de especialidad y bases cremosas orgánicas:

| Token Semántico | Código HEX | Rol y Aplicación Principal |
| :--- | :--- | :--- |
| **Café Espresso Primario** | `#3D2314` | Llamados a la acción prioritarios (CTA principal), botones de confirmación, tabs activas y encabezados H1 / H2. |
| **Café Tostado Secundario** | `#6F4E37` / `#8B5A2B` | Botones secundarios, enlaces sutiles, acentos de marca, bordes de enfoque y títulos H3 / H4. |
| **Caramelo & Moca** | `#D27D2D` / `#C49A6C` | Badges de estado, etiquetas nutricionales (calorías/macros), indicadores de entrega en camino y banners informativos. |
| **Fondo Crema Suave** | `#FFF8F5` / `#FAF5EE` | Fondo general (`body`) del sistema. Provee una atmósfera descansada y acogedora. |
| **Superficie / Tarjetas** | `#FFFFFF` | Contenedores principales de contenido, modales, menús y formularios. |
| **Contenedor Crema Bajo** | `#FFF1EA` | Fondos de secciones alternas, contenedores de resumen de propuesta, tarjetas secundarias y estados hover. |
| **Texto Primario** | `#2E1A0F` | Color base para lectura y textos principales, con contraste óptimo (AA/AAA) sobre crema y blanco. |
| **Texto Secundario (Muted)**| `#7A5C4D` | Texto de apoyo, marcas de tiempo, etiquetas secundarias e instrucciones complementarias. |
| **Bordes Cálidos** | `#F0E2D8` / `#E8D5C8` | Separadores, líneas de tabla y bordes de input, perfectamente integrados con la tonalidad crema. |

---

## 3. Tipografía

La tipografía transmite claridad moderna y calidez geométrica:

- **Fuente principal:** `Plus Jakarta Sans` (importada mediante `next/font/google`).
- **Fuente de respaldo:** `Inter`, `system-ui`, `sans-serif`.
- **Pesos y jerarquías:**
  - **Títulos y H1-H3:** `SemiBold` (600) o `Bold` (700) en Café Espresso (`#3D2314`).
  - **Subtítulos y etiquetas:** `Medium` (500) en Café Tostado (`#6F4E37`) o Caramelo (`#D27D2D`).
  - **Cuerpo de texto y párrafos:** `Regular` (400) en Texto Primario (`#2E1A0F`) con `leading-relaxed`.

---

## 4. Bordes y Radios (Border Radius)

El lenguaje visual privilegia curvas orgánicas y amigables:

- **Tarjetas y Contenedores:** `border-radius: 16px` (`rounded-2xl` en Tailwind).
- **Chips, Badges y Filtros:** `border-radius: 9999px` (`rounded-full` en Tailwind).
- **Botones de Acción:** `border-radius: 9999px` (`rounded-full`) para botones píldora destacados, o `border-radius: 16px` (`rounded-2xl`) para botones modales.
- **Inputs y Selects:** `border-radius: 12px` (`rounded-xl` en Tailwind) con borde de `1px` en `#E8D5C8`.

---

## 5. Iconografía

- **Librería estándar:** `lucide-react`.
- **Trazo uniforme:** Grosor continuo de `2px` (`strokeWidth={2}`).
- **Rellenos:** Mantener diseño lineal transparente en estados de reposo; aplicar relleno sólido exclusivamente en estados activos (ej. `fill-caramel` para valoraciones o estados seleccionados).
- **Colores de ícono:** Heredar del contexto tipográfico o utilizar `#3D2314`, `#6F4E37` o `#D27D2D`.

---

## 6. Componentes Clave y Casos de Uso

### 6.1. Tarjeta de Propuesta Recurrente
La tarjeta que presenta una ocurrencia de propuesta a confirmar debe ilustrar con claridad meridiana la regla: **«Programar no es comprar»**.
- Fondo: `#FFFFFF` con borde sutil `#F0E2D8` y sombra suave.
- Encabezado: Badge píldora en Caramelo (`#D27D2D` o `#FFF1EA` con texto `#D27D2D`) indicando «Pendiente de confirmación».
- Desglose: Macros en contenedor crema bajo `#FFF1EA`.
- Botón principal de Confirmación: Café Espresso `#3D2314` con texto `#FFFFFF`, borde redondeado y micro-animación en hover.
- Botón de Rechazo: Borde `#E8D5C8`, texto `#7A5C4D`, hover suave `#FFF1EA`.

### 6.2. Badges de Alérgenos y Preferencias
- Fondo `#FFF1EA` con borde `#E8D5C8` y texto `#8B5A2B` para alérgenos declarados.
- Fondo `#FAF5EE` con texto `#2E1A0F` para etiquetas dietéticas estándar.

---

## 7. Mapeo en Tailwind CSS y Configuración Compartida

Los nombres de tokens de Tailwind estándar para todo el monorepo son:

```typescript
// Colores en Tailwind extend:
colors: {
  espresso: {
    DEFAULT: '#3D2314',
    light: '#53321D',
    dark: '#2A170B',
  },
  roasted: {
    DEFAULT: '#6F4E37',
    accent: '#8B5A2B',
  },
  caramel: {
    DEFAULT: '#D27D2D',
    light: '#E59B52',
  },
  mocha: {
    DEFAULT: '#C49A6C',
    light: '#DFC19E',
  },
  cream: {
    DEFAULT: '#FFF8F5',
    soft: '#FAF5EE',
    container: '#FFF1EA',
    border: '#F0E2D8',
  },
  coffee: {
    DEFAULT: '#2E1A0F',
    muted: '#7A5C4D',
    subtle: '#9E8274',
  },
}
```
