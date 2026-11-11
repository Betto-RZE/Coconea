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
const LOCAL_STORAGE_ORDERS_KEY = "coconea_live_orders_puebla_v3";

export const PUEBLA_CENTER = {
  lat: 19.0414,
  lng: -98.2063,
  label: "Paseo Bravo / Av. Juárez, Puebla, Pue.",
};

/**
 * Convierte coordenadas reales (lat, lng) de la zona metropolitana de Puebla
 * a coordenadas relativas X, Y (0..100) de respaldo.
 */
export function latLngToPueblaPoint(
  lat: number,
  lng: number,
  label?: string,
): GeoPoint {
  // Bounding box aproximado de Puebla (lat: 18.99 a 19.08, lng: -98.26 a -98.17)
  const x = Math.min(94, Math.max(6, Math.round(((lng - -98.255) / 0.085) * 100)));
  const y = Math.min(94, Math.max(6, Math.round(((19.068 - lat) / 0.062) * 100)));
  return {
    x,
    y,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    label,
  };
}

export const PUEBLA_QUICK_LOCATIONS: GeoPoint[] = [
  latLngToPueblaPoint(
    19.0512,
    -98.2215,
    "Av. Teziutlán Sur 45, Col. La Paz, 72160 Puebla, Pue.",
  ),
  latLngToPueblaPoint(
    19.0433,
    -98.1984,
    "Av. Reforma 118, Centro Histórico, 72000 Puebla, Pue.",
  ),
  latLngToPueblaPoint(
    19.0315,
    -98.2305,
    "Vía Atlixcáyotl 1504, Zona Angelópolis, 72190 Puebla, Pue.",
  ),
  latLngToPueblaPoint(
    19.0294,
    -98.2078,
    "Av. 43 Poniente 305, Huexotitla, 72534 Puebla, Pue.",
  ),
  latLngToPueblaPoint(
    19.0468,
    -98.2092,
    "Av. Juárez 1914, Zona Esmeralda, 72090 Puebla, Pue.",
  ),
  latLngToPueblaPoint(
    19.0018,
    -98.2012,
    "Av. San Claudio y 14 Sur, CU BUAP, 72570 Puebla, Pue.",
  ),
];

export const DEFAULT_COURIER_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0438,
  -98.2062,
  "Av. Juárez y 13 Sur, Centro, Puebla, Pue.",
);

const RAICES_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0488,
  -98.2165,
  "Av. Juárez 2318, Col. La Paz, 72160 Puebla, Pue.",
);

const BOTANICA_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0453,
  -98.1998,
  "Av. Reforma 518, Centro Histórico, 72000 Puebla, Pue.",
);

const PACIFICO_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0398,
  -98.1945,
  "Blvd. Héroes del 5 de Mayo 704, El Carmen, 72530 Puebla, Pue.",
);

const DOMINOS_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0345,
  -98.2042,
  "Av. 43 Poniente 302, Huexotitla, 72534 Puebla, Pue.",
);

const GREENGRASS_LOCATION: GeoPoint = latLngToPueblaPoint(
  19.0298,
  -98.2305,
  "Blvd. del Niño Poblano 2510, Reserva Territorial Atlixcáyotl, 72190 Puebla, Pue.",
);

export const RESTAURANT_LOCATIONS: Record<string, GeoPoint> = {
  "rest-raices": RAICES_LOCATION,
  "rest-botanica": BOTANICA_LOCATION,
  "rest-pacifico": PACIFICO_LOCATION,
  "rest-dominos": DOMINOS_LOCATION,
  "rest-greengrass": GREENGRASS_LOCATION,
};

export interface PueblaRestaurantBranch {
  id: string;
  name: string;
  emoji: string;
  zone: string;
  address: string;
  location: GeoPoint;
}

export const PUEBLA_RESTAURANT_BRANCHES: PueblaRestaurantBranch[] = [
  {
    id: "rest-raices",
    name: "McDonald's",
    emoji: "🍔",
    zone: "Av. Juárez / La Paz",
    address: "Av. Juárez 2318, Col. La Paz, 72160 Puebla, Pue.",
    location: RAICES_LOCATION,
  },
  {
    id: "rest-botanica",
    name: "Subway",
    emoji: "🥖",
    zone: "Centro Histórico",
    address: "Av. Reforma 518, Centro Histórico, 72000 Puebla, Pue.",
    location: BOTANICA_LOCATION,
  },
  {
    id: "rest-pacifico",
    name: "KFC",
    emoji: "🍗",
    zone: "Blvd. 5 de Mayo / El Carmen",
    address: "Blvd. Héroes del 5 de Mayo 704, El Carmen, 72530 Puebla, Pue.",
    location: PACIFICO_LOCATION,
  },
  {
    id: "rest-dominos",
    name: "Domino's",
    emoji: "🍕",
    zone: "Huexotitla",
    address: "Av. 43 Poniente 302, Huexotitla, 72534 Puebla, Pue.",
    location: DOMINOS_LOCATION,
  },
  {
    id: "rest-greengrass",
    name: "Green Grass",
    emoji: "🥗",
    zone: "Angelópolis",
    address: "Blvd. del Niño Poblano 2510, Angelópolis, 72190 Puebla, Pue.",
    location: GREENGRASS_LOCATION,
  },
];

export const DEFAULT_COURIER_PROFILE: CourierInfo = {
  id: "courier_rodrigo_01",
  name: "Rodrigo Herrera",
  phone: "+52 222 432 5678",
  vehicle: "Bicicleta Eléctrica",
  plates: "PUE-928-MX",
  rating: 4.9,
  currentLocation: DEFAULT_COURIER_LOCATION,
};

export function resolveCustomerLocation(
  customerEmail?: string,
  customerAddress?: string,
): GeoPoint {
  const email = (customerEmail || "").toLowerCase();
  if (email.includes("carlos")) {
    return latLngToPueblaPoint(
      19.0378,
      -98.2145,
      customerAddress || "Av. 31 Poniente 1315, Col. Los Volcanes, Puebla, Pue.",
    );
  }
  if (email.includes("valeria")) {
    return latLngToPueblaPoint(
      19.0389,
      -98.2008,
      customerAddress || "Calle 3 Sur 1508, El Carmen, Puebla, Pue.",
    );
  }
  return latLngToPueblaPoint(
    19.0512,
    -98.2215,
    customerAddress || "Av. Teziutlán Sur 45, Col. La Paz, Puebla, Pue.",
  );
}

/**
 * Calcula la distancia real en kilómetros usando la fórmula de Haversine sobre (lat, lng).
 */
export function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  const roadFactor = 1.25; // Factor urbano por calles
  return Math.max(0.4, Number((R * c * roadFactor).toFixed(1)));
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Busca direcciones reales en Puebla, Pue. usando Nominatim (OpenStreetMap, 100% gratuito, $0 MXN).
 */
export async function geocodePueblaAddress(
  query: string,
): Promise<GeocodeResult[]> {
  const clean = query.trim();
  if (!clean) return [];
  const searchQuery = clean.toLowerCase().includes("puebla")
    ? clean
    : `${clean}, Puebla, México`;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=mx&viewbox=-98.35,19.14,-98.08,18.94&bounded=0&q=${encodeURIComponent(
      searchQuery,
    )}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "es" },
    });
    if (res.ok) {
      const data = (await res.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          lat: Number(item.lat),
          lng: Number(item.lon),
          displayName: item.display_name,
        }));
      }
    }
  } catch {
    // Fallback local si no hay conexión a internet
  }
  return PUEBLA_QUICK_LOCATIONS.filter((loc) =>
    (loc.label || "").toLowerCase().includes(clean.toLowerCase()),
  ).map((loc) => ({
    lat: loc.lat,
    lng: loc.lng,
    displayName: loc.label || `${loc.lat}, ${loc.lng}`,
  }));
}

const reverseGeocodeCache = new Map<string, string>();
const osrmRouteCache = new Map<string, OsrmRouteResult>();

/**
 * Genera una huella ligera de la lista de pedidos para evitar re-renderizados
 * innecesarios en React durante el polling cuando no hubo cambios.
 */
export function getOrdersSignature(orders: ActiveOrder[]): string {
  if (!orders.length) return "empty";
  return orders
    .map(
      (o) =>
        `${o.id}:${o.kitchenStage}:${o.courierStep}:${o.updatedAt}:${o.messages.length}:${o.rejectedByCourierIds.length}:${o.courier?.currentLocation.lat ?? 0},${o.courier?.currentLocation.lng ?? 0}`,
    )
    .join("|");
}

/**
 * Obtiene el nombre real de la calle y colonia en Puebla al soltar o tocar un Pin en el mapa (Nominatim Reverse).
 */
export async function reverseGeocodePuebla(
  lat: number,
  lng: number,
): Promise<string> {
  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = reverseGeocodeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "es" },
    });
    if (res.ok) {
      const data = (await res.json()) as {
        display_name?: string;
        address?: {
          road?: string;
          house_number?: string;
          suburb?: string;
          neighbourhood?: string;
          city?: string;
          town?: string;
          postcode?: string;
        };
      };
      if (data.address?.road) {
        const num = data.address.house_number
          ? ` ${data.address.house_number}`
          : "";
        const col =
          data.address.suburb || data.address.neighbourhood
            ? `, Col. ${data.address.suburb || data.address.neighbourhood}`
            : "";
        const resolved = `${data.address.road}${num}${col}, Puebla, Pue.`;
        if (reverseGeocodeCache.size > 60) reverseGeocodeCache.clear();
        reverseGeocodeCache.set(cacheKey, resolved);
        return resolved;
      }
      if (data.display_name) {
        const resolved = data.display_name.split(",").slice(0, 4).join(", ");
        if (reverseGeocodeCache.size > 60) reverseGeocodeCache.clear();
        reverseGeocodeCache.set(cacheKey, resolved);
        return resolved;
      }
    }
  } catch {
    // Fallback con coordenadas
  }
  return `Ubicación seleccionada en Puebla (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

export interface OsrmRouteResult {
  coordinates: [number, number][]; // [lat, lng][] para dibujar en Leaflet
  distanceKm: number;
  durationMin: number;
}

/**
 * Calcula la ruta real calle por calle en Puebla usando OSRM (Open Source Routing Machine, $0 MXN)
 * con caché en memoria para no repetir peticiones ni saturar RAM.
 */
export async function fetchRealOsrmRoute(
  waypoints: { lat: number; lng: number }[],
): Promise<OsrmRouteResult> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints.map((w) => [w.lat, w.lng]),
      distanceKm: 0,
      durationMin: 0,
    };
  }
  const coordsString = waypoints
    .map((w) => `${w.lng.toFixed(5)},${w.lat.toFixed(5)}`)
    .join(";");
  const cached = osrmRouteCache.get(coordsString);
  if (cached) return cached;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=simplified&geometries=geojson`;
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as {
        routes?: Array<{
          distance: number;
          duration: number;
          geometry?: { coordinates: [number, number][] };
        }>;
      };
      const firstRoute = data.routes?.[0];
      if (firstRoute?.geometry?.coordinates?.length) {
        const result: OsrmRouteResult = {
          // GeoJSON usa [lng, lat], Leaflet usa [lat, lng]
          coordinates: firstRoute.geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
          ]),
          distanceKm: Number((firstRoute.distance / 1000).toFixed(1)),
          durationMin: Math.max(3, Math.round(firstRoute.duration / 60)),
        };
        if (osrmRouteCache.size > 50) osrmRouteCache.clear();
        osrmRouteCache.set(coordsString, result);
        return result;
      }
    }
  } catch {
    // Fallback a línea directa entre puntos si no hay red
  }
  const fallback: OsrmRouteResult = {
    coordinates: waypoints.map((w) => [w.lat, w.lng]),
    distanceKm: 1.8,
    durationMin: 12,
  };
  osrmRouteCache.set(coordsString, fallback);
  return fallback;
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

export const INITIAL_DEMO_ORDERS: ActiveOrder[] = [];

function getLocalOrders(): ActiveOrder[] {
  if (typeof window === "undefined") return INITIAL_DEMO_ORDERS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActiveOrder[];
      if (Array.isArray(parsed)) return parsed;
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
  const restLoc =
    RESTAURANT_LOCATIONS[input.restaurantId] ||
    latLngToPueblaPoint(19.0461, -98.2128, input.restaurantAddress);
  const custLoc = input.customerLocation
    ? latLngToPueblaPoint(
        input.customerLocation.lat,
        input.customerLocation.lng,
        input.customerLocation.label || input.customerAddress,
      )
    : resolveCustomerLocation(input.customerEmail, input.customerAddress);
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
    if (
      target.courier &&
      (target.courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" ||
        target.courierStep === "ESPERANDO_PEDIDO")
    ) {
      target.courierStep = "EN_ENTREGA";
    }
  }
  if (kitchenStage === "ENTREGADO") {
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: existing.customerLocation,
      };
    }
    target.courierStep = "ENTREGADO";
    target.deliveredAt = now.toISOString();
  }
  const kitchenNotices: Record<KitchenOrderStage, string> = {
    POR_HACER: `Pedido recibido en ${existing.restaurantName}. Pendiente de aceptar en cocina.`,
    EN_PREPARACION: `¡${existing.restaurantName} aceptó tu pedido y ya lo está preparando en cocina!`,
    EN_ESPERA_REPARTIDOR: `¡Tu pedido ya está listo y empacado en mostrador de ${existing.restaurantName} (${existing.restaurantAddress}) esperando recolección del repartidor!`,
    EN_DELIVERY: `Paquete entregado en mostrador al repartidor ${target.courier?.name || "asignado"} para iniciar ruta a tu domicilio.`,
    ENTREGADO: `Pedido marcado como entregado.`,
    CANCELADO: `El pedido fue cancelado por el restaurante.`,
  };
  target.messages = [
    ...existing.messages,
    {
      id: `msg_${Date.now()}`,
      orderId,
      senderRole: "RESTAURANT",
      senderName: existing.restaurantName,
      text: kitchenNotices[kitchenStage],
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
  const previousStep = existing.courierStep;
  const target: ActiveOrder = {
    ...existing,
    courierStep,
    updatedAt: now.toISOString(),
  };

  if (
    courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" &&
    target.courier &&
    options?.courierLocation
  ) {
    target.courier = {
      ...target.courier,
      currentLocation: options.courierLocation,
    };
  } else if (courierStep === "ESPERANDO_PEDIDO" && target.courier) {
    target.courier = {
      ...target.courier,
      currentLocation: options?.courierLocation || existing.restaurantLocation,
    };
  } else if (courierStep === "EN_ENTREGA") {
    target.kitchenStage = "EN_DELIVERY";
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: options?.courierLocation || {
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
          label: "En trayecto hacia domicilio en Puebla",
        },
      };
    }
  } else if (courierStep === "EN_DOMICILIO") {
    target.kitchenStage = "EN_DELIVERY";
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: options?.courierLocation || existing.customerLocation,
      };
    }
  } else if (courierStep === "ENTREGADO") {
    target.kitchenStage = "ENTREGADO";
    target.deliveredAt = now.toISOString();
    if (target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: options?.courierLocation || existing.customerLocation,
      };
    }
  }

  const stepNotice: Record<CourierTrackingStep, string> = {
    SIN_ASIGNAR: "Sin repartidor asignado.",
    ACEPTADO_EN_RUTA_RESTAURANTE: "En camino al restaurante para recoger.",
    ESPERANDO_PEDIDO: `Llegué a ${existing.restaurantName} (${existing.restaurantAddress}) y estoy esperando a que me entreguen tu paquete.`,
    EN_ENTREGA: `¡Ya recibí tu pedido en ${existing.restaurantName}! Voy en camino hacia tu domicilio en ${existing.customerAddress}.`,
    EN_DOMICILIO: `Ya llegué a tu domicilio (${existing.customerAddress}). Ten listo tu PIN de entrega.`,
    ENTREGADO: `Pedido entregado satisfactoriamente. ¡Buen provecho!`,
  };

  if (previousStep !== courierStep) {
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
  }
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
