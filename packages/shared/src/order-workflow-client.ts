import type {
  ActiveOrder,
  CourierInfo,
  CourierTrackingStep,
  CreateOrderInput,
  GeoPoint,
  KitchenOrderStage,
  OrderChatMessage,
} from "@coconea/types";

const DEFAULT_API_URL = "http://localhost:4000/v1";
const LOCAL_STORAGE_ORDERS_KEY = "coconea_active_orders_v1";

export const DEFAULT_COURIER_LOCATION: GeoPoint = {
  x: 48,
  y: 44,
  lat: 19.417,
  lng: -99.1615,
  label: "Plaza Río de Janeiro, Roma Norte",
};

const RAICES_LOCATION: GeoPoint = {
  x: 28,
  y: 34,
  lat: 19.4182,
  lng: -99.1635,
  label: "Av. Álvaro Obregón 160, Roma Norte",
};

const BOTANICA_LOCATION: GeoPoint = {
  x: 64,
  y: 26,
  lat: 19.4201,
  lng: -99.1592,
  label: "Colima 120, Roma Norte",
};

const PACIFICO_LOCATION: GeoPoint = {
  x: 46,
  y: 58,
  lat: 19.415,
  lng: -99.161,
  label: "Av. Insurgentes Sur 318, Roma Sur",
};

const DOMINOS_LOCATION: GeoPoint = {
  x: 74,
  y: 64,
  lat: 19.4142,
  lng: -99.1565,
  label: "Orizaba 95, Roma Norte",
};

const GREENGRASS_LOCATION: GeoPoint = {
  x: 22,
  y: 68,
  lat: 19.4138,
  lng: -99.1668,
  label: "Av. Sonora 180, Hipódromo Condesa",
};

export const RESTAURANT_LOCATIONS: Record<string, GeoPoint> = {
  "rest-raices": RAICES_LOCATION,
  "rest-botanica": BOTANICA_LOCATION,
  "rest-pacifico": PACIFICO_LOCATION,
  "rest-dominos": DOMINOS_LOCATION,
  "rest-greengrass": GREENGRASS_LOCATION,
};

export const DEFAULT_COURIER_PROFILE: CourierInfo = {
  id: "courier_rodrigo_01",
  name: "Rodrigo Herrera",
  phone: "+52 55 4321 5678",
  vehicle: "Bicicleta Eléctrica",
  plates: "MX-928-REV",
  rating: 4.9,
  currentLocation: DEFAULT_COURIER_LOCATION,
};

export function resolveCustomerLocation(
  customerEmail?: string,
  customerAddress?: string,
): GeoPoint {
  const email = (customerEmail || "").toLowerCase();
  if (email.includes("carlos")) {
    return {
      x: 58,
      y: 42,
      lat: 19.4185,
      lng: -99.1602,
      label: customerAddress || "Jalapa 89, Roma Norte",
    };
  }
  if (email.includes("valeria")) {
    return {
      x: 18,
      y: 50,
      lat: 19.4162,
      lng: -99.1685,
      label: customerAddress || "Ámsterdam 212, Condesa",
    };
  }
  return {
    x: 38,
    y: 18,
    lat: 19.4215,
    lng: -99.1628,
    label: customerAddress || "Calle Durango 154, Int 3B, Roma Norte",
  };
}

export function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const dx = (a.x - b.x) * 0.042;
  const dy = (a.y - b.y) * 0.042;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0.4, Number(dist.toFixed(1)));
}

/**
 * Evalúa si un pedido candidato está dentro del radio cercano (<= maxRadiusKm)
 * respecto a la posición del repartidor o las paradas de su ruta activa.
 */
export function checkOrderRouteCompatibility(
  candidateOrder: ActiveOrder,
  courierLocation: GeoPoint,
  activeRouteOrders: ActiveOrder[],
  maxRadiusKm = 2.6,
): {
  compatible: boolean;
  distanceFromRouteKm: number;
  reason: string;
} {
  if (activeRouteOrders.length === 0) {
    const dist = calculateDistanceKm(
      courierLocation,
      candidateOrder.restaurantLocation,
    );
    return {
      compatible: dist <= maxRadiusKm + 1.0,
      distanceFromRouteKm: dist,
      reason: `A ${dist} km de tu ubicación actual`,
    };
  }

  const referencePoints: GeoPoint[] = [
    courierLocation,
    ...activeRouteOrders.flatMap((o) => [
      o.restaurantLocation,
      o.customerLocation,
    ]),
  ];

  const minPickupDist = Math.min(
    ...referencePoints.map((pt) =>
      calculateDistanceKm(pt, candidateOrder.restaurantLocation),
    ),
  );
  const minDropoffDist = Math.min(
    ...referencePoints.map((pt) =>
      calculateDistanceKm(pt, candidateOrder.customerLocation),
    ),
  );

  const avgDetour = Number(((minPickupDist + minDropoffDist) / 2).toFixed(1));
  const compatible = avgDetour <= maxRadiusKm;

  return {
    compatible,
    distanceFromRouteKm: avgDetour,
    reason: compatible
      ? `En ruta (+${avgDetour} km de desvío estimado)`
      : `Fuera de ruta (+${avgDetour} km de desvío)`,
  };
}

export const KITCHEN_STAGE_LABELS: Record<KitchenOrderStage, string> = {
  POR_HACER: "Por hacer",
  EN_PREPARACION: "En preparación",
  EN_ESPERA_REPARTIDOR: "En espera de recibir",
  EN_DELIVERY: "En delivery",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const COURIER_STEP_LABELS: Record<CourierTrackingStep, string> = {
  SIN_ASIGNAR: "Buscando repartidor en zona",
  ACEPTADO_EN_RUTA_RESTAURANTE: "Repartidor en camino al restaurante",
  ESPERANDO_PEDIDO: "Repartidor esperando el pedido en restaurante",
  EN_ENTREGA: "En camino al domicilio del cliente",
  EN_DOMICILIO: "Repartidor afuera del domicilio",
  ENTREGADO: "Pedido entregado y validado",
};

export const INITIAL_DEMO_ORDERS: ActiveOrder[] = [
  {
    id: "ORD-2026-081",
    proposalCode: "PROP-8418",
    restaurantId: "rest-raices",
    restaurantName: "McDonald's",
    restaurantAddress: "Av. Álvaro Obregón 160, Roma Norte",
    restaurantLocation: RAICES_LOCATION,
    customerId: "usr_demo_standard_01",
    customerName: "Sofía Méndez",
    customerEmail: "sofia.mendez@coconea.local",
    customerPhone: "+52 55 1234 5678",
    customerAddress: "Calle Durango 154, Int 3B, Roma Norte",
    customerLocation: resolveCustomerLocation(
      "sofia.mendez@coconea.local",
      "Calle Durango 154, Int 3B, Roma Norte",
    ),
    dishId: "dish-r1",
    dishName: "Big Mac",
    dishPrice: 99,
    beverageId: "bev-r3",
    beverageName: "Café americano",
    beveragePrice: 35,
    compostableCutlery: true,
    allergens: ["Sin Maní", "Sin Nueces"],
    dietaryNotes: ["Plan Equilibrado"],
    caloriesText: "550 kcal • 28g Prot",
    subtotal: 134,
    deliveryFee: 20,
    serviceFee: 15,
    total: 169,
    courierEarnings: 44,
    paymentMethod: "Tarjeta",
    deliveryPin: "4821",
    distanceKm: 1.2,
    estimatedWindow: "13:30 - 14:15 hrs",
    kitchenStage: "POR_HACER",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: "msg_init_0",
        orderId: "ORD-2026-081",
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: "Pedido confirmado por Sofía Méndez. Recibido en McDonald's.",
        timestamp: "12:38",
      },
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
  {
    id: "ORD-2026-082",
    proposalCode: "PROP-8419",
    restaurantId: "rest-botanica",
    restaurantName: "Subway",
    restaurantAddress: "Colima 120, Roma Norte",
    restaurantLocation: BOTANICA_LOCATION,
    customerId: "usr_demo_keto_02",
    customerName: "Carlos Gómez",
    customerEmail: "carlos.gomez@coconea.local",
    customerPhone: "+52 55 8123 9901",
    customerAddress: "Jalapa 89, Roma Norte",
    customerLocation: resolveCustomerLocation(
      "carlos.gomez@coconea.local",
      "Jalapa 89, Roma Norte",
    ),
    dishId: "dish-b1",
    dishName: "Pollo Estilo Teriyaki",
    dishPrice: 119,
    beverageId: null,
    beverageName: null,
    beveragePrice: 0,
    compostableCutlery: true,
    allergens: ["Sin Lácteos"],
    dietaryNotes: ["Alto en Proteína", "Sin Azúcares Añadidos"],
    caloriesText: "490 kcal • 36g Prot",
    subtotal: 119,
    deliveryFee: 20,
    serviceFee: 15,
    total: 154,
    courierEarnings: 46,
    paymentMethod: "Tarjeta",
    deliveryPin: "4821",
    distanceKm: 1.4,
    estimatedWindow: "13:30 - 14:15 hrs",
    kitchenStage: "EN_ESPERA_REPARTIDOR",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: "msg_init_1",
        orderId: "ORD-2026-082",
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: "Pedido listo en mostrador para recolección en zona Roma Norte.",
        timestamp: "12:40",
      },
    ],
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
  {
    id: "ORD-2026-083",
    proposalCode: "PROP-8420",
    restaurantId: "rest-greengrass",
    restaurantName: "Green Grass",
    restaurantAddress: "Av. Sonora 180, Hipódromo Condesa",
    restaurantLocation: GREENGRASS_LOCATION,
    customerId: "usr_demo_vegan_03",
    customerName: "Valeria Ríos",
    customerEmail: "valeria.rios@coconea.local",
    customerPhone: "+52 55 6741 2230",
    customerAddress: "Ámsterdam 212, Condesa",
    customerLocation: resolveCustomerLocation(
      "valeria.rios@coconea.local",
      "Ámsterdam 212, Condesa",
    ),
    dishId: "dish-g1",
    dishName: "Cesar & Bacon",
    dishPrice: 159,
    beverageId: null,
    beverageName: null,
    beveragePrice: 0,
    compostableCutlery: true,
    allergens: ["Sin Nueces"],
    dietaryNotes: ["Fresca", "Orgánico"],
    caloriesText: "520 kcal • 24g Prot",
    subtotal: 159,
    deliveryFee: 20,
    serviceFee: 15,
    total: 194,
    courierEarnings: 52,
    paymentMethod: "Efectivo",
    deliveryPin: "4821",
    distanceKm: 1.6,
    estimatedWindow: "13:45 - 14:20 hrs",
    kitchenStage: "EN_PREPARACION",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: "msg_init_2",
        orderId: "ORD-2026-083",
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: "Cocina preparando orden con vegetales frescos desinfectados.",
        timestamp: "12:45",
      },
    ],
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
  {
    id: "ORD-2026-084",
    proposalCode: "PROP-8422",
    restaurantId: "rest-pacifico",
    restaurantName: "KFC",
    restaurantAddress: "Av. Insurgentes Sur 318, Roma Sur",
    restaurantLocation: PACIFICO_LOCATION,
    customerId: "usr_demo_standard_01",
    customerName: "Sofía Méndez",
    customerEmail: "sofia.mendez@coconea.local",
    customerPhone: "+52 55 1234 5678",
    customerAddress: "Calle Durango 154, Int 3B, Roma Norte",
    customerLocation: resolveCustomerLocation(
      "sofia.mendez@coconea.local",
      "Calle Durango 154, Int 3B, Roma Norte",
    ),
    dishId: "dish-p2",
    dishName: "Megabox Big Krunch",
    dishPrice: 199,
    beverageId: "bev-p1",
    beverageName: "Refresco de lata",
    beveragePrice: 35,
    compostableCutlery: true,
    allergens: ["Sin Maní"],
    dietaryNotes: ["Alto en Proteína"],
    caloriesText: "640 kcal • 38g Prot",
    subtotal: 234,
    deliveryFee: 20,
    serviceFee: 15,
    total: 269,
    courierEarnings: 49,
    paymentMethod: "Tarjeta",
    deliveryPin: "4821",
    distanceKm: 1.8,
    estimatedWindow: "13:40 - 14:20 hrs",
    kitchenStage: "POR_HACER",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: "msg_init_3",
        orderId: "ORD-2026-084",
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: "Pedido confirmado y enviado a cocina KFC.",
        timestamp: "12:48",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
  {
    id: "ORD-2026-085",
    proposalCode: "PROP-8423",
    restaurantId: "rest-dominos",
    restaurantName: "Domino's",
    restaurantAddress: "Orizaba 95, Roma Norte",
    restaurantLocation: DOMINOS_LOCATION,
    customerId: "usr_demo_keto_02",
    customerName: "Carlos Gómez",
    customerEmail: "carlos.gomez@coconea.local",
    customerPhone: "+52 55 8123 9901",
    customerAddress: "Jalapa 89, Roma Norte",
    customerLocation: resolveCustomerLocation(
      "carlos.gomez@coconea.local",
      "Jalapa 89, Roma Norte",
    ),
    dishId: "dish-d1",
    dishName: "Pizza de pepperoni",
    dishPrice: 199,
    beverageId: null,
    beverageName: null,
    beveragePrice: 0,
    compostableCutlery: false,
    allergens: ["Sin Nueces"],
    dietaryNotes: ["Horneado tradicional"],
    caloriesText: "590 kcal • 26g Prot",
    subtotal: 199,
    deliveryFee: 20,
    serviceFee: 15,
    total: 234,
    courierEarnings: 48,
    paymentMethod: "Tarjeta",
    deliveryPin: "4821",
    distanceKm: 1.3,
    estimatedWindow: "13:45 - 14:30 hrs",
    kitchenStage: "EN_PREPARACION",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: "msg_init_4",
        orderId: "ORD-2026-085",
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: "Pizza en horno en sucursal Domino's.",
        timestamp: "12:50",
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
];

function getLocalOrders(): ActiveOrder[] {
  if (typeof window === "undefined") return INITIAL_DEMO_ORDERS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActiveOrder[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    window.localStorage.setItem(
      LOCAL_STORAGE_ORDERS_KEY,
      JSON.stringify(INITIAL_DEMO_ORDERS),
    );
  } catch {
    // Ignore storage errors
  }
  return INITIAL_DEMO_ORDERS;
}

function saveLocalOrders(orders: ActiveOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_ORDERS_KEY,
      JSON.stringify(orders),
    );
  } catch {
    // Ignore storage errors
  }
}

export function buildNewActiveOrder(input: CreateOrderInput): ActiveOrder {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const restLoc = RESTAURANT_LOCATIONS[input.restaurantId] || {
    x: 34,
    y: 38,
    lat: 19.418,
    lng: -99.163,
    label: input.restaurantAddress,
  };
  const custLoc = resolveCustomerLocation(
    input.customerEmail,
    input.customerAddress,
  );
  const distanceKm = calculateDistanceKm(restLoc, custLoc);
  const subtotal = input.dishPrice + (input.beveragePrice || 0);
  const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 899)}`;

  return {
    id: orderId,
    proposalCode: input.proposalCode || "PROP-8421",
    restaurantId: input.restaurantId,
    restaurantName: input.restaurantName,
    restaurantAddress: input.restaurantAddress,
    restaurantLocation: restLoc,
    customerId: input.customerId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone || "+52 55 1234 5678",
    customerAddress: input.customerAddress,
    customerLocation: custLoc,
    dishId: input.dishId,
    dishName: input.dishName,
    dishPrice: input.dishPrice,
    beverageId: input.beverageId || null,
    beverageName: input.beverageName || null,
    beveragePrice: input.beveragePrice || 0,
    compostableCutlery: input.compostableCutlery,
    allergens: input.allergens || [],
    dietaryNotes: input.dietaryNotes || ["Plan Equilibrado"],
    caloriesText: input.caloriesText || "550 kcal verificadas",
    subtotal,
    deliveryFee: input.deliveryFee,
    serviceFee: input.serviceFee,
    total: input.total,
    courierEarnings: Number((32 + distanceKm * 10).toFixed(2)),
    paymentMethod: input.paymentMethod || "Tarjeta",
    deliveryPin: "4821",
    distanceKm,
    estimatedWindow: input.estimatedWindow || "Hoy 13:30 - 14:15 hrs",
    kitchenStage: "POR_HACER",
    courierStep: "SIN_ASIGNAR",
    courier: null,
    rejectedByCourierIds: [],
    messages: [
      {
        id: `msg_${Date.now()}`,
        orderId,
        senderRole: "SYSTEM",
        senderName: "Sistema Coconea",
        text: `Pedido confirmado por ${input.customerName}. Enviado a la cocina de ${input.restaurantName}.`,
        timestamp: timeLabel,
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    deliveredAt: null,
  };
}

/**
 * Obtiene la lista de pedidos activos sincronizando con la API NestJS (/v1/orders)
 * o usando el almacenamiento local de respaldo si la API no está corriendo.
 */
export async function fetchActiveOrders(
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder[]> {
  try {
    const res = await fetch(`${apiUrl}/orders`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const payload = await res.json();
      const orders = (payload.data || payload) as ActiveOrder[];
      if (Array.isArray(orders)) {
        saveLocalOrders(orders);
        return orders;
      }
    }
  } catch {
    // Fallback a almacenamiento local en modo demo estática
  }
  return getLocalOrders();
}

/**
 * Crea un nuevo pedido confirmado por el cliente.
 */
export async function createActiveOrder(
  input: CreateOrderInput,
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder> {
  try {
    const res = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const payload = await res.json();
      const created = (payload.data || payload) as ActiveOrder;
      const current = getLocalOrders().filter((o) => o.id !== created.id);
      saveLocalOrders([created, ...current]);
      return created;
    }
  } catch {
    // Fallback local
  }

  const localOrder = buildNewActiveOrder(input);
  const current = getLocalOrders();
  saveLocalOrders([localOrder, ...current]);
  return localOrder;
}

/**
 * Actualiza la etapa de cocina en el dashboard del restaurante.
 */
export async function updateOrderKitchenStage(
  orderId: string,
  kitchenStage: KitchenOrderStage,
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder | null> {
  try {
    const res = await fetch(`${apiUrl}/orders/${orderId}/kitchen-stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kitchenStage }),
    });
    if (res.ok) {
      const payload = await res.json();
      const updated = (payload.data || payload) as ActiveOrder;
      const list = getLocalOrders().map((o) =>
        o.id === updated.id ? updated : o,
      );
      saveLocalOrders(list);
      return updated;
    }
  } catch {
    // Fallback local
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  const existing = idx >= 0 ? orders[idx] : undefined;
  if (!existing) return null;

  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const target: ActiveOrder = {
    ...existing,
    kitchenStage,
    updatedAt: now.toISOString(),
  };
  if (kitchenStage === "EN_DELIVERY") {
    if (!target.courier) {
      target.courier = {
        ...DEFAULT_COURIER_PROFILE,
        currentLocation: existing.restaurantLocation,
      };
    }
    if (
      target.courierStep === "SIN_ASIGNAR" ||
      target.courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" ||
      target.courierStep === "ESPERANDO_PEDIDO"
    ) {
      target.courierStep = "EN_ENTREGA";
    }
  }
  if (kitchenStage === "ENTREGADO") {
    if (!target.courier) {
      target.courier = {
        ...DEFAULT_COURIER_PROFILE,
        currentLocation: existing.customerLocation,
      };
    }
    target.courierStep = "ENTREGADO";
    target.deliveredAt = now.toISOString();
  }
  target.messages = [
    ...existing.messages,
    {
      id: `msg_${Date.now()}`,
      orderId,
      senderRole: "RESTAURANT",
      senderName: existing.restaurantName,
      text: `Estado en cocina actualizado a: ${KITCHEN_STAGE_LABELS[kitchenStage]}.`,
      timestamp: timeLabel,
    },
  ];
  orders[idx] = target;
  saveLocalOrders(orders);
  return target;
}

/**
 * Permite al repartidor aceptar uno o varios pedidos disponibles en su zona.
 */
export async function acceptOrderByCourier(
  orderId: string,
  courier: CourierInfo = DEFAULT_COURIER_PROFILE,
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder | null> {
  try {
    const res = await fetch(`${apiUrl}/orders/${orderId}/accept-courier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courier }),
    });
    if (res.ok) {
      const payload = await res.json();
      const updated = (payload.data || payload) as ActiveOrder;
      const list = getLocalOrders().map((o) =>
        o.id === updated.id ? updated : o,
      );
      saveLocalOrders(list);
      return updated;
    }
  } catch {
    // Fallback local
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  const existing = idx >= 0 ? orders[idx] : undefined;
  if (!existing) return null;

  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const target: ActiveOrder = {
    ...existing,
    courier,
    courierStep: "ACEPTADO_EN_RUTA_RESTAURANTE",
    updatedAt: now.toISOString(),
    messages: [
      ...existing.messages,
      {
        id: `msg_${Date.now()}`,
        orderId,
        senderRole: "DELIVERY",
        senderName: courier.name,
        text: `¡Hola! Soy ${courier.name}, acepté tu pedido en mi ruta (${courier.vehicle}). Voy rumbo a ${existing.restaurantName}.`,
        timestamp: timeLabel,
      },
    ],
  };
  orders[idx] = target;
  saveLocalOrders(orders);
  return target;
}

/**
 * Permite al repartidor rechazar un pedido de su zona.
 */
export async function rejectOrderByCourier(
  orderId: string,
  courierId: string = DEFAULT_COURIER_PROFILE.id,
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder | null> {
  try {
    const res = await fetch(`${apiUrl}/orders/${orderId}/reject-courier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courierId }),
    });
    if (res.ok) {
      const payload = await res.json();
      const updated = (payload.data || payload) as ActiveOrder;
      const list = getLocalOrders().map((o) =>
        o.id === updated.id ? updated : o,
      );
      saveLocalOrders(list);
      return updated;
    }
  } catch {
    // Fallback local
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  const existing = idx >= 0 ? orders[idx] : undefined;
  if (!existing) return null;

  const rejectedIds = existing.rejectedByCourierIds.includes(courierId)
    ? existing.rejectedByCourierIds
    : [...existing.rejectedByCourierIds, courierId];
  const target: ActiveOrder = {
    ...existing,
    rejectedByCourierIds: rejectedIds,
    updatedAt: new Date().toISOString(),
  };
  orders[idx] = target;
  saveLocalOrders(orders);
  return target;
}

/**
 * Actualiza el paso de seguimiento del repartidor (Esperando pedido, En entrega, En domicilio, Entregado).
 */
export async function updateCourierTrackingStep(
  orderId: string,
  courierStep: CourierTrackingStep,
  options?: { deliveryPin?: string; courierLocation?: GeoPoint },
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder | null> {
  try {
    const res = await fetch(`${apiUrl}/orders/${orderId}/courier-step`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courierStep,
        deliveryPin: options?.deliveryPin,
        courierLocation: options?.courierLocation,
      }),
    });
    if (res.ok) {
      const payload = await res.json();
      const updated = (payload.data || payload) as ActiveOrder;
      const list = getLocalOrders().map((o) =>
        o.id === updated.id ? updated : o,
      );
      saveLocalOrders(list);
      return updated;
    }
  } catch {
    // Fallback local
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  const existing = idx >= 0 ? orders[idx] : undefined;
  if (!existing) return null;

  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const target: ActiveOrder = {
    ...existing,
    courierStep,
    updatedAt: now.toISOString(),
  };

  if (courierStep === "ESPERANDO_PEDIDO" && target.courier) {
    target.courier = {
      ...target.courier,
      currentLocation: existing.restaurantLocation,
    };
  } else if (courierStep === "EN_ENTREGA") {
    target.kitchenStage = "EN_DELIVERY";
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: {
          x: Math.round(
            (existing.restaurantLocation.x + existing.customerLocation.x) / 2,
          ),
          y: Math.round(
            (existing.restaurantLocation.y + existing.customerLocation.y) / 2,
          ),
          lat:
            (existing.restaurantLocation.lat + existing.customerLocation.lat) /
            2,
          lng:
            (existing.restaurantLocation.lng + existing.customerLocation.lng) /
            2,
          label: "En trayecto hacia domicilio",
        },
      };
    }
  } else if (courierStep === "EN_DOMICILIO") {
    target.kitchenStage = "EN_DELIVERY";
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: existing.customerLocation,
      };
    }
  } else if (courierStep === "ENTREGADO") {
    target.kitchenStage = "ENTREGADO";
    target.deliveredAt = now.toISOString();
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: existing.customerLocation,
      };
    }
  }

  const stepNotice: Record<CourierTrackingStep, string> = {
    SIN_ASIGNAR: "Sin repartidor asignado.",
    ACEPTADO_EN_RUTA_RESTAURANTE: "En camino al restaurante para recoger.",
    ESPERANDO_PEDIDO: `Llegué a ${existing.restaurantName} y estoy esperando a que me entreguen tu paquete.`,
    EN_ENTREGA: `¡Ya tengo tu pedido de ${existing.restaurantName}! Voy en camino hacia ${existing.customerAddress}.`,
    EN_DOMICILIO: `Ya llegué a tu domicilio (${existing.customerAddress}). Ten listo tu PIN de entrega.`,
    ENTREGADO: `Pedido entregado satisfactoriamente. ¡Buen provecho!`,
  };

  target.messages = [
    ...existing.messages,
    {
      id: `msg_${Date.now()}`,
      orderId,
      senderRole: "DELIVERY",
      senderName: target.courier?.name || "Repartidor",
      text: stepNotice[courierStep],
      timestamp: timeLabel,
    },
  ];
  orders[idx] = target;
  saveLocalOrders(orders);
  return target;
}

/**
 * Envía un mensaje en el chat en vivo del pedido (entre Cliente, Repartidor y Restaurante).
 */
export async function sendOrderChatMessage(
  orderId: string,
  senderRole: "USER" | "DELIVERY" | "RESTAURANT" | "SYSTEM",
  senderName: string,
  text: string,
  apiUrl = DEFAULT_API_URL,
): Promise<ActiveOrder | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const res = await fetch(`${apiUrl}/orders/${orderId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderRole, senderName, text: trimmed }),
    });
    if (res.ok) {
      const payload = await res.json();
      const updated = (payload.data || payload) as ActiveOrder;
      const list = getLocalOrders().map((o) =>
        o.id === updated.id ? updated : o,
      );
      saveLocalOrders(list);
      return updated;
    }
  } catch {
    // Fallback local
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  const existing = idx >= 0 ? orders[idx] : undefined;
  if (!existing) return null;

  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const newMsg: OrderChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    orderId,
    senderRole,
    senderName,
    text: trimmed,
    timestamp: timeLabel,
  };
  const target: ActiveOrder = {
    ...existing,
    updatedAt: now.toISOString(),
    messages: [...existing.messages, newMsg],
  };
  orders[idx] = target;
  saveLocalOrders(orders);
  return target;
}
