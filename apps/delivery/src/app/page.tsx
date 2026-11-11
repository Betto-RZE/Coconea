'use client';

import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  CheckCircle2,
  ShieldCheck,
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
} from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

type DeliveryTab = 'ruta' | 'pedidos' | 'chat' | 'historial' | 'ganancias' | 'perfil';

const TAB_LABELS: Record<DeliveryTab, string> = {
  ruta: 'Ruta Activa',
  pedidos: 'Disponibles',
  chat: 'Chat',
  historial: 'Historial',
  ganancias: 'Ganancias',
  perfil: 'Repartidor',
};

interface DeliveryOrder {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  distance: string;
  paymentMethod: 'Efectivo' | 'Tarjeta';
  earnings: number;
  itemsSummary: string;
}

const INITIAL_AVAILABLE_ORDERS: DeliveryOrder[] = [
  {
    id: 'ORD-2026-082',
    restaurantName: 'Bistró Raíces & Grano',
    restaurantAddress: 'Av. Álvaro Obregón 160',
    customerName: 'Carlos Ruiz',
    customerAddress: 'Jalapa 89, Roma Norte',
    distance: '1.4 km',
    paymentMethod: 'Tarjeta',
    earnings: 45.0,
    itemsSummary: 'Bowl de Salmón + Ensalada Verde',
  },
  {
    id: 'ORD-2026-083',
    restaurantName: 'Cocina Botánica',
    restaurantAddress: 'Colima 120, Roma Norte',
    customerName: 'Mariana Garza',
    customerAddress: 'Durango 205, Roma Norte',
    distance: '2.2 km',
    paymentMethod: 'Efectivo',
    earnings: 55.0,
    itemsSummary: 'Pechuga al Romero + Té Helado',
  },
];

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>('ruta');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estado de pedidos disponibles y en ruta
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>(INITIAL_AVAILABLE_ORDERS);
  const [currentDelivery, setCurrentDelivery] = useState<DeliveryOrder>({
    id: 'ORD-2026-081',
    restaurantName: 'Bistró Raíces & Grano',
    restaurantAddress: 'Av. Álvaro Obregón 160',
    customerName: 'Sofía Méndez',
    customerAddress: 'Calle Durango 154, Int 3B, Roma Norte',
    distance: '1.8 km',
    paymentMethod: 'Tarjeta',
    earnings: 48.50,
    itemsSummary: 'Bowl Rústico de Quinoa + Agua de Horchata',
  });

  // Validación de PIN
  const [pin, setPin] = useState('');
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Estados de Chat
  const [chatTarget, setChatTarget] = useState<'usuario' | 'restaurante'>('usuario');
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Soporte Coconea', text: 'Bienvenido al turno. Tienes activa la orden #ORD-2026-081.', time: '12:00' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Estados del Perfil editables
  const [profileName, setProfileName] = useState('Rodrigo Herrera');
  const [profilePhone, setProfilePhone] = useState('+52 55 4321 5678');
  const [profileVehicle, setProfileVehicle] = useState('Bicicleta Eléctrica');
  const [profilePlates, setProfilePlates] = useState('MX-928-REV');
  const [acceptCash, setAcceptCash] = useState(true);

  // Historial y Ganancias
  const [completedOrders, setCompletedOrders] = useState([
    { id: '#ORD-2026-079', route: 'Bistró Raíces → Col. Condesa', distance: '2.4 km', time: '12:45 hrs', payout: 45.0, method: 'Tarjeta' },
    { id: '#ORD-2026-080', route: 'Green Bowl → Roma Sur', distance: '1.6 km', time: '13:10 hrs', payout: 40.0, method: 'Efectivo' },
  ]);

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '4821') {
      setDeliveryConfirmed(true);
      setPinError(false);
      // Agregar al historial al confirmar
      setCompletedOrders(prev => [
        {
          id: currentDelivery.id,
          route: `${currentDelivery.restaurantName} → ${currentDelivery.customerName}`,
          distance: currentDelivery.distance,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hrs',
          payout: currentDelivery.earnings,
          method: currentDelivery.paymentMethod,
        },
        ...prev,
      ]);
    } else {
      setPinError(true);
    }
  };

  const handleAcceptOrder = (order: DeliveryOrder) => {
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setCurrentDelivery(order);
    setDeliveryConfirmed(false);
    setActiveTab('ruta');
  };

  const handleRejectOrder = (orderId: string) => {
    setAvailableOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      sender: 'Tú (Repartidor)',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  // Cálculo de ganancias por tipo de pago
  const totalCardEarnings = completedOrders
    .filter(o => o.method === 'Tarjeta')
    .reduce((acc, o) => acc + o.payout, (currentDelivery && deliveryConfirmed ? currentDelivery.earnings : 0));

  const totalCashEarnings = completedOrders
    .filter(o => o.method === 'Efectivo')
    .reduce((acc, o) => acc + o.payout, 0);

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
                setActiveTab('ruta');
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
                  Ruta y Entregas en Tiempo Real
                </span>
              </div>
            </button>

            {/* Badge de turno y botón menú */}
            <div className="flex items-center gap-2">
              <span className="hidden xs:inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-espresso">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>En Ruta</span>
              </span>

              <button
                id="btn-delivery-menu"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  menuOpen
                    ? 'bg-espresso text-white border-espresso shadow-xs'
                    : 'bg-cream-container text-espresso border-cream-border hover:bg-cream-container/80'
                }`}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                <span className="text-[10px] text-coffee-muted">{profileName}</span>
              </div>

              <nav className="space-y-1">
                {(['ruta', 'pedidos', 'chat', 'historial', 'ganancias', 'perfil'] as DeliveryTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === tab
                        ? 'bg-espresso text-white shadow-xs'
                        : 'text-coffee hover:bg-cream-container hover:text-espresso'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-xl border ${
                          activeTab === tab
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-cream-container text-caramel border-cream-border'
                        }`}
                      >
                        {tab === 'ruta' && <Bike className="h-4 w-4" />}
                        {tab === 'pedidos' && <Store className="h-4 w-4" />}
                        {tab === 'chat' && <MessageSquare className="h-4 w-4" />}
                        {tab === 'historial' && <CheckCircle2 className="h-4 w-4" />}
                        {tab === 'ganancias' && <DollarSign className="h-4 w-4" />}
                        {tab === 'perfil' && <User className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === 'ruta' && 'Entrega Activa en Curso'}
                        {tab === 'pedidos' && 'Pedidos Listos (Aceptar/Rechazar)'}
                        {tab === 'chat' && 'Chat de Coordinación'}
                        {tab === 'historial' && 'Historial de Entregas'}
                        {tab === 'ganancias' && 'Ganancias y Pagos'}
                        {tab === 'perfil' && 'Modificar Mi Perfil'}
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
            VENTANA 1: RUTA ACTIVA
           ========================================================================= */}
        {activeTab === 'ruta' && (
          <div className="space-y-4 animate-fadeIn">
            {currentDelivery ? (
              <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-cream-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                      ENTREGA EN CURSO
                    </span>
                    <h2 className="text-sm font-extrabold text-espresso">
                      Orden {currentDelivery.id}
                    </h2>
                  </div>
                  <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-caramel">
                    {currentDelivery.distance} restante
                  </span>
                </div>

                {/* Puntos de Ruta */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-espresso">Recolección: {currentDelivery.restaurantName}</p>
                      <p className="text-[11px] text-coffee-muted">{currentDelivery.restaurantAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-cream-container text-caramel border border-cream-border mt-0.5">
                      <Navigation className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-espresso">Destino: {currentDelivery.customerName}</p>
                      <p className="text-[11px] text-coffee-muted">{currentDelivery.customerAddress}</p>
                      <p className="text-[10px] text-roasted font-medium mt-0.5">Contenido: {currentDelivery.itemsSummary}</p>
                    </div>
                  </div>
                </div>

                {/* Indicador de Pago */}
                <div className="flex items-center justify-between rounded-2xl bg-cream-container/50 border border-cream-border p-3 text-xs">
                  <span className="text-coffee-muted font-medium flex items-center gap-1.5">
                    {currentDelivery.paymentMethod === 'Tarjeta' ? <CreditCard className="h-4 w-4 text-caramel" /> : <Banknote className="h-4 w-4 text-emerald-700" />}
                    Método de Pago: <strong>{currentDelivery.paymentMethod}</strong>
                  </span>
                  <span className="font-bold text-espresso">{formatCurrencyMXN(currentDelivery.earnings)} ganancia</span>
                </div>

                {/* Acceso rápido a chat */}
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="w-full rounded-full border border-cream-border bg-white py-2.5 text-xs font-bold text-espresso hover:bg-cream-container transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-caramel" />
                  <span>Abrir Chat con Cliente o Restaurante</span>
                </button>

                {/* Confirmación con PIN */}
                {!deliveryConfirmed ? (
                  <form onSubmit={handleConfirmPin} className="pt-2 border-t border-cream-border space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="pin-input" className="font-bold text-espresso">
                        PIN de Entrega del Consumidor:
                      </label>
                      <span className="text-[10px] text-coffee-muted">Demo: 4821</span>
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
                        Validar PIN
                      </button>
                    </div>

                    {pinError && (
                      <div className="rounded-2xl bg-red-50 border border-red-200 p-2.5 text-[11px] text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                        <span>PIN incorrecto. Solicita al cliente su código de 4 dígitos.</span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>¡Entrega Confirmada Exitosamente!</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      PIN validado. La orden {currentDelivery.id} ha quedado completada.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDelivery(null as any);
                        setDeliveryConfirmed(false);
                        setPin('');
                      }}
                      className="text-[11px] text-emerald-800 underline font-semibold hover:text-emerald-950 block mx-auto cursor-pointer pt-1"
                    >
                      Buscar nuevo pedido disponible
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-8 text-center space-y-3 animate-fadeIn">
                <Bike className="h-10 w-10 text-caramel mx-auto" />
                <h2 className="text-base font-extrabold text-espresso">No tienes ninguna ruta activa</h2>
                <p className="text-xs text-coffee-muted">Revisa la sección de pedidos listos para aceptar una nueva entrega.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('pedidos')}
                  className="rounded-full bg-espresso text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:bg-espresso/95 transition cursor-pointer"
                >
                  Ver Pedidos Disponibles
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: PEDIDOS LISTOS (ACEPTAR / RECHAZAR)
           ========================================================================= */}
        {activeTab === 'pedidos' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">Bolsa de Trabajo</span>
                <h2 className="text-base font-extrabold text-espresso">Pedidos Listos para Repartir</h2>
              </div>
              <span className="text-xs font-bold bg-cream-container border border-cream-border px-2.5 py-1 rounded-full text-espresso">
                {availableOrders.length} disponibles
              </span>
            </div>

            {availableOrders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-espresso text-sm">¡Estás al día!</p>
                <p className="text-xs text-coffee-muted">No hay más pedidos pendientes en tu zona en este momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableOrders.map((ord) => (
                  <div key={ord.id} className="rounded-2xl border border-cream-border bg-cream-container/30 p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-espresso text-sm">{ord.id}</span>
                      <span className="font-bold text-caramel bg-white px-2.5 py-0.5 rounded-full border border-cream-border">
                        {formatCurrencyMXN(ord.earnings)}
                      </span>
                    </div>

                    <div className="space-y-1 text-coffee-muted">
                      <p><strong className="text-espresso">Restaurante:</strong> {ord.restaurantName} ({ord.restaurantAddress})</p>
                      <p><strong className="text-espresso">Cliente:</strong> {ord.customerName} - {ord.customerAddress}</p>
                      <p><strong className="text-espresso">Distancia estimada:</strong> {ord.distance}</p>
                      <p><strong className="text-espresso">Pago:</strong> <span className={ord.paymentMethod === 'Efectivo' ? 'text-emerald-700 font-bold' : 'text-caramel font-bold'}>{ord.paymentMethod}</span></p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-cream-border">
                      <button
                        type="button"
                        onClick={() => handleAcceptOrder(ord)}
                        className="flex-1 rounded-full bg-espresso py-2.5 font-bold text-white hover:bg-espresso-light active:scale-95 transition cursor-pointer text-center"
                      >
                        Aceptar Pedido ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectOrder(ord.id)}
                        className="rounded-full border border-cream-border px-4 py-2.5 font-semibold text-roasted hover:bg-white active:scale-95 transition cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: CHAT INTEGRADO (DELIVERY-USUARIO Y DELIVERY-RESTAURANTE)
           ========================================================================= */}
        {activeTab === 'chat' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-cream-border">
              <div>
                <h2 className="text-sm font-extrabold text-espresso">Centro de Mensajería</h2>
                <p className="text-[11px] text-coffee-muted">Coordinación en tiempo real</p>
              </div>
              <div className="flex gap-1 bg-cream-container p-1 rounded-full border border-cream-border text-xs">
                <button
                  type="button"
                  onClick={() => setChatTarget('usuario')}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    chatTarget === 'usuario' ? 'bg-espresso text-white shadow-2xs' : 'text-roasted'
                  }`}
                >
                  Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setChatTarget('restaurante')}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    chatTarget === 'restaurante' ? 'bg-espresso text-white shadow-2xs' : 'text-roasted'
                  }`}
                >
                  Restaurante
                </button>
              </div>
            </div>

            {/* Ventana de Mensajes */}
            <div className="h-60 rounded-2xl border border-cream-border bg-cream-soft/30 p-3 overflow-y-auto space-y-2.5 flex flex-col">
              <div className="text-center py-1">
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-cream-border text-coffee-muted">
                  Canal activo con {chatTarget === 'usuario' ? (currentDelivery ? currentDelivery.customerName : 'Cliente') : (currentDelivery ? currentDelivery.restaurantName : 'Restaurante')}
                </span>
              </div>
              
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] rounded-2xl p-2.5 text-xs shadow-2xs ${
                    m.sender.startsWith('Tú')
                      ? 'ml-auto bg-espresso text-white'
                      : 'mr-auto bg-white text-espresso border border-cream-border'
                  }`}
                >
                  <p className="font-bold text-[10px] opacity-80 mb-0.5">{m.sender}</p>
                  <p className="leading-snug">{m.text}</p>
                  <span className="block text-[9px] text-right opacity-70 mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Formulario de Enviar Mensaje */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Escribe mensaje al ${chatTarget}...`}
                className="flex-1 rounded-full border border-cream-border bg-white px-4 py-2.5 text-xs text-espresso placeholder-coffee-muted/40 focus:outline-none focus:border-caramel"
              />
              <button
                type="submit"
                className="rounded-full bg-espresso text-white px-4 py-2.5 text-xs font-bold hover:bg-espresso-light active:scale-95 transition cursor-pointer flex items-center gap-1"
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
        {activeTab === 'historial' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Turno del Día
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Entregas Realizadas Hoy ({completedOrders.length})
              </h2>
            </div>

            <div className="space-y-3">
              {completedOrders.map((hist, idx) => (
                <div key={idx} className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-espresso">{hist.id}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Completada ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-coffee-muted">{hist.route} ({hist.distance})</p>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                    <span>{hist.time} • Pago: <strong>{hist.method}</strong></span>
                    <span className="font-bold text-espresso">{formatCurrencyMXN(hist.payout)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 5: GANANCIAS POR TIPO DE PAGO (TARJETA VS EFECTIVO)
           ========================================================================= */}
        {activeTab === 'ganancias' && (
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
              <span className="text-xs text-coffee-muted font-medium">Total acumulado hoy:</span>
              <p className="text-3xl font-black text-espresso">{formatCurrencyMXN(totalEarnings)}</p>
              <span className="text-[10px] text-caramel font-bold">Sin retenciones abusivas (Tarifa Justa)</span>
            </div>

            {/* Desglose Tarjeta vs Efectivo */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-cream-border bg-white p-3 text-center space-y-1">
                <CreditCard className="h-5 w-5 text-caramel mx-auto" />
                <span className="text-[11px] text-coffee-muted block">Pagos en Tarjeta</span>
                <p className="text-sm font-extrabold text-espresso">{formatCurrencyMXN(totalCardEarnings)}</p>
              </div>
              <div className="rounded-2xl border border-cream-border bg-white p-3 text-center space-y-1">
                <Banknote className="h-5 w-5 text-emerald-700 mx-auto" />
                <span className="text-[11px] text-coffee-muted block">Pagos en Efectivo</span>
                <p className="text-sm font-extrabold text-espresso">{formatCurrencyMXN(totalCashEarnings)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Viajes completados:</span>
                <span className="font-extrabold text-espresso">{completedOrders.length} entregas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Puntualidad en PIN:</span>
                <span className="font-extrabold text-emerald-700">100% verificado</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 6: MODIFICAR PERFIL DEL REPARTIDOR
           ========================================================================= */}
        {activeTab === 'perfil' && (
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
                  <label className="font-bold text-espresso block">Nombre Completo:</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-espresso block">Teléfono de Contacto:</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-xl border border-cream-border bg-white px-3 py-2 font-medium text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-espresso block">Vehículo / Placas:</label>
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
                  <span className="font-bold text-espresso">Aceptar pagos en efectivo:</span>
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
                onClick={() => alert('¡Perfil de repartidor actualizado con éxito!')}
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
            onClick={() => setActiveTab('ruta')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'ruta'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Bike className={`h-4 w-4 ${activeTab === 'ruta' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Ruta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'pedidos'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Store className={`h-4 w-4 ${activeTab === 'pedidos' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Disponibles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'chat'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <MessageSquare className={`h-4 w-4 ${activeTab === 'chat' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ganancias')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'ganancias'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <DollarSign className={`h-4 w-4 ${activeTab === 'ganancias' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Ganancias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'perfil'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <User className={`h-4 w-4 ${activeTab === 'perfil' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}