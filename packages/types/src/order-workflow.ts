/**
 * Contratos compartidos para el flujo en tiempo real entre
 * Cliente (Customer) -> Restaurante (Restaurant) -> Repartidor (Delivery)
 */

export type KitchenOrderStage =
  | "POR_HACER"
  | "EN_PREPARACION"
  | "EN_ESPERA_REPARTIDOR"
  | "EN_DELIVERY"
  | "ENTREGADO"
  | "CANCELADO";

export type CourierTrackingStep =
  | "SIN_ASIGNAR"
  | "ACEPTADO_EN_RUTA_RESTAURANTE"
  | "ESPERANDO_PEDIDO"
  | "EN_ENTREGA"
  | "EN_DOMICILIO"
  | "ENTREGADO";

export interface GeoPoint {
  x: number; // Coordenada X relativa en el mapa (0 a 100)
  y: number; // Coordenada Y relativa en el mapa (0 a 100)
  lat: number;
  lng: number;
  label?: string;
}

export interface CourierInfo {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plates: string;
  rating?: number;
  currentLocation: GeoPoint;
}

export interface OrderChatMessage {
  id: string;
  orderId: string;
  senderRole: "USER" | "DELIVERY" | "RESTAURANT" | "SYSTEM";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ActiveOrder {
  id: string;
  proposalCode: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLocation: GeoPoint;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  customerLocation: GeoPoint;
  dishId: string;
  dishName: string;
  dishPrice: number;
  beverageId?: string | null;
  beverageName?: string | null;
  beveragePrice?: number;
  compostableCutlery: boolean;
  allergens: string[];
  dietaryNotes: string[];
  caloriesText: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  courierEarnings: number;
  paymentMethod: "Tarjeta" | "Efectivo";
  deliveryPin: string;
  distanceKm: number;
  estimatedWindow: string;
  kitchenStage: KitchenOrderStage;
  courierStep: CourierTrackingStep;
  courier: CourierInfo | null;
  rejectedByCourierIds: string[];
  messages: OrderChatMessage[];
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string | null;
}

export interface CreateOrderInput {
  proposalCode?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  dishId: string;
  dishName: string;
  dishPrice: number;
  beverageId?: string | null;
  beverageName?: string | null;
  beveragePrice?: number;
  compostableCutlery: boolean;
  allergens?: string[];
  dietaryNotes?: string[];
  caloriesText?: string;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  paymentMethod?: "Tarjeta" | "Efectivo";
  estimatedWindow?: string;
}

export interface UpdateOrderKitchenStageInput {
  kitchenStage: KitchenOrderStage;
}

export interface AcceptOrderByCourierInput {
  courier: CourierInfo;
}

export interface UpdateCourierStepInput {
  courierStep: CourierTrackingStep;
  deliveryPin?: string;
  courierLocation?: GeoPoint;
}

export interface SendOrderMessageInput {
  senderRole: "USER" | "DELIVERY" | "RESTAURANT" | "SYSTEM";
  senderName: string;
  text: string;
}

