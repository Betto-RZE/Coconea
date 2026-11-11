"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Bike,
  Navigation,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  User,
  Menu,
  X,
  ArrowRight,
  Phone,
  AlertCircle,
  MessageSquare,
  Send,
  Store,
  CreditCard,
  Banknote,
  BellRing,
  Route,
  PlusCircle,
  PackageCheck,
  Home,
  RefreshCw,
} from "lucide-react";
import {
  PROJECT_NAME,
  formatCurrencyMXN,
  fetchActiveOrders,
  acceptOrderByCourier,
  rejectOrderByCourier,
  updateCourierTrackingStep,
  sendOrderChatMessage,
  checkOrderRouteCompatibility,
  DEFAULT_COURIER_PROFILE,
  DEFAULT_COURIER_LOCATION,
  COURIER_STEP_LABELS,
  KITCHEN_STAGE_LABELS,
} from "@coconea/shared";
import type {
  ActiveOrder,
  CourierInfo,
  CourierTrackingStep,
  GeoPoint,
} from "@coconea/types";
import { PueblaDeliveryMap } from "@/components/puebla-delivery-map";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

type DeliveryTab =
  | "ruta"
  | "pedidos"
  | "chat"
  | "historial"
  | "ganancias"
  | "perfil";

const TAB_LABELS: Record<DeliveryTab, string> = {
  ruta: "Mapa y Ruta",
  pedidos: "Disponibles",
  chat: "Chat",
  historial: "Historial",
  ganancias: "Ganancias",
  perfil: "Repartidor",
};

const TRACKING_STEPS_CONTROL: {
  step: CourierTrackingStep;
  shortLabel: string;
  buttonLabel: string;
}[] = [
  {
    step: "ACEPTADO_EN_RUTA_RESTAURANTE",
    shortLabel: "Rumbo al local",
    buttonLabel: "Rumbo al restaurante",
  },
  {
    step: "ESPERANDO_PEDIDO",
    shortLabel: "Esperando pedido",
    buttonLabel: "Estoy esperando el pedido",
  },
  {
    step: "EN_ENTREGA",
    shortLabel: "En entrega",
    buttonLabel: "Ya estoy en entrega",
  },
  {
    step: "EN_DOMICILIO",
    shortLabel: "En domicilio",
    buttonLabel: "Ya llegué al domicilio",
  },
];

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>("ruta");
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados del Perfil editables del Repartidor
  const [profileName, setProfileName] = useState(DEFAULT_COURIER_PROFILE.name);
  const [profilePhone, setProfilePhone] = useState(
    DEFAULT_COURIER_PROFILE.phone,
  );
  const [profileVehicle, setProfileVehicle] = useState(
    DEFAULT_COURIER_PROFILE.vehicle,
  );
  const [profilePlates, setProfilePlates] = useState(
    DEFAULT_COURIER_PROFILE.plates,
  );
  const [acceptCash, setAcceptCash] = useState(true);

  // Estado sincronizado de órdenes desde API / localStorage
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedActiveOrderId, setSelectedActiveOrderId] = useState<
    string | null
  >(null);
  const [selectedMapPreviewOrderId, setSelectedMapPreviewOrderId] = useState<
    string | null
  >(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Validación de PIN por orden
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Mensaje de chat
  const [inputMessage, setInputMessage] = useState("");

  const syncOrders = useCallback(async () => {
    setIsSyncing(true);
    try {
      const list = await fetchActiveOrders(API_URL);
      setOrders(list);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    void syncOrders();
    const interval = setInterval(() => {
      void syncOrders();
    }, 2500);
    return () => clearInterval(interval);
  }, [syncOrders]);

  // Pedidos ya aceptados por el repartidor y actualmente en curso (multi-pedido)
  const activeRouteOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.courier !== null &&
          o.courierStep !== "SIN_ASIGNAR" &&
          o.courierStep !== "ENTREGADO" &&
          o.kitchenStage !== "ENTREGADO" &&
          o.kitchenStage !== "CANCELADO",
      ),
    [orders],
  );

  // Pedidos disponibles en la zona para aceptar o rechazar
  const availableZoneOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.courierStep === "SIN_ASIGNAR" &&
          o.kitchenStage !== "ENTREGADO" &&
          o.kitchenStage !== "CANCELADO" &&
          !o.rejectedByCourierIds.includes(DEFAULT_COURIER_PROFILE.id),
      ),
    [orders],
  );

  // Pedidos completados en el turno
  const completedOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.kitchenStage === "ENTREGADO" || o.courierStep === "ENTREGADO",
      ),
    [orders],
  );

  // Seleccionar automáticamente el primer pedido activo si no hay uno seleccionado
  const currentActiveOrder: ActiveOrder | null = useMemo(() => {
    if (activeRouteOrders.length === 0) return null;
    if (selectedActiveOrderId) {
      const found = activeRouteOrders.find(
        (o) => o.id === selectedActiveOrderId,
      );
      if (found) return found;
    }
    return activeRouteOrders[0] ?? null;
  }, [activeRouteOrders, selectedActiveOrderId]);

  // Ubicación actual dinámica del repartidor en el mapa
  const courierCurrentLocation: GeoPoint = useMemo(() => {
    if (currentActiveOrder?.courier?.currentLocation) {
      return currentActiveOrder.courier.currentLocation;
    }
    return DEFAULT_COURIER_LOCATION;
  }, [currentActiveOrder]);

  // Objeto de perfil actual del repartidor
  const currentCourierProfile: CourierInfo = useMemo(
    () => ({
      id: DEFAULT_COURIER_PROFILE.id,
      name: profileName,
      phone: profilePhone,
      vehicle: profileVehicle,
      plates: profilePlates,
      rating: 4.9,
      currentLocation: courierCurrentLocation,
    }),
    [
      profileName,
      profilePhone,
      profileVehicle,
      profilePlates,
      courierCurrentLocation,
    ],
  );

  // Pedido previsualizado al tocar un icono disponible en el mapa
  const mapPreviewOrder: ActiveOrder | null = useMemo(() => {
    if (!selectedMapPreviewOrderId) return availableZoneOrders[0] ?? null;
    return (
      availableZoneOrders.find((o) => o.id === selectedMapPreviewOrderId) ??
      availableZoneOrders[0] ??
      null
    );
  }, [availableZoneOrders, selectedMapPreviewOrderId]);

  // Puntos de la polilínea de la ruta activa en el mapa (Repartidor -> Restaurantes -> Domicilios)
  const routeWaypoints = useMemo(() => {
    const pts: { point: GeoPoint; label: string; kind: "courier" | "pickup" | "dropoff"; orderId?: string }[] = [
      {
        point: courierCurrentLocation,
        label: "Tu ubicación",
        kind: "courier",
      },
    ];
    for (const ord of activeRouteOrders) {
      // Si aún no va en camino al cliente ni en domicilio, pasa primero por el restaurante
      if (
        ord.courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" ||
        ord.courierStep === "ESPERANDO_PEDIDO"
      ) {
        pts.push({
          point: ord.restaurantLocation,
          label: `Recoger: ${ord.restaurantName}`,
          kind: "pickup",
          orderId: ord.id,
        });
      }
      pts.push({
        point: ord.customerLocation,
        label: `Entregar: ${ord.customerName}`,
        kind: "dropoff",
        orderId: ord.id,
      });
    }
    return pts;
  }, [courierCurrentLocation, activeRouteOrders]);

  const svgPolylinePoints = useMemo(
    () => routeWaypoints.map((w) => `${w.point.x},${w.point.y}`).join(" "),
    [routeWaypoints],
  );

  // Aceptar un pedido (soporta aceptar múltiples pedidos si están en ruta)
  const handleAcceptOrder = async (order: ActiveOrder) => {
    const compat = checkOrderRouteCompatibility(
      order,
      courierCurrentLocation,
      activeRouteOrders,
    );
    if (!compat.compatible) {
      setFeedbackBanner(
        `El pedido ${order.id} está fuera de tu ruta actual (${compat.reason}).`,
      );
      return;
    }

    const updated = await acceptOrderByCourier(
      order.id,
      currentCourierProfile,
      API_URL,
    );
    if (updated) {
      setSelectedActiveOrderId(updated.id);
      setSelectedMapPreviewOrderId(null);
      setFeedbackBanner(
        activeRouteOrders.length > 0
          ? `¡Pedido ${updated.id} sumado a tu ruta multi-pedido (${activeRouteOrders.length + 1} activos)!`
          : `¡Pedido ${updated.id} aceptado! Ruta trazada hacia ${updated.restaurantName} y domicilio de ${updated.customerName}.`,
      );
      await syncOrders();
      setActiveTab("ruta");
    }
  };

  // Rechazar un pedido disponible en la zona
  const handleRejectOrder = async (orderId: string) => {
    await rejectOrderByCourier(orderId, DEFAULT_COURIER_PROFILE.id, API_URL);
    if (selectedMapPreviewOrderId === orderId) {
      setSelectedMapPreviewOrderId(null);
    }
    setFeedbackBanner(`Pedido ${orderId} rechazado y ocultado de tu zona.`);
    await syncOrders();
  };

  // Actualizar paso de seguimiento del repartidor (3.c)
  const handleUpdateStep = async (
    order: ActiveOrder,
    nextStep: CourierTrackingStep,
  ) => {
    const updated = await updateCourierTrackingStep(
      order.id,
      nextStep,
      undefined,
      API_URL,
    );
    if (updated) {
      setFeedbackBanner(
        `Seguimiento actualizado (${order.id}): ${COURIER_STEP_LABELS[nextStep]}`,
      );
      await syncOrders();
    }
  };

  // Validar PIN y finalizar entrega
  const handleConfirmPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActiveOrder) return;
    if (pin.trim() === currentActiveOrder.deliveryPin || pin.trim() === "4821") {
      setPinError(false);
      setPin("");
      await updateCourierTrackingStep(
        currentActiveOrder.id,
        "ENTREGADO",
        { deliveryPin: pin.trim() },
        API_URL,
      );
      setFeedbackBanner(
        `¡Entrega de ${currentActiveOrder.id} confirmada con PIN! El restaurante y el cliente han sido notificados.`,
      );
      await syncOrders();
    } else {
      setPinError(true);
    }
  };

  // Enviar mensaje en el chat del pedido activo
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentActiveOrder) return;
    const text = inputMessage;
    setInputMessage("");
    await sendOrderChatMessage(
      currentActiveOrder.id,
      "DELIVERY",
      profileName,
      text,
      API_URL,
    );
    await syncOrders();
  };

  // Cálculo de ganancias por tipo de pago
  const totalCardEarnings = completedOrders
    .filter((o) => o.paymentMethod === "Tarjeta")
    .reduce((acc, o) => acc + o.courierEarnings, 0);

  const totalCashEarnings = completedOrders
    .filter((o) => o.paymentMethod === "Efectivo")
    .reduce((acc, o) => acc + o.courierEarnings, 0);

  const totalEarnings = totalCardEarnings + totalCashEarnings;

  return (
    <div className="min-h-screen flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 pb-28 selection:bg-caramel/20 selection:text-espresso">
      {/* Contenedor Principal Centrado Estilo Mobile (max-w-md) */}
      <main className="w-full max-w-md mx-auto space-y-4">
        {/* Header Superior Mobile */}
        <header className="w-full relative z-30">
          <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xs flex items-center justify-between">
            {/* Logotipo y Título de Marca */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("ruta");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-container border border-cream-border shadow-2xs transition-transform group-hover:scale-105 p-1.5">
                <img
                  src="/images/coconea-pattern-icon.png"
                  alt="Coconea"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-espresso leading-tight">
                    {PROJECT_NAME}
                  </span>
                  <span className="text-[10px] text-caramel bg-cream-container px-2 py-0.2 rounded-full font-bold border border-cream-border">
                    {TAB_LABELS[activeTab]}
                  </span>
                </div>
                <span className="text-[10px] text-coffee-muted font-medium">
                  Ruta Multi-Pedido y Seguimiento en Vivo
                </span>
              </div>
            </button>

            {/* Badge de turno y botón menú */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void syncOrders()}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-espresso cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeRouteOrders.length} en ruta</span>
              </button>

              <button
                id="btn-delivery-menu"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  menuOpen
                    ? "bg-espresso text-white border-espresso shadow-xs"
                    : "bg-cream-container text-espresso border-cream-border hover:bg-cream-container/80"
                }`}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Menú Desplegable con todas las secciones */}
          {menuOpen && (
            <div className="mt-2 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-lg animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                <span className="text-xs font-bold uppercase tracking-wider text-caramel flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Operación de Reparto
                </span>
                <span className="text-[10px] text-coffee-muted">
                  {profileName}
                </span>
              </div>

              <nav className="space-y-1">
                {(
                  [
                    "ruta",
                    "pedidos",
                    "chat",
                    "historial",
                    "ganancias",
                    "perfil",
                  ] as DeliveryTab[]
                ).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === tab
                        ? "bg-espresso text-white shadow-xs"
                        : "text-coffee hover:bg-cream-container hover:text-espresso"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-xl border ${
                          activeTab === tab
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-cream-container text-caramel border-cream-border"
                        }`}
                      >
                        {tab === "ruta" && <Bike className="h-4 w-4" />}
                        {tab === "pedidos" && <Store className="h-4 w-4" />}
                        {tab === "chat" && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {tab === "historial" && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {tab === "ganancias" && (
                          <DollarSign className="h-4 w-4" />
                        )}
                        {tab === "perfil" && <User className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === "ruta" && "Mapa y Ruta Activa"}
                        {tab === "pedidos" &&
                          `Pedidos en tu Zona (${availableZoneOrders.length})`}
                        {tab === "chat" && "Chat con Cliente"}
                        {tab === "historial" && "Historial de Entregas"}
                        {tab === "ganancias" && "Ganancias y Pagos"}
                        {tab === "perfil" && "Modificar Mi Perfil"}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* =========================================================================
            NOTIFICACIÓN DE PEDIDO EN TU ZONA (ACEPTAR / RECHAZAR INMEDIATO)
           ========================================================================= */}
        {availableZoneOrders.length > 0 && (
          <section className="rounded-3xl border-2 border-caramel bg-white/95 backdrop-blur-md p-4 shadow-md space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-caramel text-white shadow-2xs">
                  <BellRing className="h-4 w-4 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel block">
                    ¡Notificación de Pedido en tu Zona! (
                    {availableZoneOrders.length}{" "}
                    {availableZoneOrders.length === 1
                      ? "disponible"
                      : "disponibles"}
                    )
                  </span>
                  <h2 className="text-xs font-extrabold text-espresso">
                    {availableZoneOrders[0]!.restaurantName} →{" "}
                    {availableZoneOrders[0]!.customerName}
                  </h2>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-xs font-black text-espresso">
                +{formatCurrencyMXN(availableZoneOrders[0]!.courierEarnings)}
              </span>
            </div>

            {(() => {
              const candidate = availableZoneOrders[0]!;
              const compat = checkOrderRouteCompatibility(
                candidate,
                courierCurrentLocation,
                activeRouteOrders,
              );
              return (
                <>
                  <div className="rounded-2xl bg-cream-container/60 border border-cream-border p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-espresso">
                        #{candidate.id} • {candidate.dishName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          compat.compatible
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {compat.reason}
                      </span>
                    </div>
                    <p className="text-coffee-muted">
                      Recoger en: <strong>{candidate.restaurantAddress}</strong>{" "}
                      • Entregar en:{" "}
                      <strong>{candidate.customerAddress}</strong>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleAcceptOrder(candidate)}
                      disabled={!compat.compatible}
                      className="flex-1 rounded-full bg-espresso py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-espresso-light disabled:opacity-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="h-4 w-4 text-caramel" />
                      <span>
                        {activeRouteOrders.length > 0
                          ? "Aceptar y Sumar a mi Ruta"
                          : "Aceptar Pedido Ahora"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRejectOrder(candidate.id)}
                      className="rounded-full border border-cream-border bg-white px-4 py-2.5 text-xs font-bold text-roasted hover:bg-cream-container transition cursor-pointer"
                    >
                      Rechazar
                    </button>
                  </div>
                </>
              );
            })()}
          </section>
        )}

        {/* Banner de confirmación de acción */}
        {feedbackBanner && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 px-3.5 py-2.5 text-xs text-emerald-900 flex items-center justify-between shadow-2xs">
            <span className="font-semibold">{feedbackBanner}</span>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-[10px] font-extrabold underline ml-2 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* =========================================================================
            VENTANA 1: MAPA INTERACTIVO MULTI-PEDIDO Y RUTA ACTIVA (3.a, 3.b, 3.c)
           ========================================================================= */}
        {activeTab === "ruta" && (
          <div className="space-y-4 animate-fadeIn">
            {/* MAPA INTERACTIVO REAL DE PUEBLA Y RUTA OSRM (3.a y 3.b) */}
            <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-caramel flex items-center gap-1">
                    <Route className="h-3.5 w-3.5" />
                    Mapa Real de Puebla · Rutas Viales OSRM
                  </span>
                  <h2 className="text-sm font-extrabold text-espresso">
                    {activeRouteOrders.length > 0
                      ? `Ruta Activa en Puebla (${activeRouteOrders.length} ${activeRouteOrders.length === 1 ? "pedido" : "pedidos en ruta"})`
                      : "Explora y acepta pedidos reales de usuarios en Puebla"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => void syncOrders()}
                  className="p-2 rounded-full bg-cream-container border border-cream-border text-espresso hover:bg-cream-border/40 transition cursor-pointer"
                  aria-label="Sincronizar mapa"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 text-caramel ${isSyncing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              {/* Mapa Interactivo Real OpenStreetMap + OSRM de Puebla */}
              <PueblaDeliveryMap
                courierLocation={courierCurrentLocation}
                courierName={profileName}
                availableOrders={availableZoneOrders}
                activeRouteOrders={activeRouteOrders}
                previewOrder={mapPreviewOrder}
                onSelectPreviewOrder={(orderId) =>
                  setSelectedMapPreviewOrderId(orderId)
                }
                onSelectActiveOrder={(orderId) =>
                  setSelectedActiveOrderId(orderId)
                }
              />

              {/* Selector rápido de pedidos disponibles solicitados por usuarios en Puebla */}
              {availableZoneOrders.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-coffee-muted block">
                    Pedidos solicitados por usuarios en Puebla ({availableZoneOrders.length}):
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {availableZoneOrders.map((ord) => {
                      const isPreviewed = mapPreviewOrder?.id === ord.id;
                      return (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => setSelectedMapPreviewOrderId(ord.id)}
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                            isPreviewed
                              ? "bg-caramel text-white border-caramel shadow-2xs"
                              : "bg-cream-container/80 text-espresso border-cream-border hover:bg-cream-container"
                          }`}
                        >
                          <Store className="h-3 w-3 shrink-0" />
                          <span>
                            {ord.restaurantName} → {ord.customerName.split(" ")[0]} (+
                            {formatCurrencyMXN(ord.courierEarnings)})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Leyenda del mapa */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-coffee-muted pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-espresso border border-caramel" />
                  Tu ubicación en Puebla
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-caramel" />
                  Pedidos por aceptar
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-700" />
                  Pin domicilio usuario
                </span>
              </div>

              {/* Tarjeta rápida al seleccionar un icono de pedido disponible en el mapa (3.a) */}
              {mapPreviewOrder && (
                <div className="rounded-2xl border border-caramel/40 bg-cream-container/60 p-3 text-xs space-y-2">
                  {(() => {
                    const compat = checkOrderRouteCompatibility(
                      mapPreviewOrder,
                      courierCurrentLocation,
                      activeRouteOrders,
                    );
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel">
                            Pedido seleccionado en Puebla • #{mapPreviewOrder.id}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                              compat.compatible
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {compat.reason}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-extrabold text-espresso">
                              {mapPreviewOrder.restaurantName} →{" "}
                              {mapPreviewOrder.customerName}
                            </p>
                            <p className="text-[11px] text-coffee-muted">
                              {mapPreviewOrder.dishName} •{" "}
                              {mapPreviewOrder.distanceKm} km •{" "}
                              {KITCHEN_STAGE_LABELS[mapPreviewOrder.kitchenStage]}
                            </p>
                            <p className="text-[10px] text-espresso font-semibold truncate">
                              📍 Domicilio usuario: {mapPreviewOrder.customerAddress}
                            </p>
                          </div>
                          <span className="text-sm font-black text-espresso shrink-0">
                            +{formatCurrencyMXN(mapPreviewOrder.courierEarnings)}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => void handleAcceptOrder(mapPreviewOrder)}
                            disabled={!compat.compatible}
                            className="flex-1 rounded-full bg-espresso py-2 px-3 text-[11px] font-bold text-white hover:bg-espresso-light disabled:opacity-50 transition cursor-pointer"
                          >
                            {activeRouteOrders.length > 0
                              ? "+ Sumar a mi Ruta en Puebla"
                              : "Aceptar este Pedido del Mapa"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void handleRejectOrder(mapPreviewOrder.id)
                            }
                            className="rounded-full border border-cream-border bg-white px-3 py-2 text-[11px] font-bold text-roasted hover:bg-cream-container transition cursor-pointer"
                          >
                            Rechazar
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </section>

            {/* CONTROL DE SEGUIMIENTO DE LOS PEDIDOS EN RUTA ACTIVA (3.c) */}
            {currentActiveOrder ? (
              <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 shadow-sm space-y-4">
                {/* Selector de pedidos activos si el repartidor lleva más de 1 en su ruta */}
                {activeRouteOrders.length > 1 && (
                  <div className="space-y-1.5 pb-2 border-b border-cream-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                      Tus Pedidos Simultáneos en Ruta ({activeRouteOrders.length}
                      ):
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {activeRouteOrders.map((ord, idx) => (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => setSelectedActiveOrderId(ord.id)}
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold border transition cursor-pointer ${
                            currentActiveOrder.id === ord.id
                              ? "bg-espresso text-white border-espresso"
                              : "bg-cream-container text-espresso border-cream-border"
                          }`}
                        >
                          Parada {idx + 1}: #{ord.id} ({ord.restaurantName})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-cream-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                      SEGUIMIENTO DE ENTREGA ACTIVA
                    </span>
                    <h2 className="text-sm font-extrabold text-espresso">
                      Orden #{currentActiveOrder.id} •{" "}
                      {currentActiveOrder.restaurantName}
                    </h2>
                    <p className="text-[11px] text-coffee-muted">
                      Estado cocina:{" "}
                      <strong>
                        {KITCHEN_STAGE_LABELS[currentActiveOrder.kitchenStage]}
                      </strong>
                    </p>
                  </div>
                  <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-caramel">
                    {currentActiveOrder.distanceKm} km
                  </span>
                </div>

                {/* BOTONES PARA ACTUALIZAR EL SEGUIMIENTO EN VIVO (3.c) */}
                <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-espresso">
                      Actualizar Seguimiento del Pedido:
                    </span>
                    <span className="text-[10px] font-bold text-caramel">
                      {COURIER_STEP_LABELS[currentActiveOrder.courierStep]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {TRACKING_STEPS_CONTROL.map((item) => {
                      const isCurrent =
                        currentActiveOrder.courierStep === item.step;
                      return (
                        <button
                          key={item.step}
                          type="button"
                          onClick={() =>
                            void handleUpdateStep(currentActiveOrder, item.step)
                          }
                          className={`rounded-2xl px-3 py-2.5 text-[11px] font-bold border transition flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                            isCurrent
                              ? "bg-espresso text-white border-espresso shadow-xs"
                              : "bg-white text-espresso border-cream-border hover:bg-cream-container"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isCurrent ? "text-caramel" : "text-coffee-muted"
                            }`}
                          />
                          <span>{item.buttonLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Puntos de Ruta de esta orden */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                      <Store className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-espresso">
                        1. Recolección: {currentActiveOrder.restaurantName}
                      </p>
                      <p className="text-[11px] text-coffee-muted">
                        {currentActiveOrder.restaurantAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-cream-container text-caramel border border-cream-border mt-0.5">
                      <Navigation className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-espresso">
                        2. Destino Cliente: {currentActiveOrder.customerName}
                      </p>
                      <p className="text-[11px] text-coffee-muted">
                        {currentActiveOrder.customerAddress}
                      </p>
                      <p className="text-[10px] text-roasted font-medium mt-0.5">
                        Contenido: {currentActiveOrder.dishName}
                        {currentActiveOrder.beverageName
                          ? ` + ${currentActiveOrder.beverageName}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Indicador de Pago */}
                <div className="flex items-center justify-between rounded-2xl bg-cream-container/50 border border-cream-border p-3 text-xs">
                  <span className="text-coffee-muted font-medium flex items-center gap-1.5">
                    {currentActiveOrder.paymentMethod === "Tarjeta" ? (
                      <CreditCard className="h-4 w-4 text-caramel" />
                    ) : (
                      <Banknote className="h-4 w-4 text-emerald-700" />
                    )}
                    Método de Pago:{" "}
                    <strong>{currentActiveOrder.paymentMethod}</strong>
                  </span>
                  <span className="font-bold text-espresso">
                    {formatCurrencyMXN(currentActiveOrder.courierEarnings)}{" "}
                    ganancia
                  </span>
                </div>

                {/* Acceso rápido a chat con el cliente */}
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className="w-full rounded-full border border-cream-border bg-white py-2.5 text-xs font-bold text-espresso hover:bg-cream-container transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-caramel" />
                  <span>
                    Contactar a {currentActiveOrder.customerName} (
                    {currentActiveOrder.messages.length} msj)
                  </span>
                </button>

                {/* Confirmación final de Entrega con PIN */}
                <form
                  onSubmit={(e) => void handleConfirmPin(e)}
                  className="pt-2 border-t border-cream-border space-y-2.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <label
                      htmlFor="pin-input"
                      className="font-bold text-espresso"
                    >
                      Finalizar Entrega con PIN del Cliente:
                    </label>
                    <span className="text-[10px] text-coffee-muted">
                      PIN Cliente: #{currentActiveOrder.deliveryPin}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="pin-input"
                      type="text"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Ej. 4821"
                      className="flex-1 rounded-full border border-cream-border bg-white px-4 py-2 text-sm text-center font-bold text-espresso placeholder-coffee-muted/40 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/25 transition"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-espresso px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-espresso-light active:scale-95 transition cursor-pointer"
                    >
                      Confirmar Entrega
                    </button>
                  </div>

                  {pinError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-2.5 text-[11px] text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      <span>
                        PIN incorrecto. Solicita al cliente su código de 4
                        dígitos (4821).
                      </span>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 text-center space-y-3 animate-fadeIn">
                <Bike className="h-10 w-10 text-caramel mx-auto" />
                <h2 className="text-base font-extrabold text-espresso">
                  No tienes pedidos aceptados en tu ruta
                </h2>
                <p className="text-xs text-coffee-muted">
                  Toca cualquiera de los iconos de pedidos en el mapa superior o
                  abre la pestaña de Disponibles para aceptar uno o varios
                  pedidos cercanos.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("pedidos")}
                  className="rounded-full bg-espresso text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:bg-espresso/95 transition cursor-pointer"
                >
                  Ver Pedidos Disponibles ({availableZoneOrders.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: PEDIDOS DISPONIBLES EN ZONA (ACEPTAR / RECHAZAR MULTI-PEDIDO)
           ========================================================================= */}
        {activeTab === "pedidos" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                  Bolsa de Reparto en tu Zona
                </span>
                <h2 className="text-base font-extrabold text-espresso">
                  Pedidos Disponibles (Multi-Pedido en Ruta)
                </h2>
              </div>
              <span className="text-xs font-bold bg-cream-container border border-cream-border px-2.5 py-1 rounded-full text-espresso">
                {availableZoneOrders.length} disponibles
              </span>
            </div>

            {availableZoneOrders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-espresso text-sm">
                  ¡No hay más pedidos pendientes por asignar!
                </p>
                <p className="text-xs text-coffee-muted">
                  Cuando un cliente confirme un nuevo pedido en su app, te
                  aparecerá aquí y en el mapa inmediatamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableZoneOrders.map((ord) => {
                  const compat = checkOrderRouteCompatibility(
                    ord,
                    courierCurrentLocation,
                    activeRouteOrders,
                  );
                  return (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-cream-border bg-cream-container/30 p-4 space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-espresso text-sm">
                            #{ord.id}
                          </span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              compat.compatible
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {compat.reason}
                          </span>
                        </div>
                        <span className="font-bold text-caramel bg-white px-2.5 py-0.5 rounded-full border border-cream-border">
                          +{formatCurrencyMXN(ord.courierEarnings)}
                        </span>
                      </div>

                      <div className="space-y-1 text-coffee-muted">
                        <p>
                          <strong className="text-espresso">
                            Restaurante:
                          </strong>{" "}
                          {ord.restaurantName} ({ord.restaurantAddress})
                        </p>
                        <p>
                          <strong className="text-espresso">Cliente:</strong>{" "}
                          {ord.customerName} — {ord.customerAddress}
                        </p>
                        <p>
                          <strong className="text-espresso">Platillo:</strong>{" "}
                          {ord.dishName}
                        </p>
                        <p>
                          <strong className="text-espresso">
                            Estado en cocina:
                          </strong>{" "}
                          {KITCHEN_STAGE_LABELS[ord.kitchenStage]} •{" "}
                          {ord.distanceKm} km
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-cream-border">
                        <button
                          type="button"
                          onClick={() => void handleAcceptOrder(ord)}
                          disabled={!compat.compatible}
                          className="flex-1 rounded-full bg-espresso py-2.5 font-bold text-white hover:bg-espresso-light disabled:opacity-50 transition cursor-pointer text-center"
                        >
                          {activeRouteOrders.length > 0
                            ? "Sumar a mi Ruta ✓"
                            : "Aceptar Pedido ✓"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRejectOrder(ord.id)}
                          className="rounded-full border border-cream-border px-4 py-2.5 font-semibold text-roasted hover:bg-white transition cursor-pointer"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: CHAT EN TIEMPO REAL CON EL CLIENTE
           ========================================================================= */}
        {activeTab === "chat" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div>
                <h2 className="text-sm font-extrabold text-espresso">
                  Chat Directo con el Cliente
                </h2>
                <p className="text-[11px] text-coffee-muted">
                  {currentActiveOrder
                    ? `Orden #${currentActiveOrder.id} • ${currentActiveOrder.customerName}`
                    : "Selecciona o acepta un pedido para chatear"}
                </p>
              </div>
              {currentActiveOrder?.customerPhone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[10px] font-bold text-espresso">
                  <Phone className="h-3 w-3 text-caramel" />
                  {currentActiveOrder.customerPhone}
                </span>
              )}
            </div>

            {/* Selector rápido si tiene varios pedidos en ruta */}
            {activeRouteOrders.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {activeRouteOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setSelectedActiveOrderId(ord.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold border cursor-pointer ${
                      currentActiveOrder?.id === ord.id
                        ? "bg-espresso text-white border-espresso"
                        : "bg-cream-container text-espresso border-cream-border"
                    }`}
                  >
                    #{ord.id} • {ord.customerName}
                  </button>
                ))}
              </div>
            )}

            {/* Ventana de Mensajes */}
            <div className="h-64 rounded-2xl border border-cream-border bg-cream-soft/30 p-3 overflow-y-auto space-y-2.5 flex flex-col">
              {currentActiveOrder ? (
                currentActiveOrder.messages.map((m) => {
                  const isCourier = m.senderRole === "DELIVERY";
                  return (
                    <div
                      key={m.id}
                      className={`max-w-[82%] rounded-2xl p-2.5 text-xs shadow-2xs ${
                        isCourier
                          ? "ml-auto bg-espresso text-white"
                          : m.senderRole === "SYSTEM"
                          ? "mx-auto bg-cream-container/80 text-coffee-muted text-[10px] text-center border border-cream-border"
                          : "mr-auto bg-white text-espresso border border-cream-border"
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-80 mb-0.5">
                        {m.senderName}
                      </p>
                      <p className="leading-snug">{m.text}</p>
                      <span className="block text-[9px] text-right opacity-70 mt-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-coffee-muted text-center my-auto">
                  No hay un pedido activo seleccionado.
                </p>
              )}
            </div>

            {/* Respuestas rápidas de repartidor */}
            {currentActiveOrder && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  "¡Hola! Voy rumbo al restaurante por tu pedido.",
                  "Estoy esperando a que empaquen tu orden.",
                  "¡Ya voy en camino a tu domicilio!",
                  "Estoy afuera de tu domicilio, ¿me compartes tu PIN?",
                ].map((quickText, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      void sendOrderChatMessage(
                        currentActiveOrder.id,
                        "DELIVERY",
                        profileName,
                        quickText,
                        API_URL,
                      ).then(() => syncOrders())
                    }
                    className="shrink-0 rounded-full bg-cream-container hover:bg-cream-border/50 border border-cream-border px-2.5 py-1 text-[10px] font-semibold text-espresso cursor-pointer"
                  >
                    {quickText}
                  </button>
                ))}
              </div>
            )}

            {/* Formulario de Enviar Mensaje */}
            <form
              onSubmit={(e) => void handleSendMessage(e)}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={!currentActiveOrder}
                placeholder={
                  currentActiveOrder
                    ? `Escribe mensaje a ${currentActiveOrder.customerName}...`
                    : "Acepta un pedido para enviar mensajes..."
                }
                className="flex-1 rounded-full border border-cream-border bg-white px-4 py-2.5 text-xs text-espresso placeholder-coffee-muted/40 focus:outline-none focus:border-caramel disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!currentActiveOrder}
                className="rounded-full bg-espresso text-white px-4 py-2.5 text-xs font-bold hover:bg-espresso-light disabled:opacity-50 transition cursor-pointer flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Enviar</span>
              </button>
            </form>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: HISTORIAL DE ENTREGAS
           ========================================================================= */}
        {activeTab === "historial" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Turno del Día
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Entregas Realizadas Hoy ({completedOrders.length})
              </h2>
            </div>

            {completedOrders.length === 0 ? (
              <p className="text-xs text-coffee-muted text-center py-6">
                Aún no has finalizado entregas en este turno.
              </p>
            ) : (
              <div className="space-y-3">
                {completedOrders.map((hist) => (
                  <div
                    key={hist.id}
                    className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-espresso">
                        #{hist.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Completada ✓
                      </span>
                    </div>
                    <p className="text-[11px] text-coffee-muted">
                      {hist.restaurantName} → {hist.customerName} (
                      {hist.distanceKm} km)
                    </p>
                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                      <span>
                        Pago: <strong>{hist.paymentMethod}</strong>
                      </span>
                      <span className="font-bold text-espresso">
                        +{formatCurrencyMXN(hist.courierEarnings)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            VENTANA 5: GANANCIAS POR TIPO DE PAGO (TARJETA VS EFECTIVO)
           ========================================================================= */}
        {activeTab === "ganancias" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Compensación Transparente
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Resumen de Ganancias y Pagos
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 text-center space-y-1">
              <span className="text-xs text-coffee-muted font-medium">
                Total acumulado en entregas completadas:
              </span>
              <p className="text-3xl font-black text-espresso">
                {formatCurrencyMXN(totalEarnings)}
              </p>
              <span className="text-[10px] text-caramel font-bold">
                Sin retenciones abusivas (Tarifa Justa)
              </span>
            </div>

            {/* Desglose Tarjeta vs Efectivo */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-cream-border bg-white p-3 text-center space-y-1">
                <CreditCard className="h-5 w-5 text-caramel mx-auto" />
                <span className="text-[11px] text-coffee-muted block">
                  Pagos en Tarjeta
                </span>
                <p className="text-sm font-extrabold text-espresso">
                  {formatCurrencyMXN(totalCardEarnings)}
                </p>
              </div>
              <div className="rounded-2xl border border-cream-border bg-white p-3 text-center space-y-1">
                <Banknote className="h-5 w-5 text-emerald-700 mx-auto" />
                <span className="text-[11px] text-coffee-muted block">
                  Pagos en Efectivo
                </span>
                <p className="text-sm font-extrabold text-espresso">
                  {formatCurrencyMXN(totalCashEarnings)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Viajes completados:</span>
                <span className="font-extrabold text-espresso">
                  {completedOrders.length} entregas
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Pedidos en ruta ahora:</span>
                <span className="font-extrabold text-caramel">
                  {activeRouteOrders.length} activos
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 6: MODIFICAR PERFIL DEL REPARTIDOR
           ========================================================================= */}
        {activeTab === "perfil" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Configuración de Conductor
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Modificar Mi Perfil de Repartidor
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-espresso block">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-espresso block">
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-espresso block">
                    Vehículo / Placas:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profileVehicle}
                      onChange={(e) => setProfileVehicle(e.target.value)}
                      className="rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                    />
                    <input
                      type="text"
                      value={profilePlates}
                      onChange={(e) => setProfilePlates(e.target.value)}
                      className="rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-cream-border flex items-center justify-between">
                  <span className="font-bold text-espresso">
                    Aceptar pagos en efectivo:
                  </span>
                  <input
                    type="checkbox"
                    checked={acceptCash}
                    onChange={(e) => setAcceptCash(e.target.checked)}
                    className="h-4 w-4 accent-espresso rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFeedbackBanner(
                    "¡Perfil de repartidor actualizado! Estos datos verá el restaurante y el cliente.",
                  )
                }
                className="w-full rounded-full bg-espresso py-3 text-xs font-bold text-white shadow-xs hover:bg-espresso-light active:scale-95 transition cursor-pointer"
              >
                Guardar Cambios de Perfil
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Pie de página discreto */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-coffee-muted mt-6 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-cream-border/70 shadow-2xs text-[11px]">
          © 2026 {PROJECT_NAME} Repartidor — Entregas Seguras y Puntuales.
        </p>
      </footer>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN INFERIOR FLOTANTE (BOTTOM TAB BAR)
         ========================================================================= */}
      <nav
        aria-label="Navegación inferior repartidor"
        className="fixed bottom-3 inset-x-0 mx-auto max-w-md px-3 z-40"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab("ruta")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === "ruta"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <Bike
              className={`h-4 w-4 ${activeTab === "ruta" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Mapa/Ruta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pedidos")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === "pedidos"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <Store
              className={`h-4 w-4 ${activeTab === "pedidos" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Disponibles ({availableZoneOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === "chat"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <MessageSquare
              className={`h-4 w-4 ${activeTab === "chat" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ganancias")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === "ganancias"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <DollarSign
              className={`h-4 w-4 ${activeTab === "ganancias" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Ganancias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === "perfil"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <User
              className={`h-4 w-4 ${activeTab === "perfil" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
