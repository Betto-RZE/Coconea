import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  ActiveOrder,
  CourierInfo,
  CourierTrackingStep,
  CreateOrderInput,
  GeoPoint,
  KitchenOrderStage,
  OrderChatMessage,
} from "@coconea/types";

const RESTAURANT_LOCATIONS: Record<string, GeoPoint> = {
  "rest-raices": {
    x: 28,
    y: 34,
    lat: 19.4182,
    lng: -99.1635,
    label: "Av. Álvaro Obregón 160, Roma Norte",
  },
  "rest-botanica": {
    x: 64,
    y: 26,
    lat: 19.4201,
    lng: -99.1592,
    label: "Colima 120, Roma Norte",
  },
  "rest-pacifico": {
    x: 46,
    y: 58,
    lat: 19.415,
    lng: -99.161,
    label: "Av. Insurgentes Sur 318, Roma Sur",
  },
  "rest-dominos": {
    x: 74,
    y: 64,
    lat: 19.4142,
    lng: -99.1565,
    label: "Orizaba 95, Roma Norte",
  },
  "rest-greengrass": {
    x: 22,
    y: 68,
    lat: 19.4138,
    lng: -99.1668,
    label: "Av. Sonora 180, Hipódromo Condesa",
  },
};

const KITCHEN_STAGE_LABELS: Record<KitchenOrderStage, string> = {
  POR_HACER: "Por hacer",
  EN_PREPARACION: "En preparación",
  EN_ESPERA_REPARTIDOR: "En espera de recibir",
  EN_DELIVERY: "En delivery",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

function resolveCustomerLocation(
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

function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const dx = (a.x - b.x) * 0.042;
  const dy = (a.y - b.y) * 0.042;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0.4, Number(dist.toFixed(1)));
}

const SEED_ORDERS: ActiveOrder[] = [
  {
    id: "ORD-2026-082",
    proposalCode: "PROP-8419",
    restaurantId: "rest-botanica",
    restaurantName: "Subway",
    restaurantAddress: "Colima 120, Roma Norte",
    restaurantLocation: RESTAURANT_LOCATIONS["rest-botanica"],
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
    dishName: "Sub Pechuga de Pavo Integral & Aguacate",
    dishPrice: 145,
    beverageId: null,
    beverageName: null,
    beveragePrice: 0,
    compostableCutlery: true,
    allergens: ["Sin Lácteos"],
    dietaryNotes: ["Alto en Proteína", "Sin Azúcares Añadidos"],
    caloriesText: "490 kcal • 36g Prot",
    subtotal: 145,
    deliveryFee: 20,
    serviceFee: 15,
    total: 180,
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
    restaurantLocation: RESTAURANT_LOCATIONS["rest-greengrass"],
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
    dishName: "Bowl Mediterráneo de Quinoa & Falafel",
    dishPrice: 155,
    beverageId: null,
    beverageName: null,
    beveragePrice: 0,
    compostableCutlery: true,
    allergens: ["Sin Lácteos", "Sin Huevo", "100% Vegano"],
    dietaryNotes: ["Vegana", "Orgánico"],
    caloriesText: "520 kcal • 24g Prot",
    subtotal: 155,
    deliveryFee: 20,
    serviceFee: 15,
    total: 190,
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
        text: "Cocina preparando orden con protocolo libre de lácteos.",
        timestamp: "12:45",
      },
    ],
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    deliveredAt: null,
  },
];

@Injectable()
export class OrdersService {
  private readonly storePath = resolve(process.cwd(), "../../tmp/active-orders.json");
  private ordersCache: ActiveOrder[] | null = null;

  private loadOrders(): ActiveOrder[] {
    if (this.ordersCache) return this.ordersCache;
    try {
      if (existsSync(this.storePath)) {
        const raw = readFileSync(this.storePath, "utf8");
        const parsed = JSON.parse(raw) as ActiveOrder[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.ordersCache = parsed;
          return parsed;
        }
      }
    } catch {
      // Fallback to seed orders
    }
    this.ordersCache = structuredClone(SEED_ORDERS);
    this.persistOrders(this.ordersCache);
    return this.ordersCache;
  }

  private persistOrders(orders: ActiveOrder[]): void {
    this.ordersCache = orders;
    try {
      const dir = resolve(process.cwd(), "../../tmp");
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(this.storePath, JSON.stringify(orders, null, 2), "utf8");
    } catch {
      // In-memory cache remains active even if disk write fails
    }
  }

  listAll(restaurantId?: string): ActiveOrder[] {
    const all = this.loadOrders();
    if (restaurantId) {
      return all.filter((o) => o.restaurantId === restaurantId);
    }
    return all;
  }

  getById(orderId: string): ActiveOrder {
    const found = this.loadOrders().find((o) => o.id === orderId);
    if (!found) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    return found;
  }

  createOrder(input: CreateOrderInput): ActiveOrder {
    if (!input.restaurantId || !input.dishName || !input.customerName) {
      throw new BadRequestException(
        "Faltan datos obligatorios del restaurante, platillo o cliente.",
      );
    }

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
    const subtotal = Number(input.dishPrice) + Number(input.beveragePrice || 0);
    const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 899)}`;

    const newOrder: ActiveOrder = {
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
      dishPrice: Number(input.dishPrice),
      beverageId: input.beverageId || null,
      beverageName: input.beverageName || null,
      beveragePrice: Number(input.beveragePrice || 0),
      compostableCutlery: Boolean(input.compostableCutlery),
      allergens: input.allergens || [],
      dietaryNotes: input.dietaryNotes || ["Plan Equilibrado"],
      caloriesText: input.caloriesText || "550 kcal verificadas",
      subtotal,
      deliveryFee: Number(input.deliveryFee),
      serviceFee: Number(input.serviceFee),
      total: Number(input.total),
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

    const current = this.loadOrders();
    this.persistOrders([newOrder, ...current]);
    return newOrder;
  }

  updateKitchenStage(
    orderId: string,
    kitchenStage: KitchenOrderStage,
  ): ActiveOrder {
    const orders = this.loadOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const updated: ActiveOrder = {
      ...orders[idx],
      kitchenStage,
      updatedAt: now.toISOString(),
    };
    if (kitchenStage === "ENTREGADO") {
      updated.courierStep = "ENTREGADO";
      updated.deliveredAt = now.toISOString();
    }
    updated.messages = [
      ...updated.messages,
      {
        id: `msg_${Date.now()}`,
        orderId,
        senderRole: "RESTAURANT",
        senderName: updated.restaurantName,
        text: `Estado en cocina actualizado a: ${KITCHEN_STAGE_LABELS[kitchenStage]}.`,
        timestamp: timeLabel,
      },
    ];
    orders[idx] = updated;
    this.persistOrders(orders);
    return updated;
  }

  acceptByCourier(orderId: string, courier: CourierInfo): ActiveOrder {
    const orders = this.loadOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const updated: ActiveOrder = {
      ...orders[idx],
      courier,
      courierStep: "ACEPTADO_EN_RUTA_RESTAURANTE",
      updatedAt: now.toISOString(),
    };
    updated.messages = [
      ...updated.messages,
      {
        id: `msg_${Date.now()}`,
        orderId,
        senderRole: "DELIVERY",
        senderName: courier.name,
        text: `¡Hola! Soy ${courier.name}, acepté tu pedido en mi ruta (${courier.vehicle}). Voy rumbo a ${updated.restaurantName}.`,
        timestamp: timeLabel,
      },
    ];
    orders[idx] = updated;
    this.persistOrders(orders);
    return updated;
  }

  rejectByCourier(orderId: string, courierId: string): ActiveOrder {
    const orders = this.loadOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    const target = { ...orders[idx] };
    if (!target.rejectedByCourierIds.includes(courierId)) {
      target.rejectedByCourierIds = [...target.rejectedByCourierIds, courierId];
    }
    target.updatedAt = new Date().toISOString();
    orders[idx] = target;
    this.persistOrders(orders);
    return target;
  }

  updateCourierStep(
    orderId: string,
    courierStep: CourierTrackingStep,
    options?: { deliveryPin?: string; courierLocation?: GeoPoint },
  ): ActiveOrder {
    const orders = this.loadOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    const target = { ...orders[idx] };

    if (
      courierStep === "ENTREGADO" &&
      options?.deliveryPin &&
      options.deliveryPin.trim() !== target.deliveryPin
    ) {
      throw new BadRequestException(
        "El PIN de entrega proporcionado no coincide con el del consumidor.",
      );
    }

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    target.courierStep = courierStep;
    target.updatedAt = now.toISOString();

    if (courierStep === "ESPERANDO_PEDIDO" && target.courier) {
      target.courier = {
        ...target.courier,
        currentLocation: options?.courierLocation || target.restaurantLocation,
      };
    } else if (courierStep === "EN_ENTREGA") {
      target.kitchenStage = "EN_DELIVERY";
      if (target.courier) {
        target.courier = {
          ...target.courier,
          currentLocation: options?.courierLocation || {
            x: Math.round(
              (target.restaurantLocation.x + target.customerLocation.x) / 2,
            ),
            y: Math.round(
              (target.restaurantLocation.y + target.customerLocation.y) / 2,
            ),
            lat:
              (target.restaurantLocation.lat + target.customerLocation.lat) / 2,
            lng:
              (target.restaurantLocation.lng + target.customerLocation.lng) / 2,
            label: "En trayecto hacia domicilio",
          },
        };
      }
    } else if (courierStep === "EN_DOMICILIO") {
      target.kitchenStage = "EN_DELIVERY";
      if (target.courier) {
        target.courier = {
          ...target.courier,
          currentLocation: options?.courierLocation || target.customerLocation,
        };
      }
    } else if (courierStep === "ENTREGADO") {
      target.kitchenStage = "ENTREGADO";
      target.deliveredAt = now.toISOString();
      if (target.courier) {
        target.courier = {
          ...target.courier,
          currentLocation: options?.courierLocation || target.customerLocation,
        };
      }
    }

    const stepNotice: Record<CourierTrackingStep, string> = {
      SIN_ASIGNAR: "Sin repartidor asignado.",
      ACEPTADO_EN_RUTA_RESTAURANTE: "En camino al restaurante para recoger.",
      ESPERANDO_PEDIDO: `Llegué a ${target.restaurantName} y estoy esperando a que me entreguen tu paquete.`,
      EN_ENTREGA: `¡Ya tengo tu pedido de ${target.restaurantName}! Voy en camino hacia ${target.customerAddress}.`,
      EN_DOMICILIO: `Ya llegué a tu domicilio (${target.customerAddress}). Ten listo tu PIN de entrega.`,
      ENTREGADO: `Pedido entregado satisfactoriamente. ¡Buen provecho!`,
    };

    target.messages = [
      ...target.messages,
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
    this.persistOrders(orders);
    return target;
  }

  addMessage(
    orderId: string,
    senderRole: "USER" | "DELIVERY" | "RESTAURANT" | "SYSTEM",
    senderName: string,
    text: string,
  ): ActiveOrder {
    const orders = this.loadOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new NotFoundException(`No se encontró el pedido ${orderId}.`);
    }
    const trimmed = (text || "").trim();
    if (!trimmed) {
      throw new BadRequestException("El mensaje no puede estar vacío.");
    }
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg: OrderChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      orderId,
      senderRole,
      senderName: senderName || "Usuario",
      text: trimmed,
      timestamp: timeLabel,
    };
    const updated: ActiveOrder = {
      ...orders[idx],
      updatedAt: now.toISOString(),
      messages: [...orders[idx].messages, newMsg],
    };
    orders[idx] = updated;
    this.persistOrders(orders);
    return updated;
  }
}
