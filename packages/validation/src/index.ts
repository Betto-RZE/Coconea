/**
 * @coconea/validation
 * Esquemas de validación reutilizables basados en Zod
 */

import { z } from 'zod';

// Esquema de Autenticación - Inicio de Sesión
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Esquema de Registro de Consumidor
export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Esquema de Confirmación/Rechazo de Propuesta (Regla RN-02)
export const proposalActionSchema = z.object({
  proposalId: z.string().uuid('ID de propuesta inválido'),
  action: z.enum(['CONFIRM', 'REJECT']),
  note: z.string().max(250).optional(),
});

export type ProposalActionInput = z.infer<typeof proposalActionSchema>;

// Esquema de Creación de Platillo / Menú
export const dishSchema = z.object({
  name: z.string().min(2, 'El nombre del platillo es obligatorio'),
  description: z.string().min(10, 'La descripción debe ser detallada'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato de precio decimal inválido'),
  calories: z.number().int().nonnegative('Las calorías no pueden ser negativas'),
  proteinGrams: z.number().nonnegative('Las proteínas no pueden ser negativas'),
  carbsGrams: z.number().nonnegative('Los carbohidratos no pueden ser negativos'),
  fatGrams: z.number().nonnegative('Las grasas no pueden ser negativas'),
  allergens: z.array(z.string()).default([]),
});

export type DishInput = z.infer<typeof dishSchema>;
