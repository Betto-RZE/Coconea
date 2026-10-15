/**
 * @coconea/shared
 * Utilidades compartidas independientes del entorno para Coconea
 */

export const PROJECT_NAME = 'Coconea';
export const PROJECT_MOTTO = 'Coconea — Planifica tu alimentación, confirma y recibe.';

/**
 * Formatea un importe decimal como moneda mexicana (MXN).
 */
export function formatCurrencyMXN(amount: string | number): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '$0.00 MXN';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(numeric);
}

/**
 * Calcula calorías teóricas basadas en gramos de macronutrientes.
 * (Proteína: 4 kcal/g, Carbohidratos: 4 kcal/g, Grasas: 9 kcal/g)
 */
export function calculateCaloriesFromMacros(
  proteinG: number,
  carbsG: number,
  fatG: number
): number {
  return Math.round(proteinG * 4 + carbsG * 4 + fatG * 9);
}

/**
 * Obtiene la fecha actual en formato ISO manteniendo consistencia.
 */
export function getCurrentIsoDate(): string {
  return new Date().toISOString();
}

/**
 * Tokens de color oficiales de Coconea (Versión Cálida, Artesanal & Café / Crema)
 */
export const COCONEA_COLORS = {
  // Primario y jerarquía
  espresso: '#3D2314', // CTA principal, tabs activas, títulos H1/H2
  espressoDark: '#2A170B',
  espressoLight: '#53321D',

  // Secundario y acentos
  roasted: '#6F4E37', // Botones secundarios
  roastedAccent: '#8B5A2B', // Acentos

  // Indicadores y badges
  caramel: '#D27D2D', // Badges, indicadores de entrega y calorías
  caramelLight: '#E59B52',
  mocha: '#C49A6C', // Acentos suaves
  mochaLight: '#DFC19E',

  // Fondos y superficies
  cream: '#FFF8F5', // Fondo principal suave
  creamSoft: '#FAF5EE', // Atmósfera cálida alterna
  creamContainer: '#FFF1EA', // Contenedor crema bajo
  creamBorder: '#F0E2D8', // Bordes sutiles
  surface: '#FFFFFF', // Superficies y tarjetas

  // Texto
  textPrimary: '#2E1A0F', // Café profundo de máxima legibilidad
  textSecondary: '#7A5C4D', // Café medio para metadatos y subtítulos
  textMuted: '#9E8274',
} as const;

/**
 * Especificaciones de estilo oficiales de Coconea
 */
export const COCONEA_DESIGN_SPECS = {
  fonts: {
    primary: 'Plus Jakarta Sans',
    fallback: 'Inter, system-ui, sans-serif',
    weights: {
      titles: 600, // SemiBold
      labels: 500, // Medium
      body: 400, // Regular
    },
  },
  radius: {
    card: '16px', // rounded-2xl
    chip: '9999px', // rounded-full (o 24px)
    buttonPill: '9999px',
    buttonRegular: '16px',
    input: '12px',
  },
  icons: {
    strokeWidth: 2,
    style: 'geometric-linear',
  },
} as const;

