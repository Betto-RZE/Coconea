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
    x: 41,
    y: 41,
    lat: 19.0488,
    lng: -98.2165,
    label: "Av. Juárez 2318,Zona Esmeralda / La Paz, Puebla, Pue.",
  },
  "rest-botanica": {
    x: 56,
    y: 46,
    lat: 19.0453,
    lng: -98.1998,
    label: "Av. Reforma 518, Centro Histórico, Puebla, Pue.",
  },
  "rest-pacifico": {
    x: 61,
    y: 55,
    lat: 19.0398,
    lng: -98.1945,
    label: "Blvd. Héroes del 5 de Mayo 704, El Carmen, Puebla, Pue.",
  },
  "rest-dominos": {
    x: 52,
    y: 62,
    lat: 19.0345,
    lng: -98.2042,
    label: "Av. 43 Poniente 302, Huexotitla, Puebla, Pue.",
  },
  "rest-greengrass": {
    x: 29,
    y: 69,
    lat: 19.0298,
    lng: -98.2305,
    label: "Blvd. del Niño Poblano 2510, Reserva Territorial Atlixcáyotl (Angelópolis), Puebla, Pue.",
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
      x: 59,
      y: 48,
      lat: 19.0439,
      lng: -98.1962,
      label: customerAddress || "Calle 3 Sur 304, Centro Histórico, Puebla, Pue.",
    };
  }
  if (email.includes("valeria")) {
    return {
      x: 34,
      y: 72,
      lat: 19.0278,
      lng: -98.2248,
      label: customerAddress || "Vía Atlixcáyotl 3248, Corredor Comercial Angelópolis, Puebla, Pue.",
    };
  }
  return {
    x: 37,
    y: 35,
    lat: 19.0528,
    lng: -98.2215,
    label: customerAddress || "Calle Teziutlán Sur 48, Col. La Paz, Puebla, Pue.",
  };
}

function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  const roadDistance = R * c * 1.28;
  return Math.max(0.4, Number(roadDistance.toFixed(1)));
}

const SEED_ORDERS: ActiveOrder[] = [];

@Injectable()
export class OrdersService {
  private readonly repoRoot = existsSync(
    resolve(process.cwd(), "pnpm-workspace.yaml"),
  )
    ? process.cwd()
    : resolve(process.cwd(), "../..");
  private readonly storePath = resolve(
    this.repoRoot,
    "tmp/live-orders-puebla.json",
  );
  private ordersCache: ActiveOrder[] | null = null;

  private loadOrders(): ActiveOrder[] {
    try {
      if (existsSync(this.storePath)) {
        const raw = readFileSync(this.storePath, "utf8");
        const parsed = JSON.parse(raw) as ActiveOrder[];
        if (Array.isArray(parsed)) {
          this.ordersCache = parsed;
          return parsed;
        }
      }
    } catch {
      if (this.ordersCache) return this.ordersCache;
    }
    if (this.ordersCache) return this.ordersCache;
    this.ordersCache = structuredClone(SEED_ORDERS);
    this.persistOrders(this.ordersCache);
    return this.ordersCache;
  }

  private persistOrders(orders: ActiveOrder[]): void {
    this.ordersCache = orders;
    try {
      const dir = resolve(this.repoRoot, "tmp");
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
      x: 50,
      y: 50,
      lat: 19.0436,
      lng: -98.2062,
      label: input.restaurantAddress,
    };
    const custLoc = input.customerLocation
      ? {
          ...input.customerLocation,
          label: input.customerAddress || input.customerLocation.label,
        }
      : resolveCustomerLocation(
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
    if (kitchenStage === "EN_DELIVERY") {
      if (
        updated.courier &&
        (updated.courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" ||
          updated.courierStep === "ESPERANDO_PEDIDO")
      ) {
        updated.courierStep = "EN_ENTREGA";
      }
    }
    if (kitchenStage === "ENTREGADO") {
      if (updated.courier) {
        updated.courier = {
          ...updated.courier,
          currentLocation: updated.customerLocation,
        };
      }
      updated.courierStep = "ENTREGADO";
      updated.deliveredAt = now.toISOString();
    }
    const kitchenNotices: Record<KitchenOrderStage, string> = {
      POR_HACER: `Pedido recibido en ${updated.restaurantName}. Pendiente de aceptar en cocina.`,
      EN_PREPARACION: `¡${updated.restaurantName} aceptó tu pedido y ya lo está preparando en cocina!`,
      EN_ESPERA_REPARTIDOR: `¡Tu pedido ya está listo y empacado en mostrador de ${updated.restaurantName} (${updated.restaurantAddress}) esperando recolección del repartidor!`,
      EN_DELIVERY: `Paquete entregado en mostrador al repartidor ${updated.courier?.name || "asignado"} para iniciar ruta a tu domicilio.`,
      ENTREGADO: `Pedido marcado como entregado.`,
      CANCELADO: `El pedido fue cancelado por el restaurante.`,
    };
    updated.messages = [
      ...updated.messages,
      {
        id: `msg_${Date.now()}`,
        orderId,
        senderRole: "RESTAURANT",
        senderName: updated.restaurantName,
        text: kitchenNotices[kitchenStage],
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
    const previousStep = target.courierStep;
    target.courierStep = courierStep;
    target.updatedAt = now.toISOString();

    if (courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" && target.courier && options?.courierLocation) {
      target.courier = {
        ...target.courier,
        currentLocation: options.courierLocation,
      };
    } else if (courierStep === "ESPERANDO_PEDIDO" && target.courier) {
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
            label: "En trayecto hacia domicilio en Puebla",
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
      ESPERANDO_PEDIDO: `Llegué a ${target.restaurantName} (${target.restaurantAddress}) y estoy esperando a que me entreguen tu paquete.`,
      EN_ENTREGA: `¡Ya recibí tu pedido en ${target.restaurantName}! Voy en camino hacia tu domicilio en ${target.customerAddress}.`,
      EN_DOMICILIO: `Ya llegué a tu domicilio (${target.customerAddress}). Ten listo tu PIN de entrega.`,
      ENTREGADO: `Pedido entregado satisfactoriamente. ¡Buen provecho!`,
    };

    if (previousStep !== courierStep) {
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
    }

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

