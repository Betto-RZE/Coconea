"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RestaurantCatalogPanel } from "../components/restaurant-catalog-panel";
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  BookOpen,
  Store,
  Menu,
  X,
  ArrowRight,
  Flame,
  Ban,
  Bike,
  Phone,
  MapPin,
  ShieldCheck,
  UserCheck,
  BellRing,
  RefreshCw,
  Check,
} from "lucide-react";
import {
  PROJECT_NAME,
  formatCurrencyMXN,
  fetchActiveOrders,
  updateOrderKitchenStage,
  KITCHEN_STAGE_LABELS,
  COURIER_STEP_LABELS,
} from "@coconea/shared";
import type { ActiveOrder, KitchenOrderStage } from "@coconea/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

type RestaurantTab = "cocina" | "metricas" | "catalogo" | "perfil";

const TAB_LABELS: Record<RestaurantTab, string> = {
  cocina: "Cocina KDS",
  metricas: "Métricas",
  catalogo: "Catálogo",
  perfil: "Restaurante",
};

const RESTAURANT_OPTIONS = [
  { id: "ALL", name: "Todos los Restaurantes (General)", zone: "Todas las zonas" },
  { id: "rest-raices", name: "McDonald's (Bistró Raíces & Grano)", zone: "Roma Norte" },
  { id: "rest-botanica", name: "Subway (Cocina Botánica Sur)", zone: "Del Valle" },
  { id: "rest-pacifico", name: "KFC (Fonda del Pacífico)", zone: "Narvarte" },
  { id: "rest-dominos", name: "Domino's Pizza", zone: "Condesa" },
  { id: "rest-greengrass", name: "Green Grass", zone: "Coyoacán" },
] as const;

const ORDERED_STAGES: {
  stage: KitchenOrderStage;
  shortLabel: string;
  description: string;
}[] = [
  {
    stage: "POR_HACER",
    shortLabel: "1. Por hacer",
    description: "Pedidos confirmados por el cliente pendientes de iniciar en cocina",
  },
  {
    stage: "EN_PREPARACION",
    shortLabel: "2. En preparación",
    description: "Platillos en cocción y verificación de alérgenos",
  },
  {
    stage: "EN_ESPERA_REPARTIDOR",
    shortLabel: "3. En espera de recibir",
    description: "Empacados con sello de seguridad listos para entregar al repartidor",
  },
  {
    stage: "EN_DELIVERY",
    shortLabel: "4. En delivery",
    description: "En ruta hacia el domicilio con información del repartidor asignado",
  },
  {
    stage: "ENTREGADO",
    shortLabel: "5. Entregado",
    description: "Pedidos recibidos satisfactoriamente por el cliente",
  },
];

function formatOrderTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Reciente";
  }
}

function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState<RestaurantTab>("cocina");
  const [menuOpen, setMenuOpen] = useState(false);

  // Filtro de restaurante y etapa del KDS
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("ALL");
  const [selectedStageFilter, setSelectedStageFilter] = useState<
    KitchenOrderStage | "ALL"
  >("ALL");

  // Pedidos sincronizados en tiempo real con cliente y repartidor
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdatedOrderCode, setLastUpdatedOrderCode] = useState<string | null>(
    null,
  );
  const [showDbCatalogEditor, setShowDbCatalogEditor] = useState(false);

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

  const handleAdvanceKitchenStage = async (
    order: ActiveOrder,
    nextStage: KitchenOrderStage,
  ) => {
    const updated = await updateOrderKitchenStage(order.id, nextStage, API_URL);
    if (updated) {
      setLastUpdatedOrderCode(`${order.id} → ${KITCHEN_STAGE_LABELS[nextStage]}`);
      await syncOrders();
    }
  };

  // Filtrar pedidos según el restaurante seleccionado
  const restaurantOrders = orders.filter((ord) =>
    selectedRestaurantId === "ALL"
      ? true
      : ord.restaurantId === selectedRestaurantId,
  );

  // Contadores por etapa para el restaurante activo
  const countByStage: Record<KitchenOrderStage, number> = {
    POR_HACER: restaurantOrders.filter((o) => o.kitchenStage === "POR_HACER")
      .length,
    EN_PREPARACION: restaurantOrders.filter(
      (o) => o.kitchenStage === "EN_PREPARACION",
    ).length,
    EN_ESPERA_REPARTIDOR: restaurantOrders.filter(
      (o) => o.kitchenStage === "EN_ESPERA_REPARTIDOR",
    ).length,
    EN_DELIVERY: restaurantOrders.filter(
      (o) => o.kitchenStage === "EN_DELIVERY",
    ).length,
    ENTREGADO: restaurantOrders.filter((o) => o.kitchenStage === "ENTREGADO")
      .length,
    CANCELADO: restaurantOrders.filter((o) => o.kitchenStage === "CANCELADO")
      .length,
  };

  const visibleOrders = restaurantOrders.filter((ord) =>
    selectedStageFilter === "ALL"
      ? ord.kitchenStage !== "CANCELADO"
      : ord.kitchenStage === selectedStageFilter,
  );

  const activeRestaurantMeta =
    RESTAURANT_OPTIONS.find((r) => r.id === selectedRestaurantId) ??
    RESTAURANT_OPTIONS[0];

  return (
    <div className="min-h-screen flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 pb-24 selection:bg-caramel/20 selection:text-espresso">
      {/* Contenedor Principal Centrado Estilo Mobile / Tablet */}
      <main className="w-full max-w-md mx-auto space-y-4">
        {/* Header Superior Mobile */}
        <header className="w-full relative z-30">
          <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xs flex items-center justify-between">
            {/* Logotipo y Título de Marca */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("cocina");
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
                  Dashboard de Pedidos y Cocina en Vivo
                </span>
              </div>
            </button>

            {/* Badge de estado y botón de menú */}
            <div className="flex items-center gap-2">
              <span className="hidden xs:inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-espresso">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>En Vivo</span>
              </span>

              <button
                id="btn-restaurant-menu"
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

          {/* Menú desplegable */}
          {menuOpen && (
            <div className="mt-2 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-lg animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                <span className="text-xs font-bold uppercase tracking-wider text-caramel flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Operación de Cocina
                </span>
                <span className="text-[10px] text-coffee-muted">
                  {activeRestaurantMeta.name}
                </span>
              </div>

              <nav className="space-y-1">
                {(
                  [
                    "cocina",
                    "metricas",
                    "catalogo",
                    "perfil",
                  ] as RestaurantTab[]
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
                        {tab === "cocina" && (
                          <UtensilsCrossed className="h-4 w-4" />
                        )}
                        {tab === "metricas" && (
                          <BarChart3 className="h-4 w-4" />
                        )}
                        {tab === "catalogo" && <BookOpen className="h-4 w-4" />}
                        {tab === "perfil" && <Store className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === "cocina" && "Dashboard de Pedidos (5 Etapas)"}
                        {tab === "metricas" && "Métricas y Tiempos"}
                        {tab === "catalogo" && "Catálogo y Alérgenos"}
                        {tab === "perfil" && "Perfil de Restaurante"}
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
            VENTANA 1: COCINA (DASHBOARD DE PEDIDOS EN 5 ETAPAS + INFO REPARTIDOR)
           ========================================================================= */}
        {activeTab === "cocina" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Selector del Restaurante que recibe el pedido */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-espresso">
                  <ChefHat className="h-4 w-4 text-caramel" />
                  <span className="text-xs font-extrabold">
                    Restaurante Receptor
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void syncOrders()}
                  className="inline-flex items-center gap-1 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[10px] font-bold text-espresso hover:bg-cream-border/40 transition cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3 w-3 text-caramel ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span>Sincronizar</span>
                </button>
              </div>

              {/* Píldoras de restaurantes con contador de pedidos */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {RESTAURANT_OPTIONS.map((rest) => {
                  const count =
                    rest.id === "ALL"
                      ? orders.filter((o) => o.kitchenStage !== "CANCELADO")
                          .length
                      : orders.filter(
                          (o) =>
                            o.restaurantId === rest.id &&
                            o.kitchenStage !== "CANCELADO",
                        ).length;
                  const newCount =
                    rest.id === "ALL"
                      ? orders.filter((o) => o.kitchenStage === "POR_HACER")
                          .length
                      : orders.filter(
                          (o) =>
                            o.restaurantId === rest.id &&
                            o.kitchenStage === "POR_HACER",
                        ).length;

                  const isSelected = selectedRestaurantId === rest.id;
                  return (
                    <button
                      key={rest.id}
                      type="button"
                      onClick={() => setSelectedRestaurantId(rest.id)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-espresso text-white border-espresso shadow-2xs"
                          : "bg-cream-container/70 text-coffee border-cream-border hover:bg-cream-container"
                      }`}
                    >
                      <span>
                        {rest.id === "ALL"
                          ? "Todos"
                          : rest.name.split(" (")[0]}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : newCount > 0
                            ? "bg-caramel text-white"
                            : "bg-white text-espresso"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Aviso si hay pedidos recién confirmados por hacer */}
              {countByStage.POR_HACER > 0 && (
                <div className="rounded-2xl border border-caramel/40 bg-caramel/10 px-3 py-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-espresso font-bold">
                    <BellRing className="h-4 w-4 text-caramel animate-bounce" />
                    <span>
                      {countByStage.POR_HACER === 1
                        ? "¡1 pedido nuevo confirmado por preparar!"
                        : `¡${countByStage.POR_HACER} pedidos nuevos confirmados por preparar!`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("POR_HACER")}
                    className="text-[10px] font-extrabold text-caramel underline cursor-pointer"
                  >
                    Ver por hacer
                  </button>
                </div>
              )}

              {lastUpdatedOrderCode && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 flex items-center justify-between text-[11px] text-emerald-900">
                  <span className="font-semibold">
                    Actualizado: <strong>{lastUpdatedOrderCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setLastUpdatedOrderCode(null)}
                    className="text-[10px] font-bold underline cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>

            {/* Tablero Resumen de las 5 Etapas del Pedido */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel">
                  Flujo de Cocina y Entrega (5 Etapas)
                </span>
                {selectedStageFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("ALL")}
                    className="text-[10px] font-bold text-roasted underline cursor-pointer"
                  >
                    Mostrar todas las etapas
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {ORDERED_STAGES.map(({ stage, shortLabel }) => {
                  const isActive = selectedStageFilter === stage;
                  const count = countByStage[stage];
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() =>
                        setSelectedStageFilter(
                          selectedStageFilter === stage ? "ALL" : stage,
                        )
                      }
                      className={`rounded-2xl border p-2 transition flex flex-col items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-espresso text-white border-espresso shadow-xs"
                          : count > 0
                          ? "bg-cream-container/80 text-espresso border-cream-border hover:bg-cream-container"
                          : "bg-white text-coffee-muted border-cream-border/60"
                      }`}
                    >
                      <span className="text-[9px] font-bold leading-tight line-clamp-2">
                        {shortLabel.replace(/^\d+\.\s*/, "")}
                      </span>
                      <span
                        className={`text-base font-black mt-1 ${
                          isActive
                            ? "text-white"
                            : stage === "POR_HACER" && count > 0
                            ? "text-caramel"
                            : stage === "ENTREGADO" && count > 0
                            ? "text-emerald-700"
                            : "text-espresso"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listado de Pedidos por Etapa */}
            {visibleOrders.length === 0 ? (
              <div className="rounded-3xl border border-cream-border/90 bg-white/95 p-6 text-center space-y-2">
                <PackageCheck className="h-8 w-8 text-caramel mx-auto" />
                <h3 className="text-sm font-extrabold text-espresso">
                  Sin pedidos en esta vista
                </h3>
                <p className="text-xs text-coffee-muted">
                  Cuando un cliente confirme su pedido en la app de consumidor,
                  aparecerá aquí en tiempo real.
                </p>
              </div>
            ) : (
              visibleOrders.map((ord) => {
                const currentStageIdx = ORDERED_STAGES.findIndex(
                  (s) => s.stage === ord.kitchenStage,
                );

                return (
                  <article
                    key={ord.id}
                    className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 shadow-sm space-y-4 transition"
                  >
                    {/* Encabezado de la orden */}
                    <div className="flex items-start justify-between gap-2 border-b border-cream-border pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel">
                            #{ord.id}
                          </span>
                          <span className="text-[10px] font-bold text-espresso bg-cream-container px-2 py-0.5 rounded-full border border-cream-border">
                            {ord.restaurantName}
                          </span>
                        </div>
                        <h2 className="text-sm font-extrabold text-espresso mt-1">
                          {ord.dishName}
                        </h2>
                        {ord.beverageName && (
                          <p className="text-[11px] text-roasted font-semibold">
                            + Bebida: {ord.beverageName}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold border ${
                          ord.kitchenStage === "POR_HACER"
                            ? "bg-amber-50 text-amber-900 border-amber-300"
                            : ord.kitchenStage === "EN_PREPARACION"
                            ? "bg-cream-container text-caramel border-cream-border"
                            : ord.kitchenStage === "EN_ESPERA_REPARTIDOR"
                            ? "bg-sky-50 text-sky-900 border-sky-200"
                            : ord.kitchenStage === "EN_DELIVERY"
                            ? "bg-purple-50 text-purple-900 border-purple-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {KITCHEN_STAGE_LABELS[ord.kitchenStage]}
                      </span>
                    </div>

                    {/* Barra de progreso visual de las 5 etapas */}
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-5 gap-1">
                        {ORDERED_STAGES.map((stepObj, idx) => {
                          const completed = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stepObj.stage}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className={`h-1.5 w-full rounded-full transition-all ${
                                  isCurrent
                                    ? "bg-caramel"
                                    : completed
                                    ? "bg-espresso"
                                    : "bg-cream-border"
                                }`}
                              />
                              <span
                                className={`text-[9px] text-center leading-tight ${
                                  isCurrent
                                    ? "font-extrabold text-caramel"
                                    : completed
                                    ? "font-bold text-espresso"
                                    : "text-coffee-muted"
                                }`}
                              >
                                {stepObj.shortLabel.replace(/^\d+\.\s*/, "")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Datos del cliente y destino */}
                    <div className="rounded-2xl border border-cream-border bg-cream-container/40 p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-espresso flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-caramel" />
                          Cliente: {ord.customerName}
                        </span>
                        <span className="text-[10px] font-bold text-espresso bg-white px-2 py-0.5 rounded-full border border-cream-border">
                          PIN Entrega: #{ord.deliveryPin}
                        </span>
                      </div>
                      <p className="text-[11px] text-coffee-muted flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-roasted shrink-0" />
                        <span>{ord.customerAddress}</span>
                      </p>
                    </div>

                    {/* Restricciones alimenticias estrictas */}
                    <div className="rounded-2xl border border-cream-border bg-cream-container/60 p-3 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-espresso font-bold text-[11px]">
                        <AlertTriangle className="h-3.5 w-3.5 text-caramel" />
                        <span>Restricciones y perfil nutricional:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ord.allergens.map((alg, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-caramel border border-cream-border"
                          >
                            {alg}
                          </span>
                        ))}
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-espresso border border-cream-border">
                          {ord.caloriesText}
                        </span>
                      </div>
                      {ord.dietaryNotes.length > 0 && (
                        <p className="text-[11px] text-coffee italic border-t border-cream-border/70 pt-1.5">
                          Nota: «{ord.dietaryNotes.join(" • ")}»
                        </p>
                      )}
                    </div>

                    {/* Información del Repartidor Asignado (Destacado en En Espera, En Delivery y Entregado) */}
                    {ord.courier ? (
                      <div className="rounded-2xl border-2 border-caramel/40 bg-cream-soft p-3.5 text-xs space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-cream-border pb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-xl bg-espresso text-white">
                              <Bike className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                                Repartidor Asignado al Pedido
                              </span>
                              <h3 className="text-xs font-extrabold text-espresso">
                                {ord.courier.name} ★ {ord.courier.rating ?? 4.9}
                              </h3>
                            </div>
                          </div>
                          <span className="rounded-full bg-white border border-cream-border px-2.5 py-0.5 text-[10px] font-bold text-espresso">
                            {ord.courier.plates}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-coffee-muted block text-[10px]">
                              Vehículo:
                            </span>
                            <span className="font-bold text-espresso">
                              {ord.courier.vehicle}
                            </span>
                          </div>
                          <div>
                            <span className="text-coffee-muted block text-[10px]">
                              Contacto directo:
                            </span>
                            <span className="font-bold text-espresso flex items-center gap-1">
                              <Phone className="h-3 w-3 text-caramel" />
                              {ord.courier.phone}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white border border-cream-border px-3 py-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-coffee-muted font-medium">
                            Seguimiento Repartidor:
                          </span>
                          <span className="font-extrabold text-caramel">
                            {COURIER_STEP_LABELS[ord.courierStep]}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-cream-border bg-white/70 p-3 text-[11px] flex items-center justify-between text-coffee-muted">
                        <span className="flex items-center gap-1.5">
                          <Bike className="h-4 w-4 text-caramel" />
                          <span>
                            {ord.kitchenStage === "EN_ESPERA_REPARTIDOR"
                              ? "Notificando a repartidores cercanos en la zona..."
                              : "Repartidor se asignará al avanzar o aceptar en zona"}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-roasted">
                          Sin asignar
                        </span>
                      </div>
                    )}

                    {/* Pie con hora e importe */}
                    <div className="flex items-center justify-between text-xs text-coffee-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-roasted" />
                        Confirmado: {formatOrderTime(ord.createdAt)}
                        {ord.deliveredAt
                          ? ` • Entregado: ${formatOrderTime(ord.deliveredAt)}`
                          : ""}
                      </span>
                      <span className="text-sm font-extrabold text-espresso">
                        {formatCurrencyMXN(ord.total)}
                      </span>
                    </div>

                    {/* Botones de Acción según la etapa actual (1 -> 2 -> 3 -> 4 -> 5) */}
                    <div className="pt-1 space-y-2">
                      {ord.kitchenStage === "POR_HACER" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void handleAdvanceKitchenStage(
                                ord,
                                "EN_PREPARACION",
                              )
                            }
                            className="flex-1 py-2.5 px-4 rounded-full bg-espresso text-white text-xs font-bold shadow-xs hover:bg-espresso-light transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Flame className="h-4 w-4 text-caramel" />
                            <span>Iniciar Preparación (Pasar a Etapa 2)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void handleAdvanceKitchenStage(ord, "CANCELADO")
                            }
                            className="px-3.5 py-2.5 rounded-full border border-red-200 bg-red-50/60 text-red-700 hover:bg-red-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            <span>Cancelar</span>
                          </button>
                        </div>
                      )}

                      {ord.kitchenStage === "EN_PREPARACION" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void handleAdvanceKitchenStage(
                                ord,
                                "EN_ESPERA_REPARTIDOR",
                              )
                            }
                            className="flex-1 py-2.5 px-4 rounded-full bg-espresso text-white text-xs font-bold shadow-xs hover:bg-espresso-light transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <PackageCheck className="h-4 w-4 text-caramel" />
                            <span>
                              Marcar Listo · En Espera de Recibir (Etapa 3)
                            </span>
                          </button>
                        </div>
                      )}

                      {ord.kitchenStage === "EN_ESPERA_REPARTIDOR" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void handleAdvanceKitchenStage(ord, "EN_DELIVERY")
                            }
                            className="flex-1 py-2.5 px-4 rounded-full bg-caramel text-white text-xs font-bold shadow-xs hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Bike className="h-4 w-4" />
                            <span>
                              Entregar al Repartidor · Pasar a En Delivery (Etapa
                              4)
                            </span>
                          </button>
                        </div>
                      )}

                      {ord.kitchenStage === "EN_DELIVERY" && (
                        <div className="space-y-2">
                          <div className="rounded-2xl bg-purple-50 border border-purple-200 px-3 py-2 text-[11px] text-purple-900 flex items-center justify-between">
                            <span className="font-bold">
                              El repartidor lleva el pedido rumbo al domicilio
                            </span>
                            <span className="font-extrabold">En ruta</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              void handleAdvanceKitchenStage(ord, "ENTREGADO")
                            }
                            className="w-full py-2.5 px-4 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                            <span>
                              Marcar como Entregado al Cliente (Etapa 5)
                            </span>
                          </button>
                        </div>
                      )}

                      {ord.kitchenStage === "ENTREGADO" && (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-900 flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-emerald-700" />
                            Pedido entregado exitosamente al cliente
                          </span>
                          <span className="text-[10px] font-extrabold uppercase">
                            Completado
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: MÉTRICAS Y TIEMPOS
           ========================================================================= */}
        {activeTab === "metricas" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Rendimiento de Turno en Tiempo Real
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Métricas de Cocina y Reparto
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">
                  Por Hacer
                </span>
                <p className="text-2xl font-black text-espresso mt-1">
                  {countByStage.POR_HACER}
                </p>
                <span className="text-[9px] text-caramel font-semibold">
                  Nuevos
                </span>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">
                  En Preparación
                </span>
                <p className="text-2xl font-black text-espresso mt-1">
                  {countByStage.EN_PREPARACION}
                </p>
                <span className="text-[9px] text-roasted font-semibold">
                  En fuego
                </span>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">
                  Espera Rep.
                </span>
                <p className="text-2xl font-black text-espresso mt-1">
                  {countByStage.EN_ESPERA_REPARTIDOR}
                </p>
                <span className="text-[9px] text-sky-700 font-semibold">
                  Por recoger
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">
                  En Delivery
                </span>
                <p className="text-2xl font-black text-espresso mt-1">
                  {countByStage.EN_DELIVERY}
                </p>
                <span className="text-[9px] text-purple-700 font-semibold">
                  Con repartidor asignado
                </span>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">
                  Entregados
                </span>
                <p className="text-2xl font-black text-emerald-700 mt-1">
                  {countByStage.ENTREGADO}
                </p>
                <span className="text-[9px] text-emerald-700 font-semibold">
                  Completados hoy
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">
                  Tiempo medio de despacho:
                </span>
                <span className="font-extrabold text-espresso">
                  16.4 minutos
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">
                  Cumplimiento de alérgenos:
                </span>
                <span className="font-extrabold text-emerald-700">
                  100% verificado
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">
                  Total de órdenes en sistema:
                </span>
                <span className="font-extrabold text-espresso">
                  {restaurantOrders.length} pedidos
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: CATÁLOGO DE PLATILLOS & ALÉRGENOS
           ========================================================================= */}
        {activeTab === "catalogo" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Menú y Verificación
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Catálogo de Platillos y Alérgenos
              </h2>
              <p className="text-[11px] text-coffee-muted mt-0.5">
                Regla de negocio: Sin lista completa de ingredientes, no se
                asume seguro.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowDbCatalogEditor(!showDbCatalogEditor)}
                className="rounded-full bg-espresso text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-espresso-light transition cursor-pointer"
              >
                {showDbCatalogEditor
                  ? "Ver Resumen Rápido de Alérgenos"
                  : "Abrir Editor Completo de Catálogo (API Local)"}
              </button>
            </div>

            {showDbCatalogEditor ? (
              <div className="pt-2">
                <RestaurantCatalogPanel />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-espresso text-xs">
                        Bowl Rústico de Quinoa / McTrío Mediano
                      </h3>
                      <p className="text-[10px] text-coffee-muted">
                        580 kcal • Ingredientes declarados por completo
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Auditado
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[9px] font-bold text-coffee-muted">
                    <span className="bg-cream-container px-2 py-0.5 rounded-full">
                      Trazabilidad Completa
                    </span>
                    <span className="bg-cream-container px-2 py-0.5 rounded-full">
                      Sin Maní
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-espresso text-xs">
                        Sub Pollo Teriyaki / Ensalada César
                      </h3>
                      <p className="text-[10px] text-coffee-muted">
                        490 kcal • Pollo orgánico y vegetales frescos
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Auditado
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[9px] font-bold text-coffee-muted">
                    <span className="bg-cream-container px-2 py-0.5 rounded-full">
                      Alto en Proteína
                    </span>
                    <span className="bg-cream-container px-2 py-0.5 rounded-full">
                      Sello de Higiene
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: PERFIL DEL RESTAURANTE
           ========================================================================= */}
        {activeTab === "perfil" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Configuración del Local
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Perfil de Restaurante Aliado
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso text-cream text-base font-bold shadow-xs">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-espresso">
                    {activeRestaurantMeta.name}
                  </h3>
                  <p className="text-[11px] text-coffee-muted">
                    Zona: {activeRestaurantMeta.zone}
                  </p>
                  <p className="text-[10px] text-caramel font-bold">
                    Conectado en tiempo real con Clientes y Repartidores
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-cream-border/70 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-coffee-muted">
                    Horario de despacho:
                  </span>
                  <span className="font-bold text-espresso">
                    08:30 - 22:30 hrs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Chef responsable:</span>
                  <span className="font-bold text-espresso">
                    Carlos Valencia
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Radio de cobertura:</span>
                  <span className="font-bold text-espresso">4.5 km</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Pie de página discreto */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-coffee-muted mt-6 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-cream-border/70 shadow-2xs text-[11px]">
          © 2026 {PROJECT_NAME} Restaurante — Operación y Cocina Segura.
        </p>
      </footer>

      {/* Barra de Navegación Inferior Flotante (Bottom Tab Bar) */}
      <nav
        aria-label="Navegación inferior restaurante"
        className="fixed bottom-3 inset-x-0 mx-auto max-w-md px-3 z-40"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab("cocina")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === "cocina"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <UtensilsCrossed
              className={`h-4 w-4 ${activeTab === "cocina" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Cocina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metricas")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === "metricas"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <BarChart3
              className={`h-4 w-4 ${activeTab === "metricas" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Métricas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("catalogo")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === "catalogo"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <BookOpen
              className={`h-4 w-4 ${activeTab === "catalogo" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Catálogo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === "perfil"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <Store
              className={`h-4 w-4 ${activeTab === "perfil" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function RestaurantPage() {
  return <RestaurantDashboard />;
}
