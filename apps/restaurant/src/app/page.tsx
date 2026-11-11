"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const RestaurantCatalogPanel = dynamic(
  () =>
    import("../components/restaurant-catalog-panel").then(
      (mod) => mod.RestaurantCatalogPanel,
    ),
  { ssr: false },
);
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
  LogOut,
  Lock,
  Mail,
  LayoutGrid,
  Columns,
  Star,
} from "lucide-react";
import {
  PROJECT_NAME,
  DEMO_RESTAURANTS,
  formatCurrencyMXN,
  fetchActiveOrders,
  updateOrderKitchenStage,
  KITCHEN_STAGE_LABELS,
  COURIER_STEP_LABELS,
  type DemoRestaurant,
} from "@coconea/shared";
import type { ActiveOrder, KitchenOrderStage } from "@coconea/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
const SESSION_STORAGE_KEY = "coconea_restaurant_session_v1";

type RestaurantTab = "cocina" | "metricas" | "catalogo" | "perfil";
type KdsLayoutMode = "kanban" | "grid";

export interface RegisteredRestaurantAccount {
  restaurantId: string;
  email: string;
  passwordHint: string;
  managerName: string;
  zone: string;
  address: string;
  restaurant: DemoRestaurant;
}

const REGISTERED_RESTAURANT_ACCOUNTS: RegisteredRestaurantAccount[] = [
  {
    restaurantId: "rest-raices",
    email: "mcdonalds@coconea.local",
    passwordHint: "Coconea123!",
    managerName: "Carlos Valencia",
    zone: "Av. Juárez / La Paz, Puebla",
    address: "Av. Juárez 2318, La Paz, Puebla, Pue.",
    restaurant: DEMO_RESTAURANTS.find((r) => r.id === "rest-raices") ?? DEMO_RESTAURANTS[0]!,
  },
  {
    restaurantId: "rest-botanica",
    email: "subway@coconea.local",
    passwordHint: "Coconea123!",
    managerName: "Elena Rostova",
    zone: "Centro Histórico, Puebla",
    address: "Av. Reforma 518, Centro Histórico, Puebla, Pue.",
    restaurant: DEMO_RESTAURANTS.find((r) => r.id === "rest-botanica") ?? DEMO_RESTAURANTS[1]!,
  },
  {
    restaurantId: "rest-pacifico",
    email: "kfc@coconea.local",
    passwordHint: "Coconea123!",
    managerName: "Marco Antonio Solís",
    zone: "El Carmen / Blvd. 5 de Mayo, Puebla",
    address: "Blvd. Héroes del 5 de Mayo 704, El Carmen, Puebla, Pue.",
    restaurant: DEMO_RESTAURANTS.find((r) => r.id === "rest-pacifico") ?? DEMO_RESTAURANTS[2]!,
  },
  {
    restaurantId: "rest-dominos",
    email: "dominos@coconea.local",
    passwordHint: "Coconea123!",
    managerName: "Roberto Flores",
    zone: "Huexotitla, Puebla",
    address: "Av. 43 Poniente 302, Huexotitla, Puebla, Pue.",
    restaurant: DEMO_RESTAURANTS.find((r) => r.id === "rest-dominos") ?? DEMO_RESTAURANTS[3]!,
  },
  {
    restaurantId: "rest-greengrass",
    email: "greengrass@coconea.local",
    passwordHint: "Coconea123!",
    managerName: "Lucía Fernández",
    zone: "Angelópolis, Puebla",
    address: "Blvd. del Niño Poblano 2510, Angelópolis, Puebla, Pue.",
    restaurant: DEMO_RESTAURANTS.find((r) => r.id === "rest-greengrass") ?? DEMO_RESTAURANTS[4]!,
  },
];

const ORDERED_STAGES: {
  stage: KitchenOrderStage;
  number: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
}[] = [
  {
    stage: "POR_HACER",
    number: "01",
    shortLabel: "Por hacer",
    description: "Pedidos confirmados por el cliente pendientes de iniciar",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
  },
  {
    stage: "EN_PREPARACION",
    number: "02",
    shortLabel: "En preparación",
    description: "En fuego y verificación de alérgenos",
    badgeClass: "bg-cream-container text-caramel border-cream-border",
  },
  {
    stage: "EN_ESPERA_REPARTIDOR",
    number: "03",
    shortLabel: "En espera de recibir",
    description: "Empacados esperando recolección del repartidor",
    badgeClass: "bg-sky-50 text-sky-900 border-sky-200",
  },
  {
    stage: "EN_DELIVERY",
    number: "04",
    shortLabel: "En delivery",
    description: "En ruta con información del repartidor asignado",
    badgeClass: "bg-purple-50 text-purple-900 border-purple-200",
  },
  {
    stage: "ENTREGADO",
    number: "05",
    shortLabel: "Entregado",
    description: "Pedidos entregados en el domicilio del cliente",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
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

export default function RestaurantPage() {
  // Estado de sesión del restaurante autenticado
  const [loggedAccount, setLoggedAccount] =
    useState<RegisteredRestaurantAccount | null>(null);
  const [emailInput, setEmailInput] = useState("mcdonalds@coconea.local");
  const [passwordInput, setPasswordInput] = useState("Coconea123!");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navegación del panel de pantalla completa
  const [activeTab, setActiveTab] = useState<RestaurantTab>("cocina");
  const [kdsLayout, setKdsLayout] = useState<KdsLayoutMode>("kanban");
  const [selectedStageFilter, setSelectedStageFilter] = useState<
    KitchenOrderStage | "ALL"
  >("ALL");

  // Pedidos sincronizados en tiempo real con cliente y repartidor
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdatedNotice, setLastUpdatedNotice] = useState<string | null>(
    null,
  );
  const [showDbCatalogEditor, setShowDbCatalogEditor] = useState(false);

  // Restaurar sesión guardada en navegador
  useEffect(() => {
    try {
      const savedId = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedId) {
        const found = REGISTERED_RESTAURANT_ACCOUNTS.find(
          (a) => a.restaurantId === savedId,
        );
        if (found) setLoggedAccount(found);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

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

  const handleSelectAccountLogin = (account: RegisteredRestaurantAccount) => {
    setLoggedAccount(account);
    setEmailInput(account.email);
    setPasswordInput(account.passwordHint);
    setLoginError(null);
    setSelectedStageFilter("ALL");
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, account.restaurantId);
    } catch {
      // Ignore
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const normalizedEmail = emailInput.trim().toLowerCase();
    const matched = REGISTERED_RESTAURANT_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === normalizedEmail,
    );
    if (!matched) {
      setLoginError(
        "No se encontró una cuenta de restaurante con ese correo. Usa una de las 5 cuentas registradas.",
      );
      return;
    }
    if (passwordInput.trim().length < 4) {
      setLoginError("Ingresa una contraseña válida.");
      return;
    }
    handleSelectAccountLogin(matched);
  };

  const handleLogout = () => {
    setLoggedAccount(null);
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleAdvanceKitchenStage = async (
    order: ActiveOrder,
    nextStage: KitchenOrderStage,
  ) => {
    const updated = await updateOrderKitchenStage(order.id, nextStage, API_URL);
    if (updated) {
      setLastUpdatedNotice(
        `Pedido #${order.id} actualizado a «${KITCHEN_STAGE_LABELS[nextStage]}»`,
      );
      await syncOrders();
    }
  };

  // Pedidos pertenecientes exclusivamente al restaurante que inició sesión
  const myRestaurantOrders = useMemo(() => {
    if (!loggedAccount) return [];
    return orders.filter(
      (ord) => ord.restaurantId === loggedAccount.restaurantId,
    );
  }, [orders, loggedAccount]);

  const countByStage: Record<KitchenOrderStage, number> = useMemo(
    () => ({
      POR_HACER: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "POR_HACER",
      ).length,
      EN_PREPARACION: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "EN_PREPARACION",
      ).length,
      EN_ESPERA_REPARTIDOR: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "EN_ESPERA_REPARTIDOR",
      ).length,
      EN_DELIVERY: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "EN_DELIVERY",
      ).length,
      ENTREGADO: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "ENTREGADO",
      ).length,
      CANCELADO: myRestaurantOrders.filter(
        (o) => o.kitchenStage === "CANCELADO",
      ).length,
    }),
    [myRestaurantOrders],
  );

  // ===========================================================================
  // PANTALLA DE INICIO DE SESIÓN PARA RESTAURANTES (DISEÑO DESKTOP WIDESCREEN)
  // ===========================================================================
  if (!loggedAccount) {
    return (
      <div className="min-h-screen w-full py-8 px-4 sm:px-8 lg:px-12 flex flex-col justify-between selection:bg-caramel/20 selection:text-espresso">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Header Superior */}
          <header className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md px-6 py-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-container border border-cream-border p-2 shadow-2xs">
                <img
                  src="/images/coconea-pattern-icon.png"
                  alt="Coconea"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-espresso">
                    {PROJECT_NAME}
                  </span>
                  <span className="rounded-full bg-cream-container border border-cream-border px-3 py-0.5 text-xs font-bold text-caramel">
                    Consola Web de Restaurantes
                  </span>
                </div>
                <p className="text-xs text-coffee-muted font-medium">
                  Sistema de Recepción de Pedidos (KDS), Preparación y Despacho a Repartidores
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-container border border-cream-border px-3.5 py-1.5 text-xs font-bold text-espresso">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>5 Restaurantes Conectados con la App del Cliente</span>
              </span>
            </div>
          </header>

          {/* Cuerpo Principal en 2 Columnas Widescreen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda (7 cols): Selección directa de las cuentas registradas */}
            <section className="lg:col-span-7 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-cream-border pb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-caramel block">
                    Cuentas Registradas del Catálogo del Cliente
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-espresso mt-0.5">
                    Selecciona el Restaurante para Abrir su Monitor KDS
                  </h1>
                  <p className="text-xs sm:text-sm text-coffee-muted mt-1">
                    Estas son las 5 cuentas oficiales de los restaurantes que el cliente puede elegir al confirmar su pedido.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REGISTERED_RESTAURANT_ACCOUNTS.map((acc) => {
                  const restOrders = orders.filter(
                    (o) =>
                      o.restaurantId === acc.restaurantId &&
                      o.kitchenStage !== "CANCELADO",
                  );
                  const pendingNew = restOrders.filter(
                    (o) => o.kitchenStage === "POR_HACER",
                  ).length;

                  return (
                    <div
                      key={acc.restaurantId}
                      className="rounded-2xl border border-cream-border bg-cream-container/30 hover:bg-cream-container/70 transition p-4 flex flex-col justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-cream-border text-xl shadow-2xs">
                              {acc.restaurant.avatarEmoji}
                            </span>
                            <div>
                              <h2 className="text-base font-extrabold text-espresso">
                                {acc.restaurant.name}
                              </h2>
                              <p className="text-xs text-roasted font-semibold">
                                {acc.restaurant.specialty}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold border ${
                              pendingNew > 0
                                ? "bg-caramel text-white border-caramel"
                                : "bg-white text-espresso border-cream-border"
                            }`}
                          >
                            {restOrders.length}{" "}
                            {restOrders.length === 1 ? "pedido" : "pedidos"}
                          </span>
                        </div>

                        <div className="rounded-xl bg-white/90 border border-cream-border p-2.5 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-coffee-muted">Correo:</span>
                            <code className="font-bold text-espresso">
                              {acc.email}
                            </code>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-coffee-muted">Contraseña:</span>
                            <code className="font-bold text-caramel">
                              {acc.passwordHint}
                            </code>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-coffee-muted">Sucursal:</span>
                            <span className="font-semibold text-espresso truncate max-w-[160px]">
                              {acc.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectAccountLogin(acc)}
                        className="w-full rounded-full bg-espresso py-2.5 px-4 text-xs font-bold text-white hover:bg-espresso-light transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Entrar como {acc.restaurant.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-caramel" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Columna Derecha (5 cols): Formulario tradicional de inicio de sesión */}
            <section className="lg:col-span-5 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-cream-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-espresso text-cream shadow-xs">
                  <Lock className="h-5 w-5 text-caramel" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-caramel block">
                    Autenticación de Sucursal
                  </span>
                  <h2 className="text-lg font-extrabold text-espresso">
                    Iniciar Sesión con Credenciales
                  </h2>
                </div>
              </div>

              <form onSubmit={handleFormLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rest-login-email"
                    className="text-xs font-bold text-espresso flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-caramel" />
                    Correo Electrónico del Restaurante
                  </label>
                  <input
                    id="rest-login-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="mcdonalds@coconea.local"
                    className="w-full rounded-2xl border border-cream-border bg-cream-soft/40 px-4 py-3 text-sm font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rest-login-password"
                    className="text-xs font-bold text-espresso flex items-center gap-1.5"
                  >
                    <Lock className="h-3.5 w-3.5 text-caramel" />
                    Contraseña
                  </label>
                  <input
                    id="rest-login-password"
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Coconea123!"
                    className="w-full rounded-2xl border border-cream-border bg-cream-soft/40 px-4 py-3 text-sm font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                {loginError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-espresso py-3.5 px-6 text-sm font-bold text-white shadow-sm hover:bg-espresso-light transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed className="h-4 w-4 text-caramel" />
                  <span>Acceder al Dashboard del Restaurante</span>
                </button>
              </form>

              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 text-xs text-coffee space-y-1.5">
                <p className="font-bold text-espresso flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-caramel" />
                  Aislamiento por Restaurante (RBAC)
                </p>
                <p className="text-coffee-muted leading-relaxed">
                  Al iniciar sesión con cualquiera de las cuentas registradas, el
                  monitor KDS filtra y muestra únicamente los pedidos confirmados
                  para ese restaurante y su catálogo correspondiente.
                </p>
              </div>
            </section>
          </div>
        </div>

        <footer className="w-full max-w-7xl mx-auto text-center text-xs text-coffee-muted mt-10">
          <p className="inline-block bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-cream-border/70 shadow-2xs">
            © 2026 {PROJECT_NAME} Restaurante — Consola Web de Pantalla Completa para Cocina y Despacho.
          </p>
        </footer>
      </div>
    );
  }

  // ===========================================================================
  // CONSOLA OPERATIVA WIDESCREEN DEL RESTAURANTE AUTENTICADO (PANTALLA COMPLETA)
  // ===========================================================================
  const activeRest = loggedAccount.restaurant;

  return (
    <div className="min-h-screen w-full py-5 px-4 sm:px-6 lg:px-10 flex flex-col justify-between selection:bg-caramel/20 selection:text-espresso">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* BARRA SUPERIOR DESKTOP DE PANTALLA COMPLETA */}
        <header className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md px-6 py-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Identidad del Restaurante con Sesión Iniciada */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-container border border-cream-border text-2xl shadow-2xs">
              {activeRest.avatarEmoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-caramel">
                  {PROJECT_NAME} KDS
                </span>
                <span className="text-coffee-muted">•</span>
                <h1 className="text-lg sm:text-xl font-extrabold text-espresso">
                  {activeRest.name}
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sucursal Activa
                </span>
              </div>
              <p className="text-xs text-coffee-muted">
                Cuenta: <strong>{loggedAccount.email}</strong> •{" "}
                {loggedAccount.address}
              </p>
            </div>
          </div>

          {/* Pestañas Horizontales Desktop */}
          <nav
            aria-label="Navegación principal del restaurante"
            className="flex flex-wrap items-center gap-2 bg-cream-container/60 p-1.5 rounded-full border border-cream-border"
          >
            <button
              type="button"
              onClick={() => setActiveTab("cocina")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "cocina"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-espresso hover:bg-white"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4 text-caramel" />
              <span>Pedidos Entrantes KDS ({myRestaurantOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("metricas")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "metricas"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-espresso hover:bg-white"
              }`}
            >
              <BarChart3 className="h-4 w-4 text-caramel" />
              <span>Métricas de Operación</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("catalogo")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "catalogo"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-espresso hover:bg-white"
              }`}
            >
              <BookOpen className="h-4 w-4 text-caramel" />
              <span>Catálogo ({activeRest.menu.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("perfil")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "perfil"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-espresso hover:bg-white"
              }`}
            >
              <Store className="h-4 w-4 text-caramel" />
              <span>Perfil de Sucursal</span>
            </button>
          </nav>

          {/* Controles de Sincronización y Cambio rápido de Cuenta / Logout */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => void syncOrders()}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-3.5 py-2 text-xs font-bold text-espresso hover:bg-cream-border/40 transition cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-caramel ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>Sincronizar</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-border bg-white px-4 py-2 text-xs font-bold text-roasted hover:bg-cream-container hover:text-espresso transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Cambiar Cuenta / Salir</span>
            </button>
          </div>
        </header>

        {/* Barra de cambio rápido entre cuentas registradas para pruebas ágiles */}
        <div className="rounded-2xl border border-cream-border/80 bg-white/85 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-coffee-muted flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-caramel" />
            Cambio rápido de sesión entre restaurantes registrados:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGISTERED_RESTAURANT_ACCOUNTS.map((acc) => {
              const isCurrent = acc.restaurantId === loggedAccount.restaurantId;
              const orderCount = orders.filter(
                (o) =>
                  o.restaurantId === acc.restaurantId &&
                  o.kitchenStage !== "CANCELADO",
              ).length;
              return (
                <button
                  key={acc.restaurantId}
                  type="button"
                  onClick={() => handleSelectAccountLogin(acc)}
                  className={`rounded-full px-3 py-1 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? "bg-espresso text-white border-espresso shadow-2xs"
                      : "bg-cream-container/60 text-espresso border-cream-border hover:bg-cream-container"
                  }`}
                >
                  <span>{acc.restaurant.avatarEmoji}</span>
                  <span>{acc.restaurant.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : "bg-white text-caramel"
                    }`}
                  >
                    {orderCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            PESTAÑA 1: TABLERO KDS WIDESCREEN DE LAS 5 ETAPAS DEL PEDIDO
           ===================================================================== */}
        {activeTab === "cocina" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Avisos en tiempo real */}
            {countByStage.POR_HACER > 0 && (
              <div className="rounded-2xl border-2 border-caramel bg-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 text-espresso">
                  <div className="p-2 rounded-xl bg-caramel text-white">
                    <BellRing className="h-5 w-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">
                      ¡Tienes {countByStage.POR_HACER}{" "}
                      {countByStage.POR_HACER === 1
                        ? "pedido nuevo confirmado por hacer"
                        : "pedidos nuevos confirmados por hacer"}{" "}
                      en {activeRest.name}!
                    </p>
                    <p className="text-xs text-coffee-muted">
                      Inicia la preparación para notificar al cliente y a los repartidores cercanos.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStageFilter("POR_HACER")}
                  className="rounded-full bg-espresso text-white px-4 py-2 text-xs font-bold hover:bg-espresso-light transition cursor-pointer"
                >
                  Enfocar etapa «Por hacer»
                </button>
              </div>
            )}

            {lastUpdatedNotice && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  {lastUpdatedNotice}
                </span>
                <button
                  type="button"
                  onClick={() => setLastUpdatedNotice(null)}
                  className="font-extrabold underline cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* FRANJA DE LAS 5 ETAPAS (KPIs + FILTRO EN PANTALLA COMPLETA) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {ORDERED_STAGES.map((st) => {
                const count = countByStage[st.stage];
                const isSelected = selectedStageFilter === st.stage;
                return (
                  <button
                    key={st.stage}
                    type="button"
                    onClick={() =>
                      setSelectedStageFilter(
                        selectedStageFilter === st.stage ? "ALL" : st.stage,
                      )
                    }
                    className={`rounded-3xl border p-4 text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-espresso text-white border-espresso shadow-md"
                        : "bg-white/95 text-espresso border-cream-border hover:border-caramel"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isSelected ? "text-caramel" : "text-caramel"
                        }`}
                      >
                        Etapa {st.number}
                      </span>
                      <span
                        className={`text-2xl font-black ${
                          isSelected ? "text-white" : "text-espresso"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold">{st.shortLabel}</h3>
                      <p
                        className={`text-[11px] line-clamp-2 mt-0.5 ${
                          isSelected ? "text-cream/80" : "text-coffee-muted"
                        }`}
                      >
                        {st.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Barra de herramientas del KDS (Alternar Kanban 5 columnas vs Cuadrícula detallada) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-espresso">
                  Flujo de Pedidos de {activeRest.name}
                </h2>
                {selectedStageFilter !== "ALL" && (
                  <button
                    type="button"
                    onClick={() => setSelectedStageFilter("ALL")}
                    className="rounded-full bg-cream-container border border-cream-border px-3 py-1 text-xs font-bold text-caramel hover:text-espresso cursor-pointer"
                  >
                    Mostrar las 5 etapas ({myRestaurantOrders.length})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-cream-border">
                <button
                  type="button"
                  onClick={() => setKdsLayout("kanban")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    kdsLayout === "kanban"
                      ? "bg-espresso text-white"
                      : "text-coffee hover:text-espresso"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Tablero 5 Columnas (Kanban)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKdsLayout("grid")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    kdsLayout === "grid"
                      ? "bg-espresso text-white"
                      : "text-coffee hover:text-espresso"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Tarjetas Expandidas</span>
                </button>
              </div>
            </div>

            {/* VISTA 1: TABLERO KANBAN DE 5 COLUMNAS A PANTALLA COMPLETA */}
            {kdsLayout === "kanban" && selectedStageFilter === "ALL" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
                {ORDERED_STAGES.map((stageMeta) => {
                  const stageOrders = myRestaurantOrders.filter(
                    (o) => o.kitchenStage === stageMeta.stage,
                  );
                  return (
                    <div
                      key={stageMeta.stage}
                      className="rounded-3xl border border-cream-border/90 bg-white/80 backdrop-blur-md p-4 space-y-3 min-h-[480px] flex flex-col"
                    >
                      {/* Cabecera de Columna */}
                      <div className="flex items-center justify-between border-b border-cream-border pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel block">
                            Etapa {stageMeta.number}
                          </span>
                          <h3 className="text-sm font-extrabold text-espresso">
                            {stageMeta.shortLabel}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-black border ${stageMeta.badgeClass}`}
                        >
                          {stageOrders.length}
                        </span>
                      </div>

                      {/* Tarjetas dentro de la columna */}
                      {stageOrders.length === 0 ? (
                        <div className="my-auto py-12 text-center text-xs text-coffee-muted space-y-1">
                          <PackageCheck className="h-6 w-6 text-cream-border mx-auto" />
                          <p>Sin pedidos en «{stageMeta.shortLabel}»</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {stageOrders.map((ord) => (
                            <OrderKdsCard
                              key={ord.id}
                              order={ord}
                              onAdvanceStage={handleAdvanceKitchenStage}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VISTA 2: CUADRÍCULA EXPANDIDA (3 COLUMNAS GRANDES) */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {myRestaurantOrders
                  .filter((o) =>
                    selectedStageFilter === "ALL"
                      ? o.kitchenStage !== "CANCELADO"
                      : o.kitchenStage === selectedStageFilter,
                  )
                  .map((ord) => (
                    <OrderKdsCard
                      key={ord.id}
                      order={ord}
                      onAdvanceStage={handleAdvanceKitchenStage}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            PESTAÑA 2: MÉTRICAS DE OPERACIÓN EN PANTALLA COMPLETA
           ===================================================================== */}
        {activeTab === "metricas" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-border pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-caramel block">
                  Indicadores de Desempeño de Sucursal
                </span>
                <h2 className="text-xl font-extrabold text-espresso">
                  Métricas de Cocina y Entregas — {activeRest.name}
                </h2>
              </div>
              <span className="rounded-full bg-cream-container border border-cream-border px-4 py-1.5 text-xs font-bold text-espresso">
                Tiempo estimado de preparación: {activeRest.prepTime}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {ORDERED_STAGES.map((st) => (
                <div
                  key={st.stage}
                  className="rounded-2xl border border-cream-border bg-cream-container/40 p-5 text-center space-y-1"
                >
                  <span className="text-xs font-bold text-coffee-muted block">
                    {st.shortLabel}
                  </span>
                  <p className="text-3xl font-black text-espresso">
                    {countByStage[st.stage]}
                  </p>
                  <span className="text-[11px] text-caramel font-semibold block">
                    Etapa {st.number}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl border border-cream-border bg-white p-5 space-y-1">
                <span className="text-xs text-coffee-muted">
                  Volumen total en sistema ({activeRest.name}):
                </span>
                <p className="text-2xl font-black text-espresso">
                  {formatCurrencyMXN(
                    myRestaurantOrders.reduce((acc, o) => acc + o.total, 0),
                  )}
                </p>
                <span className="text-xs text-emerald-700 font-bold">
                  {myRestaurantOrders.length} órdenes registradas
                </span>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-5 space-y-1">
                <span className="text-xs text-coffee-muted">
                  Verificación de alérgenos e inocuidad:
                </span>
                <p className="text-2xl font-black text-emerald-700">
                  100% Auditado
                </p>
                <span className="text-xs text-coffee-muted">
                  Trazabilidad completa por orden
                </span>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-5 space-y-1">
                <span className="text-xs text-coffee-muted">
                  Calificación de comensales:
                </span>
                <p className="text-2xl font-black text-espresso flex items-center gap-1.5">
                  <Star className="h-5 w-5 text-caramel fill-caramel" />
                  {activeRest.rating} / 5.0
                </p>
                <span className="text-xs text-coffee-muted">
                  Basado en {activeRest.reviewCount} reseñas verificadas
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PESTAÑA 3: CATÁLOGO DE PLATILLOS Y ALÉRGENOS (WIDESCREEN GRID)
           ===================================================================== */}
        {activeTab === "catalogo" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-border pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-caramel block">
                  Menú Sincronizado con la App del Cliente
                </span>
                <h2 className="text-xl font-extrabold text-espresso">
                  Catálogo de {activeRest.name} ({activeRest.menu.length} productos)
                </h2>
                <p className="text-xs text-coffee-muted mt-0.5">
                  Regla de negocio RN-07: La falta de información de ingredientes o alérgenos no significa que un producto sea seguro.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDbCatalogEditor(!showDbCatalogEditor)}
                className="rounded-full bg-espresso text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:bg-espresso-light transition cursor-pointer"
              >
                {showDbCatalogEditor
                  ? "Ver Catálogo Visual de la Sucursal"
                  : "Abrir Editor Conectado a Base de Datos Local"}
              </button>
            </div>

            {showDbCatalogEditor ? (
              <RestaurantCatalogPanel />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeRest.menu.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-cream-border bg-cream-container/20 p-4 flex flex-col justify-between gap-3 hover:border-caramel transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-0.5 text-[10px] font-bold text-caramel">
                          {item.categoryLabel}
                        </span>
                        <span className="text-sm font-black text-espresso">
                          {formatCurrencyMXN(item.price)}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-espresso">
                        {item.name}
                      </h3>
                      <p className="text-xs text-coffee-muted line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-cream-border/70 flex flex-wrap gap-1">
                      {item.safeBadges.map((badge, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white border border-cream-border px-2 py-0.5 text-[10px] font-bold text-espresso"
                        >
                          {badge}
                        </span>
                      ))}
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Disponible en App Cliente
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =====================================================================
            PESTAÑA 4: PERFIL DE LA SUCURSAL
           ===================================================================== */}
        {activeTab === "perfil" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="border-b border-cream-border pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-caramel block">
                Información Operativa del Restaurante
              </span>
              <h2 className="text-xl font-extrabold text-espresso">
                Ficha Técnica de {activeRest.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="rounded-2xl border border-cream-border bg-cream-container/40 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-cream-border text-3xl shadow-2xs">
                    {activeRest.avatarEmoji}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-espresso">
                      {activeRest.name}
                    </h3>
                    <p className="text-xs text-roasted font-bold">
                      ID en Sistema: {loggedAccount.restaurantId}
                    </p>
                    <p className="text-xs text-coffee-muted">
                      {activeRest.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-cream-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-coffee-muted">Correo de cuenta:</span>
                    <span className="font-bold text-espresso">
                      {loggedAccount.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-muted">Responsable de cocina:</span>
                    <span className="font-bold text-espresso">
                      {loggedAccount.managerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-muted">Dirección de recolección:</span>
                    <span className="font-bold text-espresso">
                      {loggedAccount.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-muted">Tiempo estimado de preparación:</span>
                    <span className="font-bold text-espresso">
                      {activeRest.prepTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-espresso">
                    Conexión en Tiempo Real
                  </h3>
                  <p className="text-xs text-coffee-muted leading-relaxed">
                    Esta sucursal está enlazada directamente con el selector de
                    restaurantes de la aplicación del cliente (`apps/customer`) y
                    con el mapa de rutas de los repartidores (`apps/delivery`).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-cream-border bg-cream-container py-3 text-xs font-bold text-espresso hover:bg-espresso hover:text-white transition cursor-pointer"
                >
                  Cerrar Sesión o Cambiar de Restaurante
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Pie de página Widescreen */}
      <footer className="w-full max-w-[1600px] mx-auto text-center text-xs text-coffee-muted mt-8 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-cream-border/70 shadow-2xs">
          © 2026 {PROJECT_NAME} Restaurante — Operación de Cocina en Pantalla Completa ({activeRest.name}).
        </p>
      </footer>
    </div>
  );
}

// =============================================================================
// TARJETA INDIVIDUAL DE PEDIDO PARA EL TABLERO KDS
// =============================================================================
function OrderKdsCard({
  order,
  onAdvanceStage,
}: {
  order: ActiveOrder;
  onAdvanceStage: (
    order: ActiveOrder,
    nextStage: KitchenOrderStage,
  ) => Promise<void>;
}) {
  return (
    <article className="rounded-2xl border border-cream-border bg-white p-4 shadow-2xs space-y-3 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Cabecera de la tarjeta */}
        <div className="flex items-start justify-between gap-2 border-b border-cream-border pb-2.5">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-caramel block">
              #{order.id}
            </span>
            <h4 className="text-sm font-extrabold text-espresso leading-snug">
              {order.dishName}
            </h4>
            {order.beverageName && (
              <p className="text-xs font-semibold text-roasted mt-0.5">
                + Bebida: {order.beverageName}
              </p>
            )}
          </div>
          <span className="text-xs font-black text-espresso bg-cream-container px-2.5 py-1 rounded-full border border-cream-border shrink-0">
            {formatCurrencyMXN(order.total)}
          </span>
        </div>

        {/* Datos del cliente y PIN */}
        <div className="rounded-xl bg-cream-container/40 border border-cream-border p-2.5 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-espresso flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-caramel" />
              {order.customerName}
            </span>
            <span className="text-[10px] font-extrabold text-espresso bg-white px-2 py-0.5 rounded-full border border-cream-border">
              PIN #{order.deliveryPin}
            </span>
          </div>
          <p className="text-[11px] text-coffee-muted flex items-center gap-1">
            <MapPin className="h-3 w-3 text-roasted shrink-0" />
            <span className="truncate">{order.customerAddress}</span>
          </p>
        </div>

        {/* Alérgenos y Restricciones */}
        <div className="rounded-xl bg-cream-container/60 border border-cream-border p-2.5 text-xs space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-espresso">
            <AlertTriangle className="h-3.5 w-3.5 text-caramel shrink-0" />
            <span>Restricciones:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {order.allergens.map((alg, i) => (
              <span
                key={i}
                className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-caramel border border-cream-border"
              >
                {alg}
              </span>
            ))}
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-espresso border border-cream-border">
              {order.caloriesText}
            </span>
          </div>
        </div>

        {/* INFORMACIÓN DEL REPARTIDOR QUE ENTREGA EL PEDIDO */}
        {order.courier ? (
          <div className="rounded-xl border-2 border-caramel/40 bg-cream-soft p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel flex items-center gap-1">
                <Bike className="h-3.5 w-3.5" />
                Repartidor Asignado
              </span>
              <span className="rounded-full bg-white border border-cream-border px-2 py-0.5 text-[10px] font-bold text-espresso">
                {order.courier.plates}
              </span>
            </div>
            <p className="font-extrabold text-espresso">
              {order.courier.name} ★ {order.courier.rating ?? 4.9}
            </p>
            <p className="text-[11px] text-coffee-muted">
              {order.courier.vehicle}
            </p>
            <p className="text-[11px] font-bold text-espresso flex items-center gap-1">
              <Phone className="h-3 w-3 text-caramel" />
              {order.courier.phone}
            </p>
            <div className="pt-1 border-t border-cream-border flex items-center justify-between text-[10px]">
              <span className="text-coffee-muted">Estado ruta:</span>
              <span className="font-extrabold text-caramel">
                {COURIER_STEP_LABELS[order.courierStep]}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-cream-border bg-cream-soft/40 p-2.5 text-[11px] text-coffee-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bike className="h-3.5 w-3.5 text-caramel shrink-0" />
              <span>Esperando asignación de repartidor</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-coffee-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-roasted" />
            {formatOrderTime(order.createdAt)}
          </span>
          {order.deliveredAt && (
            <span className="text-emerald-700 font-bold">
              Entregado: {formatOrderTime(order.deliveredAt)}
            </span>
          )}
        </div>
      </div>

      {/* Botón de avance de etapa */}
      <div className="pt-2 border-t border-cream-border">
        {order.kitchenStage === "POR_HACER" && (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => void onAdvanceStage(order, "EN_PREPARACION")}
              className="flex-1 rounded-full bg-espresso py-2 px-3 text-xs font-bold text-white hover:bg-espresso-light transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-caramel" />
              <span>Iniciar Preparación</span>
            </button>
            <button
              type="button"
              onClick={() => void onAdvanceStage(order, "CANCELADO")}
              className="rounded-full border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
              title="Cancelar pedido"
            >
              <Ban className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {order.kitchenStage === "EN_PREPARACION" && (
          <button
            type="button"
            onClick={() => void onAdvanceStage(order, "EN_ESPERA_REPARTIDOR")}
            className="w-full rounded-full bg-espresso py-2 px-3 text-xs font-bold text-white hover:bg-espresso-light transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PackageCheck className="h-3.5 w-3.5 text-caramel" />
            <span>Pasar a Espera de Recibir</span>
          </button>
        )}

        {order.kitchenStage === "EN_ESPERA_REPARTIDOR" && (
          <button
            type="button"
            onClick={() => void onAdvanceStage(order, "EN_DELIVERY")}
            className="w-full rounded-full bg-caramel py-2 px-3 text-xs font-bold text-white hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bike className="h-3.5 w-3.5" />
            <span>Entregar a Repartidor (En Delivery)</span>
          </button>
        )}

        {order.kitchenStage === "EN_DELIVERY" && (
          <button
            type="button"
            onClick={() => void onAdvanceStage(order, "ENTREGADO")}
            className="w-full rounded-full border border-emerald-300 bg-emerald-50 py-2 px-3 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
            <span>Marcar como Entregado</span>
          </button>
        )}

        {order.kitchenStage === "ENTREGADO" && (
          <div className="rounded-full bg-emerald-50 border border-emerald-200 py-1.5 px-3 text-center text-[11px] font-extrabold text-emerald-800 flex items-center justify-center gap-1">
            <Check className="h-3.5 w-3.5 text-emerald-700" />
            <span>Pedido Entregado</span>
          </div>
        )}
      </div>
    </article>
  );
}
