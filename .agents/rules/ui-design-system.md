# Sistema de Diseño CocoNea — Versión Cálida, Artesanal & Café / Crema

> **Regla obligatoria de interfaz y diseño visual para todas las aplicaciones web del proyecto Coconea (`apps/customer`, `apps/restaurant`, `apps/delivery`, `apps/admin`).**
> Todos los agentes y desarrolladores que interactúen con la UI deben aplicar estrictamente esta guía de estilos y tokens visuales.

---

## 1. Identidad Visual y Atmósfera

Coconea transmite una experiencia **cálida, artesanal, acogedora, confiable y gastronómica**. No se deben usar paletas frías genéricas (azules corporativos fríos, verdes genéricos o grises neutros de fábrica). La atmósfera debe sentirse como una cafetería y cocina artesanal moderna de alta calidad.

---

## 2. Paleta de Colores Oficial (Tokens Hexadecimales)

| Token Semántico | Color HEX | Función / Uso en UI |
| :--- | :--- | :--- |
| **Café Espresso Primario** | `#3D2314` | CTA principal (botones primarios), tabs activas, títulos de máxima jerarquía (H1, H2) y encabezados destacados. |
| **Café Tostado Secundario** | `#6F4E37` / `#8B5A2B` | Botones secundarios, bordes sutiles con tono café, íconos de acento y subtítulos. |
| **Caramelo & Moca** | `#D27D2D` / `#C49A6C` | Badges, etiquetas destacadas, indicadores de entrega, chips de calorías y macronutrientes, estados de progreso. |
| **Fondo Crema Suave** | `#FFF8F5` / `#FAF5EE` | Fondo principal de la aplicación (`body`), atmósfera acogedora, orgánica y descansada. |
| **Superficie / Tarjetas** | `#FFFFFF` | Fondos de tarjetas principales, diálogos, hojas laterales y menús desplegables. |
| **Contenedor Crema Bajo** | `#FFF1EA` | Fondos de sección alternativa, contenedores anidados, tarjetas sutiles y hover de filas. |
| **Texto Primario** | `#2E1A0F` | Café profundo para cuerpo de texto y lectura prolongada con máxima legibilidad y calidez. |
| **Texto Secundario / Muted** | `#7A5C4D` | Metadatos, fechas, textos de ayuda, descripciones secundarias y estados inactivos legibles. |
| **Bordes Cálidos** | `#F0E2D8` / `#E8D5C8` | Separadores, bordes de tarjeta y bordes de input, armonizados con la paleta crema. |

---

## 3. Especificaciones Tipográficas (Typography Specs)

- **Familia tipográfica principal:** `Plus Jakarta Sans` (con `Inter` y `sans-serif` como alternativas de respaldo).
- **Escala de pesos:**
  - **Títulos y encabezados:** `font-semibold` (600) o `font-bold` (700) en Café Espresso (`#3D2314`).
  - **Etiquetas, navegación y chips:** `font-medium` (500) en Café Tostado o Caramelo.
  - **Cuerpo de texto y descripciones:** `font-normal` (400) en Texto Primario (`#2E1A0F`).

---

## 4. Radios y Bordes (Borders & Radius)

- **Tarjetas y contenedores medianos:** `border-radius: 16px` (`rounded-2xl` en Tailwind).
- **Chips, badges, tags y píldoras:** `border-radius: 9999px` o `24px` (`rounded-full` en Tailwind).
- **Botones de acción principal y CTA:** `border-radius: 9999px` (`rounded-full`) o `16px` (`rounded-2xl`) con padding ergonómico (`px-5 py-2.5` o `px-6 py-3`).
- **Grosor de bordes:** Preferir `border` de 1px con tonos `#F0E2D8` o `#E8D5C8`.

---

## 5. Iconografía (Icons Specs)

- **Estilo:** Lineal geométrico con trazo continuo de `2px` (usar `lucide-react` con `strokeWidth={2}`).
- **Rellenos:** Mantener trazo lineal limpio por defecto; utilizar relleno sólido **únicamente** en estados activos o selecciones completadas (por ejemplo estrellas de calificación, checks marcados o favoritos guardados).
- **Color de íconos:** Armonizados con Café Espresso (`#3D2314`), Café Tostado (`#6F4E37`) o Caramelo (`#D27D2D`).

---

## 6. Mapeo en Tailwind CSS

Todas las aplicaciones deben tener disponibles las siguientes clases utilitarias extendidas en `tailwind.config.ts`:

- `bg-espresso` (`#3D2314`), `text-espresso`, `border-espresso`
- `bg-roasted` (`#6F4E37`), `bg-roasted-accent` (`#8B5A2B`)
- `bg-caramel` (`#D27D2D`), `text-caramel`, `bg-mocha` (`#C49A6C`)
- `bg-cream` (`#FFF8F5`), `bg-cream-soft` (`#FAF5EE`), `bg-cream-container` (`#FFF1EA`)
- `text-coffee` (`#2E1A0F`), `text-coffee-muted` (`#7A5C4D`)
- `border-cream-border` (`#F0E2D8`)

---

## 7. Filosofía de Interacción

- **Claridad de la Regla de Oro:** «Programar no es comprar». Las propuestas deben presentarse con badges de estado Caramelo (`#D27D2D`) o Crema Bajo (`#FFF1EA`), requiriendo confirmación explícita con el botón Espresso (`#3D2314`).
- **Cero estridencia:** No usar verdes neón, amarillos chillones o rojos alarmantes para acciones ordinarias. Las alertas se manejan con tonos orgánicos contrastantes.
- **Sensación Premium:** Transiciones suaves (`transition duration-200 ease-in-out`), sombras cálidas y sutiles (`shadow-sm hover:shadow-md`), y micro-interacciones pulidas.
