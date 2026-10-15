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
