/**
 * @coconea/types
 * Dominio, contratos y modelos compartidos del proyecto Coconea
 */

// Roles y Actores
export type UserRole = 'USER' | 'RESTAURANT' | 'DELIVERY' | 'ADMIN';
export type ActorRole = UserRole | 'SYSTEM';

// Modalidades de Planificación Recurrente
export type PlanMode = 'FIXED' | 'RECOMMENDATION';

// Estados de Propuestas
export type ProposalStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

// Estados del Pedido
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// Estados del Pago (Simulado en MVP)
export type PaymentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'UNCERTAIN'
  | 'REFUNDED';

// Estados de la Entrega
export type DeliveryStatus =
  | 'PENDING_ASSIGNMENT'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'FAILED';

// Información Nutricional
export interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  sodiumMg?: number;
  allergens: string[];
}

// Entidad Platillo / Producto
export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: string; // Representación de dinero como string decimal
  imageUrl?: string;
  isAvailable: boolean;
  nutrition: NutritionalInfo;
  createdAt: string;
  updatedAt: string;
}

// Perfil de Usuario
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  dietaryPreferences?: string[];
  allergies?: string[];
  createdAt: string;
}

// Respuesta Estándar de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
