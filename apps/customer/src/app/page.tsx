"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PROJECT_NAME,
  PROJECT_MOTTO,
  formatCurrencyMXN,
  catalogRequest,
  catalogToPresentation,
  createActiveOrder,
  fetchActiveOrders,
  sendOrderChatMessage,
  KITCHEN_STAGE_LABELS,
  COURIER_STEP_LABELS,
  RESTAURANT_LOCATIONS,
} from "@coconea/shared";
import {
  Calendar,
  ShieldCheck,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  UtensilsCrossed,
  Pizza,
  Salad,
  Info,
  Check,
  ChefHat,
  SlidersHorizontal,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Mail,
  Search,
  Star,
  MapPin,
  Leaf,
  Plus,
  ShoppingBag,
  Store,
  X,
  Phone,
  AlertTriangle,
  Bike,
  MessageSquare,
  Send,
} from "lucide-react";
import CustomerDashboard from "@/app/components/CustomerDashboard";
import DietPreferencesSettings from "@/app/components/DietPreferencesSettings";
import { Navbar, CustomerTab } from "@/components/navbar";
import { PueblaAddressMap } from "@/components/puebla-address-map";
import { useAuth, DEMO_ACCOUNTS } from "@/context/auth-context";

// =============================================================================
// MODELOS DE DATOS: RESTAURANTES ALIADOS Y SUS RESPECTIVOS MENÚS
// =============================================================================

import {
  DEMO_RESTAURANTS,
  type DemoMenuItem as DishItem,
  type DemoRestaurant as Restaurant,
} from "@coconea/shared";

import type { ActiveOrder, CatalogRestaurant, GeoPoint } from "@coconea/types";

const LOCAL_CATALOG = process.env.NEXT_PUBLIC_APP_MODE === "local";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

const CUISINE_FILTERS = [
  { id: "all", label: "Todos", icon: Store },
  { id: "burgers", label: "Hamburguesas", icon: UtensilsCrossed },
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "salads", label: "Ensaladas", icon: Salad },
  { id: "chicken", label: "Pollo", icon: ChefHat },
  { id: "subs", label: "Sándwiches", icon: Leaf },
];

// Simulación de la planificación semanal de comidas
interface DayPlan {
  day: string;
  fullDay: string;
  restaurantId: string;
  dishId: string;
  status: string;
}

const INITIAL_WEEKLY_PLAN: DayPlan[] = [
  {
    day: "Lun",
    fullDay: "Lunes",
    restaurantId: "rest-raices",
    dishId: "dish-r1",
    status: "Propuesta de Hoy",
  },
  {
    day: "Mar",
    fullDay: "Martes",
    restaurantId: "rest-botanica",
    dishId: "dish-b1",
    status: "Programado",
  },
  {
    day: "Mié",
    fullDay: "Miércoles",
    restaurantId: "rest-pacifico",
    dishId: "dish-p1",
    status: "Programado",
  },
  {
    day: "Jue",
    fullDay: "Jueves",
    restaurantId: "rest-raices",
    dishId: "dish-r2",
    status: "Programado",
  },
  {
    day: "Vie",
    fullDay: "Viernes",
    restaurantId: "rest-botanica",
    dishId: "dish-b1",
    status: "Programado",
  },
];

// =============================================================================
// COMPONENTE PRINCIPAL (ENFOQUE MOBILE-FIRST NATIVO)
// =============================================================================

export default function CustomerHome() {
  const { user, isAuthenticated, logout, login } = useAuth();
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(DEMO_RESTAURANTS);
  const [catalogLoaded, setCatalogLoaded] = useState(!LOCAL_CATALOG);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CustomerTab>("inicio");

  // Estado del restaurante seleccionado en el directorio (null = lista de restaurantes, string = ver menú de ese restaurante)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  // Filtros de búsqueda en la vista de restaurantes
  const [restaurantFilter, setRestaurantFilter] = useState<string>("all");
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState("");
  const restaurantCarousel = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filtro de categoría dentro del menú del restaurante específico
  const [menuFilter, setMenuFilter] = useState<string>("all");

  // Propuesta Activa de Hoy (Restaurante y Platillo elegido)
  const [activeRestaurantId, setActiveRestaurantId] =
    useState<string>("rest-raices");
  const [activeDishId, setActiveDishId] = useState<string>("dish-r1");
  const [selectedBeverageId, setSelectedBeverageId] = useState<string | null>(
    null,
  );
  const [compostableCutlery, setCompostableCutlery] = useState<boolean>(true);
  const [proposalStatus, setProposalStatus] = useState<
    "pending" | "confirmed" | "rejected"
  >("pending");
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState<boolean>(false);
  const [customerChatInput, setCustomerChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Dirección real de envío y Pin en Puebla
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    "Calle Teziutlán Sur 48, Col. La Paz, Puebla, Pue.",
  );
  const [deliveryLocation, setDeliveryLocation] = useState<GeoPoint>({
    x: 37,
    y: 35,
    lat: 19.0528,
    lng: -98.2215,
    label: "Calle Teziutlán Sur 48, Col. La Paz, Puebla, Pue.",
  });

  // Plan Semanal editable
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(INITIAL_WEEKLY_PLAN);
  const [selectedPlanDay, setSelectedPlanDay] = useState<string>("Lun");
  const [planningMode, setPlanningMode] = useState<"recommendation" | "fixed">(
    "recommendation",
  );
  const [editingDayPlan, setEditingDayPlan] = useState<string | null>(null);

  // Modal para detalle nutricional y transparente de platillo
  const [selectedDishModal, setSelectedDishModal] = useState<DishItem | null>(
    null,
  );

  // Modal de confirmación para cambio de restaurante (Regla 8: Un solo restaurante por pedido)
  const [restaurantSwitchPending, setRestaurantSwitchPending] = useState<{
    targetRestaurant: Restaurant;
    targetDish: DishItem;
  } | null>(null);

  // Mensaje flotante Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    if (!LOCAL_CATALOG) return;
    let disposed = false;
    let busy = false;
    let lastCatalog = "";
    const load = async () => {
      if (busy || disposed) return;
      busy = true;
      try {
        const data = await catalogRequest<CatalogRestaurant[]>(
          API_URL,
          "/restaurants",
          { credentials: "omit" },
        );
        if (
          !data.length ||
          data.some((restaurant) => !restaurant.products.length)
        )
          throw new Error(
            "El catálogo local está vacío. Carga los datos iniciales.",
          );
        const serialized = JSON.stringify(data);
        if (!disposed) {
          if (serialized !== lastCatalog) {
            setRestaurants(catalogToPresentation(data));
            setProposalStatus("pending");
            setSelectedDishModal(null);
            setRestaurantSwitchPending(null);
            lastCatalog = serialized;
          }
          setCatalogLoaded(true);
          setCatalogError(null);
        }
      } catch (error) {
        if (!disposed)
          setCatalogError(
            error instanceof Error
              ? error.message
              : "No se pudo actualizar el catálogo.",
          );
      } finally {
        busy = false;
      }
    };
    void load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 5000);
    window.addEventListener("focus", load);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, []);

  // Restaurante activo en la propuesta
  const currentProposalRestaurant = useMemo(() => {
    return (
      restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0]
    );
  }, [activeRestaurantId, restaurants]);

  // Platillo activo en la propuesta
  const currentProposalDish = useMemo(() => {
    return (
      currentProposalRestaurant.menu.find((d) => d.id === activeDishId) ||
      currentProposalRestaurant.menu[0]
    );
  }, [currentProposalRestaurant, activeDishId]);

  // Bebida activa en la propuesta (si existe)
  const currentProposalBeverage = useMemo(() => {
    if (!selectedBeverageId) return null;
    return (
      currentProposalRestaurant.menu.find((d) => d.id === selectedBeverageId) ||
      null
    );
  }, [currentProposalRestaurant, selectedBeverageId]);

  // Cálculo financiero transparente de la propuesta activa
  const dishPrice = currentProposalDish.price;
  const beveragePrice = currentProposalBeverage
    ? currentProposalBeverage.price
    : 0;
  const deliveryFee = 20.0; // Envío refrigerado especializado
  const ethicalServiceFee = 15.0; // Tarifa ética de plataforma
  const proposalTotal =
    dishPrice + beveragePrice + deliveryFee + ethicalServiceFee;

  // Sincronización en vivo del pedido activo del cliente con Restaurante y Repartidor
  useEffect(() => {
    let disposed = false;
    const syncOrder = async () => {
      try {
        const orders = await fetchActiveOrders(API_URL);
        if (disposed) return;
        if (activeOrder) {
          const updated = orders.find((o) => o.id === activeOrder.id);
          if (updated) setActiveOrder(updated);
        } else if (user) {
          const myLatest = orders.find(
            (o) =>
              o.customerEmail.toLowerCase() === user.email.toLowerCase() &&
              o.kitchenStage !== "CANCELADO",
          );
          if (myLatest) {
            setActiveOrder(myLatest);
            setProposalStatus("confirmed");
          }
        }
      } catch {
        // Ignore transient sync errors
      }
    };
    void syncOrder();
    const timer = window.setInterval(syncOrder, 2500);
    window.addEventListener("focus", syncOrder);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", syncOrder);
    };
  }, [activeOrder?.id, user?.email]);

  // Confirmar explícitamente la propuesta y enviar la orden al restaurante elegido
  const handleConfirmProposalOrder = async () => {
    if (!deliveryAddress.trim()) {
      showToast(
        "Por favor ingresa tu dirección en Puebla o elige tu ubicación con el Pin en el mapa.",
      );
      return;
    }
    setIsConfirmingOrder(true);
    try {
      const created = await createActiveOrder(
        {
          proposalCode: "PROP-8421",
          restaurantId: currentProposalRestaurant.id,
          restaurantName: currentProposalRestaurant.name,
          restaurantAddress: currentProposalRestaurant.address,
          customerId: user?.id || "usr_demo_standard_01",
          customerName: user?.fullName || "Sofía Méndez",
          customerEmail: user?.email || "sofia.mendez@coconea.local",
          customerPhone: user?.phone || "+52 222 123 4567",
          customerAddress: deliveryAddress.trim(),
          customerLocation: {
            ...deliveryLocation,
            label: deliveryAddress.trim(),
          },
          dishId: currentProposalDish.id,
          dishName: currentProposalDish.name,
          dishPrice,
          beverageId: currentProposalBeverage?.id || null,
          beverageName: currentProposalBeverage?.name || null,
          beveragePrice,
          compostableCutlery,
          allergens: user?.allergies?.length
            ? user.allergies
            : currentProposalDish.safeBadges,
          dietaryNotes: user?.dietaryPreferences?.length
            ? user.dietaryPreferences
            : ["Plan Equilibrado"],
          caloriesText: `${currentProposalDish.calories ?? 550} kcal • ${currentProposalDish.protein ?? 36}g Prot`,
          deliveryFee,
          serviceFee: ethicalServiceFee,
          total: proposalTotal,
          paymentMethod: "Tarjeta",
          estimatedWindow: "Hoy 13:30 - 14:15 hrs",
        },
        API_URL,
      );
      setActiveOrder(created);
      setProposalStatus("confirmed");
      showToast(
        `¡Pedido #${created.id} enviado a ${currentProposalRestaurant.name} en Puebla!`,
      );
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  // Enviar mensaje directo del cliente al repartidor durante el proceso del pedido (Punto 4)
  const handleSendCustomerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !customerChatInput.trim()) return;
    setIsSendingChat(true);
    try {
      const text = customerChatInput.trim();
      setCustomerChatInput("");
      const updated = await sendOrderChatMessage(
        activeOrder.id,
        "USER",
        activeOrder.customerName,
        text,
        API_URL,
      );
      if (updated) {
        setActiveOrder(updated);
      }
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleQuickCustomerMessage = async (text: string) => {
    if (!activeOrder) return;
    setIsSendingChat(true);
    try {
      const updated = await sendOrderChatMessage(
        activeOrder.id,
        "USER",
        activeOrder.customerName,
        text,
        API_URL,
      );
      if (updated) {
        setActiveOrder(updated);
      }
    } finally {
      setIsSendingChat(false);
    }
  };

  // Restaurante que se está visualizando en el directorio/drilldown
  const viewingRestaurant = useMemo(() => {
    if (!selectedRestaurantId) return null;
    return restaurants.find((r) => r.id === selectedRestaurantId) || null;
  }, [selectedRestaurantId, restaurants]);

  // Lista filtrada de restaurantes para el directorio
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      const matchesCategory =
        restaurantFilter === "all" || rest.cuisineCategory === restaurantFilter;
      const q = restaurantSearchQuery.toLowerCase();
      const matchesSearch =
        rest.name.toLowerCase().includes(q) ||
        rest.tagline.toLowerCase().includes(q) ||
        rest.specialty.toLowerCase().includes(q) ||
        rest.badges.some((b) => b.toLowerCase().includes(q)) ||
        rest.menu.some((d) => d.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [restaurantFilter, restaurantSearchQuery, restaurants]);

  useEffect(() => {
    setCarouselIndex(0);
    restaurantCarousel.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [restaurantFilter, restaurantSearchQuery]);

  const moveCarousel = (direction: number) => {
    const carousel = restaurantCarousel.current;
    const card = carousel?.querySelector("article");
    if (carousel && card)
      carousel.scrollBy({
        left: direction * (card.getBoundingClientRect().width + 16),
        behavior: "smooth",
      });
  };

  // Platillos filtrados dentro del restaurante que se está explorando
  const filteredRestaurantMenu = useMemo(() => {
    if (!viewingRestaurant) return [];
    if (menuFilter === "all") return viewingRestaurant.menu;
    return viewingRestaurant.menu.filter((d) => d.category === menuFilter);
  }, [viewingRestaurant, menuFilter]);

  // Manejador de selección de platillo para la propuesta
  const handleSelectDishForProposal = (
    restaurant: Restaurant,
    dish: DishItem,
  ) => {
    if (dish.available === false || (LOCAL_CATALOG && catalogError)) {
      showToast("Este producto no está disponible para seleccionar.");
      return;
    }
    // Si el platillo pertenece a un restaurante diferente del actual en la propuesta
    if (activeRestaurantId !== restaurant.id && activeDishId) {
      setRestaurantSwitchPending({
        targetRestaurant: restaurant,
        targetDish: dish,
      });
      return;
    }

    // Mismo restaurante: actualizar platillo o bebida
    if (dish.isBeverage) {
      setSelectedBeverageId(dish.id);
      showToast(`Bebida «${dish.name}» agregada a tu propuesta.`);
    } else {
      setActiveRestaurantId(restaurant.id);
      setActiveDishId(dish.id);
      // Reiniciar bebida si pertenecía a otra cocina
      setSelectedBeverageId(null);
      setProposalStatus("pending");
      showToast(`¡«${dish.name}» elegido como tu comida de hoy!`);
    }
  };

  // Confirmación de cambio de restaurante
  const handleConfirmRestaurantSwitch = () => {
    if (!restaurantSwitchPending) return;
    const { targetRestaurant, targetDish } = restaurantSwitchPending;
    setActiveRestaurantId(targetRestaurant.id);
    if (targetDish.isBeverage) {
      // Elegir primer plato fuerte de ese restaurante y esta bebida
      const firstMain =
        targetRestaurant.menu.find((d) => !d.isBeverage) ||
        targetRestaurant.menu[0];
      setActiveDishId(firstMain.id);
      setSelectedBeverageId(targetDish.id);
    } else {
      setActiveDishId(targetDish.id);
      setSelectedBeverageId(null);
    }
    setProposalStatus("pending");
    setRestaurantSwitchPending(null);
    showToast(`Tu propuesta ahora es de ${targetRestaurant.name}.`);
    setActiveTab("propuesta");
  };

  if (LOCAL_CATALOG && !catalogLoaded)
    return (
      <main className="mx-auto max-w-lg p-6 space-y-4 text-espresso">
        <h1 className="text-xl font-semibold">Coconea</h1>
        <p role="status">{catalogError || "Cargando el catálogo local…"}</p>
        {catalogError && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-espresso px-5 py-3 text-white"
          >
            Reintentar
          </button>
        )}
      </main>
    );

  return (
    <div className="customer-shell min-h-screen flex flex-col justify-between px-4 pt-4 sm:px-6 sm:pt-6 selection:bg-caramel/20 selection:text-espresso">
      {/* Contenedor Principal Centrado Estilo Mobile (max-w-md / 100% en pantallas móviles) */}
      <main className="w-full max-w-lg mx-auto space-y-5">
        {/* Barra Superior de la Aplicación */}
        <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
        {LOCAL_CATALOG && (
          <p
            role="status"
            className="rounded-2xl border border-cream-border bg-white p-3 text-sm text-roasted"
          >
            {catalogError ||
              "Catálogo local conectado. Las compras y programaciones de esta vista siguen siendo demostraciones."}
          </p>
        )}

        {/* Notificación Toast Flotante */}
        {toastMessage && (
          <div className="rounded-2xl bg-espresso text-cream px-3.5 py-2.5 text-sm font-semibold shadow-lg border border-caramel/40 flex items-center gap-2 animate-fadeIn z-50">
            <CheckCircle2 className="h-4 w-4 text-caramel flex-shrink-0" />
            <span className="flex-1 leading-snug">{toastMessage}</span>
          </div>
        )}

        {/* Banner de Pedido Activo en Tiempo Real (Acceso rápido a Seguimiento y Chat con Repartidor) */}
        {activeOrder && activeTab !== "propuesta" && (
          <div className="rounded-2xl border-2 border-caramel bg-white/95 backdrop-blur-md p-3 shadow-xs flex items-center justify-between gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-espresso text-caramel">
                <Bike className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel block">
                  Pedido #{activeOrder.id} •{" "}
                  {KITCHEN_STAGE_LABELS[activeOrder.kitchenStage]}
                </span>
                <p className="text-xs font-extrabold text-espresso truncate">
                  {activeOrder.restaurantName}:{" "}
                  {COURIER_STEP_LABELS[activeOrder.courierStep]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("propuesta")}
              className="shrink-0 rounded-full bg-espresso text-white px-3.5 py-2 text-xs font-bold hover:bg-espresso-light transition cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="h-3.5 w-3.5 text-caramel" />
              <span>Ver Ruta y Chat</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            VENTANA 1: RESTAURANTES & MENÚS (DIRECTORIO Y DRILLDOWN DE MENÚS)
           ========================================================================= */}
        {activeTab === "inicio" && (
          <div className="space-y-3.5 animate-fadeIn">
            {isAuthenticated && user && (
              <CustomerDashboard
                nombre={user.fullName}
                onNavigateTab={setActiveTab}
              />
            )}
            {/* Banner de Saludo y Acceso a la Propuesta */}
            <div className="rounded-2xl border border-cream-border/90 bg-white p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-espresso truncate">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-caramel text-white text-[12px] font-bold">
                  ✓
                </span>
                <span className="truncate text-sm sm:text-sm">
                  {isAuthenticated && user ? (
                    <>
                      Hola,{" "}
                      <strong className="font-bold">
                        {user.fullName.split(" ")[0]}
                      </strong>
                    </>
                  ) : (
                    <>Tu próxima comida</>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("propuesta")}
                className="flex-shrink-0 text-[12px] font-bold text-caramel bg-cream-container border border-cream-border px-2.5 py-1 rounded-full hover:bg-cream-container/80 active:scale-95 transition cursor-pointer flex items-center gap-1"
              >
                <span>Ver propuesta</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* VISTA A: SI NO HAY RESTAURANTE SELECCIONADO -> MOSTRAR DIRECTORIO DE RESTAURANTES */}
            {!selectedRestaurantId && (
              <div className="space-y-3">
                {/* Buscador de Restaurantes */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={restaurantSearchQuery}
                    onChange={(e) => setRestaurantSearchQuery(e.target.value)}
                    aria-label="Buscar restaurantes o platillos"
                    placeholder="Buscar restaurantes o platillos"
                    className="w-full rounded-2xl border border-cream-border bg-white/95 backdrop-blur-md pl-11 pr-11 py-3.5 text-base text-coffee placeholder-coffee-muted/50 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 shadow-xs transition"
                  />
                  {restaurantSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRestaurantSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-coffee-muted hover:text-espresso p-1.5 cursor-pointer"
                      aria-label="Borrar búsqueda"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtros de Tipo de Cocina en Carrusel Táctil */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-sm scroll-smooth">
                  {CUISINE_FILTERS.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = restaurantFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setRestaurantFilter(cat.id)}
                        aria-pressed={isSelected}
                        className={`flex shrink-0 items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer border active:scale-95 ${
                          isSelected
                            ? "bg-espresso text-white border-espresso shadow-xs"
                            : "bg-white/90 text-roasted border-cream-border hover:bg-cream-container hover:text-espresso"
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Banner de Garantía de Selección */}
                <div className="rounded-3xl border border-cream-border/90 bg-gradient-to-br from-white via-cream-container/40 to-cream-soft p-3.5 shadow-xs space-y-1">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-caramel flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />A tu gusto, a tu ritmo
                  </span>
                  <p className="text-2xl font-semibold text-espresso leading-tight">
                    ¿Qué se te antoja hoy?
                  </p>
                  <p className="text-[12px] sm:text-sm text-coffee-muted leading-relaxed">
                    Explora los menús y elige tu comida. Revisa ingredientes y
                    alérgenos antes de confirmar.
                  </p>
                </div>

                {/* Lista de Restaurantes (Tarjetas Táctiles Optimizadas para Móvil) */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 items-center justify-between text-sm px-1">
                    <span className="font-extrabold text-espresso">
                      Restaurantes ({filteredRestaurants.length})
                    </span>
                    <span className="text-[12px] text-coffee-muted font-medium">
                      Desliza para explorar
                    </span>
                  </div>

                  {filteredRestaurants.length === 0 && (
                    <div
                      className="rounded-2xl border border-cream-border bg-white p-6 text-center space-y-2"
                      role="status"
                    >
                      <Search
                        className="h-6 w-6 mx-auto text-roasted"
                        aria-hidden="true"
                      />
                      <p className="font-semibold text-espresso">
                        No encontramos restaurantes
                      </p>
                      <p className="text-sm text-coffee-muted">
                        Prueba con otro nombre o cambia el tipo de cocina.
                      </p>
                    </div>
                  )}
                  <p className="text-xs leading-relaxed text-coffee-muted">
                    Demo visual con marcas reales, sin afiliación. Menús,
                    precios, valoraciones y tiempos simulados; imágenes de
                    referencia.
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-roasted" aria-live="polite">
                      {filteredRestaurants.length ? carouselIndex + 1 : 0} de{" "}
                      {filteredRestaurants.length} restaurantes
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Restaurante anterior"
                        disabled={carouselIndex === 0}
                        onClick={() => moveCarousel(-1)}
                        className="flex items-center justify-center rounded-full border border-cream-border bg-white text-espresso disabled:opacity-30"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Restaurante siguiente"
                        disabled={
                          carouselIndex >= filteredRestaurants.length - 1
                        }
                        onClick={() => moveCarousel(1)}
                        className="flex items-center justify-center rounded-full border border-cream-border bg-white text-espresso disabled:opacity-30"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    ref={restaurantCarousel}
                    role="region"
                    aria-label="Carrusel de restaurantes"
                    aria-roledescription="carrusel"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowLeft"
                      ) {
                        event.preventDefault();
                        moveCarousel(event.key === "ArrowRight" ? 1 : -1);
                      }
                    }}
                    onScroll={(event) => {
                      const carousel = event.currentTarget;
                      const card = carousel.querySelector("article");
                      if (card)
                        setCarouselIndex(
                          Math.min(
                            filteredRestaurants.length - 1,
                            Math.max(
                              0,
                              Math.round(
                                carousel.scrollLeft /
                                  (card.getBoundingClientRect().width + 16),
                              ),
                            ),
                          ),
                        );
                    }}
                    className="restaurant-carousel flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1"
                  >
                    {filteredRestaurants.map((restaurant) => (
                      <article
                        key={restaurant.id}
                        aria-labelledby={restaurant.id + "-title"}
                        className="restaurant-slide shrink-0 snap-start overflow-hidden rounded-2xl border border-cream-border bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRestaurantId(restaurant.id);
                            setMenuFilter("all");
                          }}
                          aria-label={"Ver menú de " + restaurant.name}
                          className="flex h-full w-full flex-col text-left transition hover:bg-cream-soft focus-visible:outline-offset-[-3px]"
                        >
                          <img
                            src={restaurant.image}
                            alt={restaurant.imageAlt}
                            width={640}
                            height={360}
                            className="h-40 w-full bg-cream-container object-contain"
                          />
                          <span className="block space-y-2 p-4 sm:p-5">
                            <span
                              id={restaurant.id + "-title"}
                              className="block text-lg font-semibold leading-snug text-espresso"
                            >
                              {restaurant.name}
                            </span>
                            <span className="block text-sm leading-relaxed text-coffee-muted">
                              {restaurant.tagline}
                            </span>
                          </span>
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2" aria-hidden="true">
                    {filteredRestaurants.map((restaurant, index) => (
                      <span
                        key={restaurant.id}
                        className={
                          index === carouselIndex
                            ? "h-1.5 w-6 rounded-full bg-espresso"
                            : "h-1.5 w-1.5 rounded-full bg-mocha-light"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISTA B: DRILL-DOWN DEL MENÚ DEL RESTAURANTE SELECCIONADO */}
            {selectedRestaurantId && viewingRestaurant && (
              <div className="space-y-3.5 animate-fadeIn">
                {/* Botón de Regreso al Directorio de Restaurantes */}
                <button
                  type="button"
                  onClick={() => setSelectedRestaurantId(null)}
                  className="rounded-full border border-cream-border bg-white/95 px-3 py-1.5 text-sm font-bold text-espresso hover:bg-cream-container active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Volver a Restaurantes</span>
                </button>

                {/* Ficha Cabecera del Restaurante Abierto */}
                <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-xs space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border text-xl shadow-2xs ${viewingRestaurant.avatarBg}`}
                    >
                      <span>{viewingRestaurant.avatarEmoji}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h2 className="text-base font-black text-espresso truncate">
                          {viewingRestaurant.name}
                        </h2>
                        <div className="flex items-center text-sm font-bold text-caramel gap-0.5 flex-shrink-0">
                          <Star className="h-3.5 w-3.5 fill-caramel" />
                          <span>{viewingRestaurant.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-roasted font-medium truncate">
                        {viewingRestaurant.specialty}
                      </p>
                      <span className="text-[12px] text-coffee-muted">
                        {viewingRestaurant.distance} •{" "}
                        {viewingRestaurant.prepTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-coffee-muted leading-relaxed">
                    {viewingRestaurant.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-cream-border text-[12px] text-coffee-muted">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="h-3 w-3 text-caramel flex-shrink-0" />
                      <span className="truncate">
                        {viewingRestaurant.address}
                      </span>
                    </span>
                    <span className="font-bold text-roasted bg-cream-soft px-2 py-0.5 rounded-full border border-cream-border text-[12px] flex-shrink-0">
                      Marca de referencia · Demo
                    </span>
                  </div>
                </div>

                {/* Filtros de Categorías del Menú de Este Restaurante */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-sm scroll-smooth">
                  {viewingRestaurant.menuCategories.map((cat) => {
                    const isSelected = menuFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMenuFilter(cat.id)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition cursor-pointer border active:scale-95 ${
                          isSelected
                            ? "bg-espresso text-white border-espresso shadow-xs"
                            : "bg-white/90 text-roasted border-cream-border hover:bg-cream-container hover:text-espresso"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Lista de Platillos y Bebidas del Menú */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm px-1">
                    <span className="font-extrabold text-espresso">
                      Menú Disponible ({filteredRestaurantMenu.length})
                    </span>
                    <span className="text-[12px] text-coffee-muted">
                      Precios simulados · Demo
                    </span>
                  </div>

                  {filteredRestaurantMenu.map((dish) => {
                    const isChosenDish =
                      activeRestaurantId === viewingRestaurant.id &&
                      (activeDishId === dish.id ||
                        selectedBeverageId === dish.id);

                    return (
                      <div
                        key={dish.id}
                        className={`rounded-3xl border transition-all duration-200 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-xs space-y-2.5 ${
                          isChosenDish
                            ? "border-caramel/70 ring-2 ring-caramel/20 bg-cream-soft/30"
                            : "border-cream-border/90"
                        }`}
                      >
                        <figure className="relative overflow-hidden rounded-2xl border border-cream-border bg-cream-soft">
                          <img
                            src={dish.image}
                            alt={dish.imageAlt}
                            width={640}
                            height={360}
                            loading="lazy"
                            decoding="async"
                            className="h-40 w-full object-contain sm:h-44"
                          />
                          <figcaption className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-xs text-roasted">
                            Imagen de referencia
                          </figcaption>
                        </figure>
                        {dish.available === false && (
                          <p className="text-sm font-semibold text-roasted">
                            No disponible
                          </p>
                        )}
                        {/* Encabezado del Platillo */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            {dish.highlightTag && (
                              <span className="text-[12px] font-bold text-caramel bg-cream-container px-2 py-0.2 rounded-full border border-cream-border inline-block mb-0.5">
                                {dish.highlightTag}
                              </span>
                            )}
                            <h3 className="text-base font-extrabold text-espresso leading-snug">
                              {dish.name}
                            </h3>
                            <p className="text-sm text-coffee-muted leading-relaxed line-clamp-2">
                              {dish.description}
                            </p>
                          </div>
                          <span className="text-base font-extrabold text-espresso flex-shrink-0">
                            {formatCurrencyMXN(dish.price)}
                          </span>
                        </div>

                        {/* Chips de Macronutrientes */}
                        <div className="grid grid-cols-4 gap-1 p-1.5 rounded-xl bg-cream-container/60 border border-cream-border text-center text-[12px]">
                          <div>
                            <span className="block font-bold text-caramel">
                              {dish.calories || "—"}
                            </span>
                            <span className="text-[8px] text-coffee-muted uppercase">
                              kcal
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-espresso">
                              {dish.protein ? dish.protein + "g" : "—"}
                            </span>
                            <span className="text-[8px] text-coffee-muted uppercase">
                              Prot
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-espresso">
                              {dish.carbs ? dish.carbs + "g" : "—"}
                            </span>
                            <span className="text-[8px] text-coffee-muted uppercase">
                              Carbs
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-espresso">
                              {dish.fats ? dish.fats + "g" : "—"}
                            </span>
                            <span className="text-[8px] text-coffee-muted uppercase">
                              Grasas
                            </span>
                          </div>
                        </div>

                        {/* Alérgenos & Inocuidad */}
                        <div className="flex items-center gap-1 text-[12px] font-bold text-coffee-muted flex-wrap">
                          {dish.allergens.map((alg) => (
                            <span
                              key={alg}
                              className="bg-white px-2 py-0.5 rounded-full border border-cream-border/80"
                            >
                              ✓ {alg}
                            </span>
                          ))}
                        </div>

                        {/* Acciones del Platillo */}
                        <div className="pt-2 border-t border-cream-border/70 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDishModal(dish)}
                            className="text-sm font-bold text-roasted hover:text-espresso underline cursor-pointer p-1"
                          >
                            Ver Ingredientes
                          </button>

                          {isChosenDish ? (
                            <button
                              type="button"
                              onClick={() => setActiveTab("propuesta")}
                              className="rounded-full bg-espresso text-white px-3.5 py-1.5 text-sm font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Check className="h-3.5 w-3.5 text-caramel" />
                              <span>En tu Propuesta</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                dish.available === false || !!catalogError
                              }
                              onClick={() =>
                                handleSelectDishForProposal(
                                  viewingRestaurant,
                                  dish,
                                )
                              }
                              className="rounded-full bg-cream-container hover:bg-espresso hover:text-white text-espresso border border-cream-border px-3.5 py-1.5 text-sm font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <Plus className="h-3 w-3" />
                              <span>
                                {dish.isBeverage
                                  ? "Añadir Bebida"
                                  : "Elegir Comida"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Barra Flotante Fija de Resumen Móvil (Aparece justo arriba de la barra de navegación) */}
                {activeRestaurantId === viewingRestaurant.id && (
                  <div className="fixed bottom-[74px] inset-x-0 mx-auto max-w-md px-3 z-30 animate-fadeIn">
                    <div className="rounded-2xl border border-caramel/40 bg-espresso/95 backdrop-blur-md text-white p-3 shadow-xl flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-caramel text-espresso font-black text-sm flex-shrink-0">
                          ✓
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold truncate leading-tight">
                            {currentProposalDish.name}
                          </p>
                          <p className="text-[12px] text-caramel truncate font-medium">
                            {formatCurrencyMXN(currentProposalDish.price)} •{" "}
                            {currentProposalRestaurant.name.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("propuesta")}
                        className="flex-shrink-0 rounded-full bg-caramel text-espresso hover:bg-caramel-light active:scale-95 px-3.5 py-2 text-sm font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>Ver Propuesta</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: PROPUESTA DE HOY (TU PEDIDO / PROPUESTA ACTIVA)
           ========================================================================= */}
        {activeTab === "propuesta" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            {/* Encabezado de la Propuesta */}
            <div className="flex items-center justify-between pb-2.5 border-b border-cream-border">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                  PROPUESTA DIARIA #8421
                </span>
                <h2 className="text-base font-extrabold text-espresso leading-snug">
                  Tu Selección de Comida de Hoy
                </h2>
              </div>

              {proposalStatus === "pending" && (
                <span className="rounded-full bg-cream-container px-2.5 py-1 text-sm font-bold text-caramel border border-cream-border flex-shrink-0">
                  Pendiente
                </span>
              )}
              {proposalStatus === "confirmed" && (
                <span className="rounded-full bg-espresso text-cream px-2.5 py-1 text-sm font-bold flex-shrink-0">
                  Confirmada
                </span>
              )}
              {proposalStatus === "rejected" && (
                <span className="rounded-full bg-cream-soft text-coffee-muted px-2.5 py-1 text-sm font-bold border border-cream-border flex-shrink-0">
                  Rechazada
                </span>
              )}
            </div>

            {/* Ficha del Restaurante Seleccionado */}
            <div className="rounded-2xl border border-cream-border bg-cream-container/40 p-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-coffee-muted flex items-center gap-1.5 text-sm font-bold">
                  <Store className="h-4 w-4 text-caramel" />
                  Restaurante Asignado:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRestaurantId(null);
                    setActiveTab("inicio");
                  }}
                  className="text-[12px] font-bold text-caramel underline cursor-pointer hover:text-espresso"
                >
                  Cambiar Restaurante
                </button>
              </div>

              <div className="flex justify-between items-center pt-0.5">
                <div>
                  <h3 className="font-extrabold text-espresso text-sm">
                    {currentProposalRestaurant.name}
                  </h3>
                  <p className="text-[12px] text-coffee-muted">
                    {currentProposalRestaurant.address} •{" "}
                    {currentProposalRestaurant.distance}
                  </p>
                </div>
                <span className="text-[12px] font-bold text-caramel bg-white px-2 py-0.5 rounded-full border border-cream-border">
                  ★ {currentProposalRestaurant.rating}
                </span>
              </div>
            </div>

            {/* Ficha del Platillo Seleccionado */}
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-cream-border bg-white p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                      Platillo Principal:
                    </span>
                    <h3 className="font-extrabold text-espresso text-sm">
                      {currentProposalDish.name}
                    </h3>
                  </div>
                  <span className="font-extrabold text-espresso text-sm">
                    {formatCurrencyMXN(currentProposalDish.price)}
                  </span>
                </div>

                {/* Macronutrientes en Chips */}
                <div className="grid grid-cols-4 gap-1 p-1.5 rounded-xl bg-cream-container/60 border border-cream-border text-center text-[12px]">
                  <div className="font-bold text-caramel">
                    <span className="block text-[8px] uppercase text-coffee-muted">
                      Calorías
                    </span>
                    {currentProposalDish.calories ?? "—"} kcal
                  </div>
                  <div className="font-semibold text-espresso">
                    <span className="block text-[8px] uppercase text-coffee-muted">
                      Prot
                    </span>
                    {currentProposalDish.protein != null
                      ? currentProposalDish.protein + "g"
                      : "—"}
                  </div>
                  <div className="font-semibold text-espresso">
                    <span className="block text-[8px] uppercase text-coffee-muted">
                      Carbs
                    </span>
                    {currentProposalDish.carbs != null
                      ? currentProposalDish.carbs + "g"
                      : "—"}
                  </div>
                  <div className="font-semibold text-espresso">
                    <span className="block text-[8px] uppercase text-coffee-muted">
                      Grasas
                    </span>
                    {currentProposalDish.fats != null
                      ? currentProposalDish.fats + "g"
                      : "—"}
                  </div>
                </div>

                <p className="text-sm text-coffee-muted leading-relaxed line-clamp-2">
                  {currentProposalDish.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-cream-border/70 text-[12px]">
                  <button
                    type="button"
                    onClick={() => setSelectedDishModal(currentProposalDish)}
                    className="font-bold text-roasted underline hover:text-espresso"
                  >
                    Ver Ingredientes Ficha
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRestaurantId(currentProposalRestaurant.id);
                      setActiveTab("inicio");
                    }}
                    className="font-bold text-caramel underline hover:text-espresso"
                  >
                    Cambiar Platillo
                  </button>
                </div>
              </div>

              {/* Bebida Artesanal del Restaurante */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/30 p-3 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-espresso text-sm block">
                    Bebida artesanal de{" "}
                    {currentProposalRestaurant.name.split(" ")[0]}:
                  </span>
                  {selectedBeverageId && (
                    <button
                      type="button"
                      onClick={() => setSelectedBeverageId(null)}
                      className="text-[12px] text-coffee-muted underline hover:text-espresso"
                    >
                      Quitar bebida
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {currentProposalRestaurant.menu
                    .filter((d) => d.isBeverage)
                    .map((bev) => {
                      const isSelected = selectedBeverageId === bev.id;
                      return (
                        <button
                          key={bev.id}
                          type="button"
                          onClick={() =>
                            setSelectedBeverageId(isSelected ? null : bev.id)
                          }
                          className={`w-full py-2 px-3 rounded-xl border text-left flex justify-between items-center transition cursor-pointer text-sm active:scale-98 ${
                            isSelected
                              ? "bg-espresso text-white border-espresso shadow-2xs"
                              : "bg-white text-coffee border-cream-border hover:bg-cream-container"
                          }`}
                        >
                          <span className="font-semibold truncate max-w-[200px]">
                            {bev.name}
                          </span>
                          <span className="font-bold flex-shrink-0">
                            +{formatCurrencyMXN(bev.price)}
                          </span>
                        </button>
                      );
                    })}
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={compostableCutlery}
                    onChange={(e) => setCompostableCutlery(e.target.checked)}
                    className="rounded border-cream-border accent-espresso h-4 w-4"
                  />
                  <span className="text-sm text-coffee-muted">
                    Incluir cubiertos ecológicos compostables
                  </span>
                </label>
              </div>

              {/* Entrega, Horario y Selección de Dirección Real + Pin en Puebla */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-coffee-muted flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-roasted" />
                    Horario de entrega
                  </span>
                  <span className="font-semibold text-espresso">
                    Hoy 13:30 - 14:15 hrs
                  </span>
                </div>

                {proposalStatus === "pending" && (
                  <PueblaAddressMap
                    mode="picker"
                    customerAddress={deliveryAddress}
                    customerLocation={deliveryLocation}
                    restaurantName={currentProposalRestaurant.name}
                    restaurantAddress={currentProposalRestaurant.address}
                    restaurantLocation={
                      RESTAURANT_LOCATIONS[currentProposalRestaurant.id] || {
                        x: 41,
                        y: 41,
                        lat: 19.0488,
                        lng: -98.2165,
                        label: currentProposalRestaurant.address,
                      }
                    }
                    onChangeAddressAndLocation={(addr, loc) => {
                      setDeliveryAddress(addr);
                      setDeliveryLocation(loc);
                    }}
                  />
                )}
              </div>

              {/* Desglose de Precios */}
              <div className="pt-2 border-t border-cream-border/70 space-y-1 text-sm">
                <div className="flex justify-between text-coffee-muted">
                  <span>Platillo seleccionado:</span>
                  <span>{formatCurrencyMXN(dishPrice)}</span>
                </div>
                {currentProposalBeverage && (
                  <div className="flex justify-between text-coffee-muted">
                    <span>
                      Bebida ({currentProposalBeverage.name.split(" ")[0]}):
                    </span>
                    <span>{formatCurrencyMXN(beveragePrice)}</span>
                  </div>
                )}
                <div className="flex justify-between text-coffee-muted">
                  <span>Envío refrigerado especializado:</span>
                  <span>{formatCurrencyMXN(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-coffee-muted">
                  <span>Tarifa de servicio ético:</span>
                  <span>{formatCurrencyMXN(ethicalServiceFee)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-cream-border font-extrabold text-base text-espresso">
                  <span>Total cotizado:</span>
                  <span className="text-base text-espresso">
                    {formatCurrencyMXN(proposalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones de la Propuesta (Botones Táctiles para Móvil) */}
            {proposalStatus === "pending" && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-confirm-proposal"
                  type="button"
                  disabled={isConfirmingOrder}
                  onClick={() => void handleConfirmProposalOrder()}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-espresso py-3.5 text-sm font-bold text-white shadow-md hover:bg-espresso-light active:scale-95 transition cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4 text-mocha-light" />
                  <span>
                    {isConfirmingOrder
                      ? "Enviando pedido al restaurante..."
                      : `Confirmar y Recibir Comida (${formatCurrencyMXN(proposalTotal)})`}
                  </span>
                </button>
                <button
                  id="btn-reject-proposal"
                  type="button"
                  onClick={() => {
                    setProposalStatus("rejected");
                    showToast("Propuesta cancelada sin ningún costo ($0 MXN).");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full border border-cream-border py-2.5 text-sm font-semibold text-roasted hover:bg-cream-container active:scale-95 transition cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Rechazar o Cambiar de Cocina ($0 MXN)</span>
                </button>
              </div>
            )}

            {proposalStatus === "confirmed" && (
              <div className="rounded-3xl bg-cream-soft border-2 border-caramel/40 p-4 space-y-4 animate-fadeIn shadow-xs">
                <div className="flex items-center justify-between border-b border-cream-border pb-2.5">
                  <div className="flex items-center gap-1.5 text-espresso text-sm font-extrabold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>
                      {activeOrder?.kitchenStage === "ENTREGADO"
                        ? "¡Tu pedido fue entregado!"
                        : "¡Pedido Confirmado y en Seguimiento!"}
                    </span>
                  </div>
                  <span className="rounded-full bg-espresso text-cream px-2.5 py-0.5 text-xs font-extrabold">
                    #{activeOrder?.id || "ORD-2026-8421"}
                  </span>
                </div>

                <p className="text-xs text-coffee leading-snug">
                  Tu pedido de{" "}
                  <strong>
                    {activeOrder?.dishName || currentProposalDish.name}
                  </strong>{" "}
                  fue recibido por{" "}
                  <strong>
                    {activeOrder?.restaurantName ||
                      currentProposalRestaurant.name}
                  </strong>
                  .
                </p>

                {activeOrder && (
                  <>
                    {/* Barra de progreso en vivo de las 5 etapas */}
                    <div className="rounded-2xl bg-white border border-cream-border p-3 space-y-2.5 text-xs text-espresso">
                      <div className="flex items-center justify-between">
                        <span className="text-coffee-muted font-bold text-[11px]">
                          Etapa en Restaurante:
                        </span>
                        <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-0.5 font-extrabold text-espresso text-[11px]">
                          {KITCHEN_STAGE_LABELS[activeOrder.kitchenStage]}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1 pt-0.5">
                        {(
                          [
                            { key: "POR_HACER", label: "Por hacer" },
                            { key: "EN_PREPARACION", label: "Preparando" },
                            {
                              key: "EN_ESPERA_REPARTIDOR",
                              label: "Listo rec.",
                            },
                            { key: "EN_DELIVERY", label: "En delivery" },
                            { key: "ENTREGADO", label: "Entregado" },
                          ] as const
                        ).map((st, idx, arr) => {
                          const activeIdx = arr.findIndex(
                            (x) => x.key === activeOrder.kitchenStage,
                          );
                          const done = idx <= activeIdx;
                          const current = idx === activeIdx;
                          return (
                            <div
                              key={st.key}
                              className="flex flex-col items-center gap-1"
                            >
                              <div
                                className={`h-1.5 w-full rounded-full ${
                                  current
                                    ? "bg-caramel"
                                    : done
                                      ? "bg-espresso"
                                      : "bg-cream-border"
                                }`}
                              />
                              <span
                                className={`text-[9px] text-center leading-tight ${
                                  current
                                    ? "font-extrabold text-caramel"
                                    : done
                                      ? "font-bold text-espresso"
                                      : "text-coffee-muted"
                                }`}
                              >
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-cream-border">
                        <span className="text-coffee-muted font-bold text-[11px]">
                          Seguimiento Repartidor:
                        </span>
                        <span className="font-extrabold text-caramel text-right text-[11px]">
                          {COURIER_STEP_LABELS[activeOrder.courierStep]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-cream-border">
                        <span className="text-coffee-muted font-medium text-[11px]">
                          Tu PIN de seguridad para recibir:
                        </span>
                        <span className="rounded-lg bg-espresso text-cream px-2.5 py-0.5 font-black tracking-widest text-xs">
                          {activeOrder.deliveryPin}
                        </span>
                      </div>
                    </div>

                    {/* Ficha del Repartidor Asignado y Mapa Real en Vivo en Puebla */}
                    {activeOrder.courier ? (
                      <div className="rounded-2xl bg-white border border-cream-border p-3.5 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-espresso text-white shadow-2xs">
                              <Bike className="h-4 w-4 text-caramel" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                                Tu Repartidor Asignado en Puebla
                              </span>
                              <h4 className="font-extrabold text-espresso text-xs">
                                {activeOrder.courier.name} ★{" "}
                                {activeOrder.courier.rating ?? 4.9}
                              </h4>
                              <p className="text-[11px] text-coffee-muted">
                                {activeOrder.courier.vehicle} • Placas{" "}
                                <strong>{activeOrder.courier.plates}</strong>
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[10px] font-bold text-espresso">
                            <Phone className="h-3 w-3 text-caramel" />
                            {activeOrder.courier.phone}
                          </span>
                        </div>

                        <PueblaAddressMap
                          mode="tracking"
                          customerAddress={activeOrder.customerAddress}
                          customerLocation={activeOrder.customerLocation}
                          restaurantName={activeOrder.restaurantName}
                          restaurantAddress={activeOrder.restaurantAddress}
                          restaurantLocation={activeOrder.restaurantLocation}
                          courierName={activeOrder.courier.name}
                          courierLocation={activeOrder.courier.currentLocation}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="rounded-2xl bg-white/80 border border-dashed border-cream-border p-3 text-xs text-coffee-muted flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Bike className="h-4 w-4 text-caramel" />
                            Esperando que un repartidor en Puebla acepte tu pedido...
                          </span>
                          <span className="text-[10px] font-bold text-caramel">
                            Zona Puebla
                          </span>
                        </div>
                        <PueblaAddressMap
                          mode="tracking"
                          customerAddress={activeOrder.customerAddress}
                          customerLocation={activeOrder.customerLocation}
                          restaurantName={activeOrder.restaurantName}
                          restaurantAddress={activeOrder.restaurantAddress}
                          restaurantLocation={activeOrder.restaurantLocation}
                        />
                      </div>
                    )}

                    {/* CHAT EN TIEMPO REAL CON EL REPARTIDOR DURANTE EL PROCESO (PUNTO 4) */}
                    <div className="rounded-2xl bg-white border border-cream-border p-3.5 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-cream-border pb-2">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-caramel" />
                          <span className="font-extrabold text-espresso">
                            Chat en Vivo con tu Repartidor
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-caramel bg-cream-container px-2 py-0.5 rounded-full border border-cream-border">
                          En línea
                        </span>
                      </div>

                      {/* Lista de mensajes sincronizados */}
                      <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-cream-soft/50 border border-cream-border p-2.5 flex flex-col">
                        {activeOrder.messages.map((msg) => {
                          const isMe = msg.senderRole === "USER";
                          const isSystem = msg.senderRole === "SYSTEM";
                          return (
                            <div
                              key={msg.id}
                              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-2xs ${
                                isMe
                                  ? "ml-auto bg-espresso text-white"
                                  : isSystem
                                    ? "mx-auto bg-cream-container/90 text-coffee-muted text-[10px] text-center border border-cream-border"
                                    : "mr-auto bg-white text-espresso border border-cream-border"
                              }`}
                            >
                              <p className="text-[10px] font-bold opacity-80 mb-0.5">
                                {isMe ? "Tú (Cliente)" : msg.senderName}
                              </p>
                              <p className="leading-snug">{msg.text}</p>
                              <span className="block text-[9px] text-right opacity-70 mt-0.5">
                                {msg.timestamp}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mensajes rápidos para contactar al repartidor */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {[
                          "¡Hola! Te espero en la entrada principal.",
                          "Por favor toca el timbre 3B al llegar.",
                          "¡Gracias! Ya tengo listo mi PIN 4821.",
                        ].map((quickMsg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isSendingChat}
                            onClick={() =>
                              void handleQuickCustomerMessage(quickMsg)
                            }
                            className="shrink-0 rounded-full bg-cream-container hover:bg-cream-border/50 border border-cream-border px-2.5 py-1 text-[10px] font-semibold text-espresso cursor-pointer"
                          >
                            {quickMsg}
                          </button>
                        ))}
                      </div>

                      {/* Input de mensaje directo al repartidor */}
                      <form
                        onSubmit={(e) => void handleSendCustomerMessage(e)}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={customerChatInput}
                          onChange={(e) => setCustomerChatInput(e.target.value)}
                          placeholder={
                            activeOrder.courier
                              ? `Escribe un mensaje a ${activeOrder.courier.name}...`
                              : "Escribe indicaciones para el repartidor..."
                          }
                          className="flex-1 rounded-full border border-cream-border bg-cream-soft/40 px-3.5 py-2 text-xs text-espresso placeholder-coffee-muted/50 focus:outline-none focus:border-caramel"
                        />
                        <button
                          type="submit"
                          disabled={isSendingChat || !customerChatInput.trim()}
                          className="rounded-full bg-espresso text-white px-4 py-2 text-xs font-bold hover:bg-espresso-light disabled:opacity-50 transition cursor-pointer flex items-center gap-1"
                        >
                          <Send className="h-3 w-3 text-caramel" />
                          <span>Enviar</span>
                        </button>
                      </form>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProposalStatus("pending");
                    setActiveOrder(null);
                  }}
                  className="text-xs text-roasted underline font-bold hover:text-espresso block mx-auto cursor-pointer pt-1"
                >
                  Hacer otro pedido / Reiniciar simulación
                </button>
              </div>
            )}

            {proposalStatus === "rejected" && (
              <div className="rounded-2xl bg-cream-soft border border-cream-border p-3.5 text-center space-y-1.5 animate-fadeIn">
                <p className="text-sm font-bold text-espresso">
                  Propuesta cancelada
                </p>
                <p className="text-sm text-coffee-muted">
                  No se generó ningún cargo financiero ($0 MXN). Puedes elegir
                  otro restaurante y platillo.
                </p>
                <div className="flex justify-center gap-3 pt-1 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRestaurantId(null);
                      setActiveTab("inicio");
                    }}
                    className="font-bold text-espresso underline cursor-pointer"
                  >
                    Explorar Restaurantes y Menús →
                  </button>
                </div>
              </div>
            )}

            {/* Recordatorio de Regla de Expiración */}
            <p className="text-center text-[12px] text-coffee-muted flex items-center justify-center gap-1 pt-1">
              <Info className="h-3 w-3 text-caramel flex-shrink-0" />
              <span>
                Si no confirmas antes de las 11:30 AM, expira a $0 MXN sin
                cargos automáticos.
              </span>
            </p>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: MI PLAN SEMANAL (RESTAURANTES Y COMIDAS POR DÍA)
           ========================================================================= */}
        {activeTab === "modalidad" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            <div className="text-center">
              <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                Planificador de Alimentación
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Tu Calendario Semanal de Comidas
              </h2>
              <p className="text-sm text-coffee-muted mt-0.5">
                Elige qué restaurante y qué comida recibir cada día de la semana
              </p>
            </div>

            {/* Selector de Días de la Semana con Touch Ergonomics */}
            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-cream-container/80 border border-cream-border text-center">
              {weeklyPlan.map((item) => (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => {
                    setSelectedPlanDay(item.day);
                    setEditingDayPlan(null);
                  }}
                  className={`py-2 px-1 rounded-xl text-sm font-bold transition cursor-pointer flex flex-col items-center active:scale-95 ${
                    selectedPlanDay === item.day
                      ? "bg-espresso text-white shadow-2xs"
                      : "text-roasted hover:text-espresso hover:bg-cream/70"
                  }`}
                >
                  <span className="text-[12px] font-normal opacity-80">
                    {item.day}
                  </span>
                  <span className="text-sm font-bold">
                    {(() => {
                      const r = restaurants.find(
                        (rest) => rest.id === item.restaurantId,
                      );
                      const d = r?.menu.find((dish) => dish.id === item.dishId);
                      return d ? `${d.calories}` : "500";
                    })()}
                  </span>
                </button>
              ))}
            </div>

            {/* Ficha del Día Seleccionado */}
            {(() => {
              const currentDayPlan =
                weeklyPlan.find((d) => d.day === selectedPlanDay) ||
                weeklyPlan[0];
              const planRestaurant =
                restaurants.find((r) => r.id === currentDayPlan.restaurantId) ||
                restaurants[0];
              const planDish =
                planRestaurant.menu.find(
                  (d) => d.id === currentDayPlan.dishId,
                ) || planRestaurant.menu[0];

              return (
                <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center border-b border-cream-border pb-2">
                    <div>
                      <span className="text-[12px] font-bold uppercase text-caramel">
                        {currentDayPlan.fullDay}
                      </span>
                      <h3 className="text-sm font-extrabold text-espresso">
                        {planDish.name}
                      </h3>
                    </div>
                    <span className="text-[12px] font-bold text-espresso bg-cream-container border border-cream-border px-2.5 py-0.5 rounded-full">
                      {formatCurrencyMXN(planDish.price)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center text-coffee-muted">
                      <span>Restaurante elegido:</span>
                      <span className="font-bold text-espresso">
                        {planRestaurant.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-coffee-muted">
                      <span>Especialidad:</span>
                      <span className="font-medium text-roasted">
                        {planRestaurant.specialty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-coffee-muted">
                      <span>Calorías & Proteína:</span>
                      <span className="font-bold text-caramel">
                        {planDish.calories} kcal • {planDish.protein}g proteína
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-coffee-muted">
                      <span>Estado en tu plan:</span>
                      <span className="font-bold text-caramel">
                        {currentDayPlan.status}
                      </span>
                    </div>
                  </div>

                  {/* Selector interactivo para cambiar restaurante y comida de este día */}
                  {editingDayPlan === currentDayPlan.day ? (
                    <div className="pt-2 border-t border-cream-border space-y-2.5 animate-fadeIn">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                        Selecciona Restaurante para el {currentDayPlan.fullDay}:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {restaurants.map((rest) => (
                          <button
                            key={rest.id}
                            type="button"
                            onClick={() => {
                              const firstMain =
                                rest.menu.find((d) => !d.isBeverage) ||
                                rest.menu[0];
                              setWeeklyPlan((prev) =>
                                prev.map((item) =>
                                  item.day === currentDayPlan.day
                                    ? {
                                        ...item,
                                        restaurantId: rest.id,
                                        dishId: firstMain.id,
                                      }
                                    : item,
                                ),
                              );
                            }}
                            className={`p-2 rounded-xl border text-left text-[12px] font-semibold transition active:scale-95 ${
                              currentDayPlan.restaurantId === rest.id
                                ? "bg-espresso text-white border-espresso shadow-xs"
                                : "bg-cream-container/50 text-espresso border-cream-border"
                            }`}
                          >
                            <span className="block font-bold truncate">
                              {rest.name}
                            </span>
                            <span className="text-[12px] opacity-80">
                              {rest.specialty}
                            </span>
                          </button>
                        ))}
                      </div>

                      <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block pt-1">
                        Selecciona Comida de {planRestaurant.name.split(" ")[0]}
                        :
                      </span>
                      <div className="space-y-1">
                        {planRestaurant.menu
                          .filter((d) => !d.isBeverage)
                          .map((dish) => (
                            <button
                              key={dish.id}
                              type="button"
                              onClick={() => {
                                setWeeklyPlan((prev) =>
                                  prev.map((item) =>
                                    item.day === currentDayPlan.day
                                      ? { ...item, dishId: dish.id }
                                      : item,
                                  ),
                                );
                                setEditingDayPlan(null);
                                showToast(
                                  `Guardado: ${dish.name} para el ${currentDayPlan.fullDay}.`,
                                );
                              }}
                              className={`w-full py-2 px-2.5 rounded-xl border text-left text-sm flex justify-between items-center transition active:scale-98 ${
                                currentDayPlan.dishId === dish.id
                                  ? "bg-cream-container text-espresso font-bold border-caramel"
                                  : "bg-white text-coffee-muted border-cream-border hover:bg-cream-soft"
                              }`}
                            >
                              <span className="truncate max-w-[210px]">
                                • {dish.name}
                              </span>
                              <span className="text-[12px] font-bold flex-shrink-0">
                                {formatCurrencyMXN(dish.price)}
                              </span>
                            </button>
                          ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingDayPlan(null)}
                        className="w-full py-2 rounded-full border border-cream-border text-[12px] font-semibold text-coffee-muted hover:bg-cream-container transition"
                      >
                        Cerrar Selector
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-cream-border/70 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingDayPlan(currentDayPlan.day)}
                        className="w-full py-2.5 rounded-full border border-cream-border text-sm font-bold text-espresso hover:bg-cream-container active:scale-95 transition cursor-pointer"
                      >
                        Cambiar Restaurante o Platillo de este Día
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Switch de Modalidad Recurrente */}
            <div className="rounded-2xl border border-cream-border bg-cream-container/40 p-3.5 space-y-2.5">
              <div className="text-center">
                <span className="text-[12px] font-bold uppercase text-roasted block">
                  Modalidad de Programación
                </span>
                <p className="text-sm font-bold text-espresso">
                  ¿Cómo prefieres que se calculen tus comidas?
                </p>
              </div>

              <div className="grid grid-cols-2 p-1 rounded-full bg-white border border-cream-border shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPlanningMode("recommendation")}
                  className={`py-2 text-sm font-bold rounded-full text-center transition-all cursor-pointer ${
                    planningMode === "recommendation"
                      ? "bg-espresso text-white shadow-xs"
                      : "text-roasted hover:text-espresso"
                  }`}
                >
                  Recomendación Inteligente
                </button>
                <button
                  type="button"
                  onClick={() => setPlanningMode("fixed")}
                  className={`py-2 text-sm font-bold rounded-full text-center transition-all cursor-pointer ${
                    planningMode === "fixed"
                      ? "bg-espresso text-white shadow-xs"
                      : "text-roasted hover:text-espresso"
                  }`}
                >
                  Selección Fija
                </button>
              </div>

              <p className="text-[12px] sm:text-sm text-coffee-muted leading-relaxed text-center">
                {planningMode === "recommendation"
                  ? "El motor determinista rota menús de restaurantes verificados cumpliendo tus metas nutricionales y exclusión de alérgenos."
                  : "Tú defines exactamente los restaurantes y platillos para cada día de la semana. Coconea cotiza la ocurrencia para tu confirmación diaria."}
              </p>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: GARANTÍA & ALÉRGENOS (SALUD Y ÉTICA ALIMENTICIA)
           ========================================================================= */}
        {activeTab === "garantia" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            <div className="text-center">
              <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                Salud & Transparencia
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Garantía Ética: «Programar no es comprar»
              </h2>
              <p className="text-sm text-coffee-muted mt-0.5">
                Cero cobros automáticos, trazabilidad higiénica y rigor con tus
                alérgenos
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="rounded-2xl border border-cream-border bg-white p-3 flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-caramel font-bold">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-sm">
                    1. Rigor Médico con Alérgenos
                  </h3>
                  <p className="text-sm text-coffee-muted leading-snug mt-0.5">
                    Si un restaurante aliado carece de lista completa de
                    ingredientes verificados, el sistema NUNCA asume que el
                    platillo es seguro para ti.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-3 flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-roasted font-bold">
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-sm">
                    2. Un Solo Restaurante por Pedido
                  </h3>
                  <p className="text-sm text-coffee-muted leading-snug mt-0.5">
                    Cada orden se elabora y despacha desde una sola cocina
                    aliada para garantizar la cadena de temperatura y evitar
                    contaminación cruzada.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-3 flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-espresso font-bold">
                  <CheckCircle2 className="h-4 w-4 text-caramel" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-sm">
                    3. Confirmación Explícita Obligatoria
                  </h3>
                  <p className="text-sm text-coffee-muted leading-snug mt-0.5">
                    Solo cuando tú presionas confirmar se inicia el pedido con
                    la cocina. Si rechazas o no confirmas antes de las 11:30 AM,
                    el costo es estrictamente $0 MXN.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-soft border border-cream-border p-3 text-center text-sm text-coffee-muted">
              🌱 <strong>Empaques Compostables:</strong> Todos los pedidos
              viajan en recipientes de bagazo de caña o papel kraft sellado
              térmicamente.
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 5: PERFIL & RESTRICCIONES NUTRICIONALES
           ========================================================================= */}
        {activeTab === "cuenta" && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            <div className="text-center">
              <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                Perfil de Comensal
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                {isAuthenticated && user
                  ? "Tu Perfil Nutricional"
                  : "Acceso a tu Cuenta"}
              </h2>
            </div>

            {isAuthenticated && user ? (
              <div className="space-y-3">
                {/* Componente de Preferencias de Dieta y Frecuencia integrado */}
                <DietPreferencesSettings
                  currentDiet="balanced"
                  currentMealsCount={3}
                  onSave={(diet, mealsCount) => {
                    console.log("Dieta guardada:", diet);
                    console.log("Comidas al día:", mealsCount);
                    showToast("¡Preferencias y frecuencia actualizadas!");
                  }}
                />

                {/* Datos del Comensal */}
                <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3.5 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-espresso text-cream text-base font-bold shadow-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-base font-bold text-espresso truncate">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-coffee-muted truncate">
                        {user.email}
                      </p>
                      <p className="text-sm text-coffee-muted truncate">
                        Dirección: Roma Norte, CDMX
                      </p>
                    </div>
                  </div>

                  {/* Restricciones Activas */}
                  <div className="pt-2 border-t border-cream-border/70 space-y-1">
                    <span className="text-[12px] font-bold uppercase text-caramel block">
                      Preferencia y Alérgenos Activos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-white font-bold text-caramel px-2.5 py-0.5 rounded-full border border-cream-border text-[12px]">
                        Plan {user.dietaryPreferences?.[0] || "Equilibrado"}
                      </span>
                      <span className="bg-white text-roasted px-2.5 py-0.5 rounded-full border border-cream-border text-[12px] font-semibold">
                        Sin Gluten
                      </span>
                      <span className="bg-white text-roasted px-2.5 py-0.5 rounded-full border border-cream-border text-[12px] font-semibold">
                        Sin Lácteos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Historial de Comidas */}
                <div className="rounded-2xl border border-cream-border bg-white p-3 space-y-2 text-sm">
                  <span className="font-extrabold text-espresso text-sm block">
                    Comidas Recientes Confirmadas:
                  </span>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-cream-container/30">
                      <div>
                        <p className="font-bold text-espresso">
                          Bowl Rústico de Quinoa
                        </p>
                        <p className="text-[12px] text-coffee-muted">
                          Ayer • Bistró Raíces
                        </p>
                      </div>
                      <span className="text-emerald-700 font-bold text-[12px]">
                        Entregado ✓
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-cream-container/30">
                      <div>
                        <p className="font-bold text-espresso">
                          Pechuga al Romero
                        </p>
                        <p className="text-[12px] text-coffee-muted">
                          Hace 3 días • Cocina Botánica
                        </p>
                      </div>
                      <span className="text-emerald-700 font-bold text-[12px]">
                        Entregado ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones de Perfil */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRestaurantId(null);
                      setActiveTab("inicio");
                    }}
                    className="w-full text-center rounded-full bg-espresso py-3 text-sm font-bold text-white shadow-xs hover:bg-espresso-light active:scale-95 transition cursor-pointer"
                  >
                    Volver a Explorar Restaurantes
                  </button>
                  <button
                    id="btn-profile-logout"
                    type="button"
                    onClick={async () => {
                      const result = await logout();
                      if (!result.success)
                        showToast(result.error || "No se pudo cerrar sesión.");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/80 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 active:scale-95 transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-center">
                <div className="p-3.5 rounded-2xl bg-cream-container/60 border border-cream-border text-sm text-coffee-muted space-y-1">
                  <p className="font-bold text-espresso text-base">
                    ¿Deseas personalizar tu alimentación?
                  </p>
                  <p className="text-sm">
                    Inicia sesión para gestionar tus alérgenos, confirmar
                    pedidos y programar tu semana.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full rounded-full bg-espresso py-3 text-sm font-bold text-white shadow-xs hover:bg-espresso-light active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="w-full rounded-full border border-cream-border bg-white py-3 text-sm font-bold text-espresso hover:bg-cream-container active:scale-95 transition"
                  >
                    Crear tu Cuenta
                  </Link>
                </div>

                {/* Acceso Rápido con Cuenta Demo */}
                <div className="pt-2 border-t border-cream-border">
                  <p className="text-[12px] text-coffee-muted mb-1.5 font-medium">
                    O prueba al instante con una cuenta demo:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const demo = DEMO_ACCOUNTS.standard;
                      login(demo.email, demo.password || "Coconea2026!");
                    }}
                    className="text-sm font-bold text-caramel hover:text-espresso underline cursor-pointer p-1"
                  >
                    Entrar como Sofía Méndez (Demo Estándar) →
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* =========================================================================
          MODAL INTERACTIVO DE DETALLE NUTRICIONAL DE PLATILLO (BOTTOM-SHEET MÓVIL)
         ========================================================================= */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-espresso/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-cream-border/90 bg-white p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto overscroll-contain">
            <figure className="overflow-hidden rounded-2xl border border-cream-border bg-cream-soft">
              <img
                src={selectedDishModal.image}
                alt={selectedDishModal.imageAlt}
                width={640}
                height={360}
                className="h-40 w-full object-contain"
              />
              <figcaption className="px-3 pb-2 text-xs text-coffee-muted">
                Imagen ilustrativa; la presentación puede variar.
              </figcaption>
            </figure>
            {/* Indicador visual de arrastre / sheet */}
            <div className="w-10 h-1 bg-cream-border rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[12px] font-bold uppercase tracking-wider text-caramel block">
                  {(() => {
                    const r = restaurants.find(
                      (rest) => rest.id === selectedDishModal.restaurantId,
                    );
                    return r?.name || "Restaurante Aliado";
                  })()}
                </span>
                <h3 className="text-base sm:text-base font-extrabold text-espresso leading-snug">
                  {selectedDishModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDishModal(null)}
                className="p-1.5 rounded-full text-coffee-muted hover:text-espresso hover:bg-cream-container transition cursor-pointer flex-shrink-0"
                aria-label="Cerrar ventana de platillo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm sm:text-sm text-coffee-muted leading-relaxed">
              {selectedDishModal.description}
            </p>

            {/* Ficha Nutricional en Chips */}
            <div className="grid grid-cols-4 gap-1 p-2 rounded-2xl bg-cream-container/60 border border-cream-border text-center text-[12px]">
              <div>
                <span className="block font-bold text-caramel">
                  {selectedDishModal.calories ?? "—"}
                </span>
                <span className="text-coffee-muted text-[8px] uppercase">
                  kcal
                </span>
              </div>
              <div>
                <span className="block font-bold text-espresso">
                  {selectedDishModal.protein != null
                    ? selectedDishModal.protein + "g"
                    : "—"}
                </span>
                <span className="text-coffee-muted text-[8px] uppercase">
                  Prot
                </span>
              </div>
              <div>
                <span className="block font-bold text-espresso">
                  {selectedDishModal.carbs != null
                    ? selectedDishModal.carbs + "g"
                    : "—"}
                </span>
                <span className="text-coffee-muted text-[8px] uppercase">
                  Carbs
                </span>
              </div>
              <div>
                <span className="block font-bold text-espresso">
                  {selectedDishModal.fats != null
                    ? selectedDishModal.fats + "g"
                    : "—"}
                </span>
                <span className="text-coffee-muted text-[8px] uppercase">
                  Grasas
                </span>
              </div>
            </div>

            {/* Lista de Ingredientes 100% Declarados */}
            <div className="space-y-1 text-sm">
              <span className="font-extrabold text-espresso text-sm block">
                Ingredientes 100% Declarados:
              </span>
              <ul className="space-y-0.5 text-sm text-coffee-muted">
                {selectedDishModal.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-start gap-1.5 leading-snug"
                  >
                    <span className="text-caramel font-bold">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Alérgenos */}
            <div className="space-y-1 text-sm">
              <span className="font-extrabold text-espresso text-sm block">
                Información de alérgenos:
              </span>
              <div className="flex flex-wrap gap-1 text-[12px] font-bold text-coffee-muted">
                {selectedDishModal.allergens.map((alg) => (
                  <span
                    key={alg}
                    className="bg-cream-container px-2 py-0.5 rounded-full border border-cream-border"
                  >
                    ✓ {alg}
                  </span>
                ))}
              </div>
            </div>

            {/* Botón de Selección Móvil Full-Width */}
            <div className="pt-2 border-t border-cream-border space-y-2">
              <button
                type="button"
                onClick={() => {
                  const targetRestaurant = restaurants.find(
                    (r) => r.id === selectedDishModal.restaurantId,
                  );
                  if (targetRestaurant) {
                    handleSelectDishForProposal(
                      targetRestaurant,
                      selectedDishModal,
                    );
                  }
                  setSelectedDishModal(null);
                }}
                className="w-full py-3 rounded-full bg-espresso text-white text-sm font-bold shadow-xs hover:bg-espresso-light active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {selectedDishModal.isBeverage
                    ? "Añadir esta Bebida"
                    : "Elegir para mi Comida"}
                </span>
                <span className="text-[12px] opacity-80">
                  ({formatCurrencyMXN(selectedDishModal.price)})
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDishModal(null)}
                className="w-full py-2.5 rounded-full border border-cream-border text-sm font-semibold text-roasted hover:bg-cream-container active:scale-95 transition cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE CONFIRMACIÓN DE CAMBIO DE RESTAURANTE (REGLA 8: 1 RESTAURANTE/ORDEN)
         ========================================================================= */}
      {restaurantSwitchPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-espresso/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-cream-border bg-white p-4 sm:p-5 shadow-2xl space-y-3.5">
            {/* Indicador visual de arrastre */}
            <div className="w-10 h-1 bg-cream-border rounded-full mx-auto -mt-1 mb-1.5" />

            <div className="flex items-center gap-2.5 text-caramel">
              <div className="p-2 rounded-2xl bg-cream-container border border-cream-border flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-caramel" />
              </div>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-coffee-muted">
                  Regla de Inocuidad Coconea
                </span>
                <h3 className="text-base font-extrabold text-espresso">
                  ¿Cambiar de restaurante aliado?
                </h3>
              </div>
            </div>

            <p className="text-sm text-coffee-muted leading-relaxed">
              Tu propuesta actual contiene platillos de{" "}
              <strong>{currentProposalRestaurant.name}</strong>.
            </p>
            <p className="text-sm text-coffee-muted leading-relaxed bg-cream-container/50 p-2.5 rounded-2xl border border-cream-border">
              💡 <strong>Regla #8:</strong> Cada pedido se prepara y transporta
              desde una sola cocina para garantizar la cadena de temperatura y
              trazabilidad estricta de alérgenos.
            </p>
            <p className="text-sm text-espresso font-semibold">
              ¿Deseas reemplazar tu selección actual por{" "}
              <strong>{restaurantSwitchPending.targetDish.name}</strong> de{" "}
              <strong>{restaurantSwitchPending.targetRestaurant.name}</strong>?
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmRestaurantSwitch}
                className="w-full py-3 rounded-full bg-espresso text-white text-sm font-bold shadow-xs hover:bg-espresso-light active:scale-95 transition cursor-pointer"
              >
                Sí, cambiar a{" "}
                {restaurantSwitchPending.targetRestaurant.name.split(" ")[0]}
              </button>
              <button
                type="button"
                onClick={() => setRestaurantSwitchPending(null)}
                className="w-full py-2.5 rounded-full border border-cream-border text-sm font-semibold text-roasted hover:bg-cream-container active:scale-95 transition cursor-pointer"
              >
                Mantener {currentProposalRestaurant.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pie de página discreto */}
      <footer className="w-full max-w-md mx-auto text-center text-sm text-coffee-muted mt-5 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-cream-border/70 shadow-2xs text-[12px]">
          © 2026 {PROJECT_NAME} — Planifica tu alimentación, confirma y recibe.
        </p>
      </footer>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN MÓVIL INFERIOR FLOTANTE (BOTTOM TAB BAR NATIVO)
          5 Pestañas Gastronómicas con Touch Targets Ergonómicos
         ========================================================================= */}
      <nav
        aria-label="Navegación inferior móvil"
        className="customer-bottom-nav fixed bottom-0 inset-x-0 mx-auto max-w-lg px-3 z-40 select-none"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-1 py-2 shadow-lg grid grid-cols-5">
          {/* Tab 1: Restaurantes */}
          <button
            type="button"
            onClick={() => setActiveTab("inicio")}
            className={`flex flex-col items-center gap-0.5 text-[11px] min-h-12 py-1 px-1 rounded-full transition cursor-pointer active:scale-90 ${
              activeTab === "inicio"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <Store
              className={`h-4 w-4 ${activeTab === "inicio" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Explorar</span>
          </button>

          {/* Tab 2: Propuesta */}
          <button
            type="button"
            onClick={() => setActiveTab("propuesta")}
            className={`relative flex flex-col items-center gap-0.5 text-[11px] min-h-12 py-1 px-1 rounded-full transition cursor-pointer active:scale-90 ${
              activeTab === "propuesta"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <Calendar
              className={`h-4 w-4 ${activeTab === "propuesta" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Propuesta</span>
            {proposalStatus === "pending" && (
              <span className="absolute top-1 right-2.5 h-1.5 w-1.5 rounded-full bg-caramel ring-2 ring-white" />
            )}
          </button>

          {/* Tab 3: Mi Plan */}
          <button
            type="button"
            onClick={() => setActiveTab("modalidad")}
            className={`flex flex-col items-center gap-0.5 text-[11px] min-h-12 py-1 px-1 rounded-full transition cursor-pointer active:scale-90 ${
              activeTab === "modalidad"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <ChefHat
              className={`h-4 w-4 ${activeTab === "modalidad" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Mi Plan</span>
          </button>

          {/* Tab 4: Garantía */}
          <button
            type="button"
            onClick={() => setActiveTab("garantia")}
            className={`flex flex-col items-center gap-0.5 text-[11px] min-h-12 py-1 px-1 rounded-full transition cursor-pointer active:scale-90 ${
              activeTab === "garantia"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <ShieldCheck
              className={`h-4 w-4 ${activeTab === "garantia" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>Garantía</span>
          </button>

          {/* Tab 5: Perfil */}
          <button
            type="button"
            onClick={() => setActiveTab("cuenta")}
            className={`flex flex-col items-center gap-0.5 text-[11px] min-h-12 py-1 px-1 rounded-full transition cursor-pointer active:scale-90 ${
              activeTab === "cuenta"
                ? "font-bold text-espresso bg-cream-container shadow-2xs"
                : "font-medium text-coffee-muted hover:text-espresso"
            }`}
          >
            <UserIcon
              className={`h-4 w-4 ${activeTab === "cuenta" ? "text-caramel" : "text-coffee-muted"}`}
            />
            <span>{isAuthenticated ? "Perfil" : "Entrar"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
