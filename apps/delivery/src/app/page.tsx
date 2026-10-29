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
} from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

type DeliveryTab = 'ruta' | 'historial' | 'ganancias' | 'perfil';

const TAB_LABELS: Record<DeliveryTab, string> = {
  ruta: 'Ruta',
  historial: 'Historial',
  ganancias: 'Ganancias',
  perfil: 'Repartidor',
};

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>('ruta');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [pinError, setPinError] = useState(false);

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '4821') {
      setDeliveryConfirmed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 pb-24 selection:bg-caramel/20 selection:text-espresso">
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

          {/* Menú Desplegable */}
          {menuOpen && (
            <div className="mt-2 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-lg animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                <span className="text-xs font-bold uppercase tracking-wider text-caramel flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Operación de Reparto
                </span>
                <span className="text-[10px] text-coffee-muted">Rodrigo Herrera</span>
              </div>

              <nav className="space-y-1">
                {(['ruta', 'historial', 'ganancias', 'perfil'] as DeliveryTab[]).map((tab) => (
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
                        {tab === 'historial' && <CheckCircle2 className="h-4 w-4" />}
                        {tab === 'ganancias' && <DollarSign className="h-4 w-4" />}
                        {tab === 'perfil' && <User className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === 'ruta' && 'Entrega Activa en Curso'}
                        {tab === 'historial' && 'Historial de Entregas'}
                        {tab === 'ganancias' && 'Resumen del Turno'}
                        {tab === 'perfil' && 'Mi Perfil de Repartidor'}
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
            {/* Tarjeta de la entrega en curso */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-cream-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                    ENTREGA EN CURSO
                  </span>
                  <h2 className="text-sm font-extrabold text-espresso">
                    Orden #ORD-2026-081
                  </h2>
                </div>
                <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-caramel">
                  1.8 km restante
                </span>
              </div>

              {/* Puntos de Ruta: Recolección y Destino */}
              <div className="space-y-3 text-xs">
                {/* Origen */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-espresso">Recolección: Bistró Raíces & Grano</p>
                    <p className="text-[11px] text-coffee-muted">Av. Álvaro Obregón 160 (Completada)</p>
                  </div>
                </div>

                {/* Destino */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-cream-container text-caramel border border-cream-border mt-0.5">
                    <Navigation className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-espresso">Destino: Sofía Méndez</p>
                    <p className="text-[11px] text-coffee-muted">Calle Durango 154, Int 3B, Roma Norte</p>
                  </div>
                </div>
              </div>

              {/* Botón de llamada al cliente */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-espresso font-semibold">
                  <Phone className="h-3.5 w-3.5 text-caramel" />
                  <span>Contacto con Cliente</span>
                </div>
                <span className="text-[11px] font-bold text-roasted bg-white px-2.5 py-0.5 rounded-full border border-cream-border">
                  +52 55 •••• 5678
                </span>
              </div>

              {/* Confirmación con PIN según regla de negocio */}
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
                      className="flex-1 rounded-full border border-cream-border bg-white px-4 py-2 text-sm text-center font-bold text-espresso placeholder-coffee-muted/40 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 transition"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-espresso px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark transition cursor-pointer"
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
                    PIN validado. La orden #ORD-2026-081 ha quedado completada.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryConfirmed(false);
                      setPin('');
                    }}
                    className="text-[11px] text-emerald-800 underline font-semibold hover:text-emerald-950 block mx-auto cursor-pointer"
                  >
                    Reiniciar simulación
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: HISTORIAL DE ENTREGAS
           ========================================================================= */}
        {activeTab === 'historial' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Turno del Día
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Entregas Realizadas Hoy
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-espresso">#ORD-2026-079</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    A Tiempo
                  </span>
                </div>
                <p className="text-[11px] text-coffee-muted">Bistró Raíces → Col. Condesa (2.4 km)</p>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                  <span>Entrega: 12:45 hrs</span>
                  <span className="font-bold text-espresso">{formatCurrencyMXN(45.0)} envío</span>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-espresso">#ORD-2026-080</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    A Tiempo
                  </span>
                </div>
                <p className="text-[11px] text-coffee-muted">Green Bowl → Roma Sur (1.6 km)</p>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                  <span>Entrega: 13:10 hrs</span>
                  <span className="font-bold text-espresso">{formatCurrencyMXN(40.0)} envío</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: GANANCIAS / TURNO
           ========================================================================= */}
        {activeTab === 'ganancias' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Compensación Transparente
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Resumen de Compensación
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 text-center space-y-1">
              <span className="text-xs text-coffee-muted font-medium">Total acumulado hoy:</span>
              <p className="text-3xl font-black text-espresso">{formatCurrencyMXN(265.0)}</p>
              <span className="text-[10px] text-caramel font-bold">Sin retenciones abusivas (Tarifa Justa)</span>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Viajes completados:</span>
                <span className="font-extrabold text-espresso">6 entregas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Distancia total recorrida:</span>
                <span className="font-extrabold text-espresso">11.4 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Puntualidad en PIN:</span>
                <span className="font-extrabold text-emerald-700">100% verificado</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: PERFIL DEL REPARTIDOR
           ========================================================================= */}
        {activeTab === 'perfil' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Cuenta de Conductor
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Perfil de Repartidor Aliado
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso text-cream text-base font-bold shadow-xs">
                  <Bike className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-espresso">Rodrigo Herrera</h3>
                  <p className="text-[11px] text-coffee-muted">ID: DELIV-042 • Repartidor Verificado</p>
                  <p className="text-[10px] text-caramel font-bold">Vehículo: Bicicleta Eléctrica</p>
                </div>
              </div>

              <div className="pt-2 border-t border-cream-border/70 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Zona asignada:</span>
                  <span className="font-bold text-espresso">Roma Norte / Condesa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Calificación promedio:</span>
                  <span className="font-bold text-emerald-700">★ 4.98</span>
                </div>
              </div>
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

      {/* Barra de Navegación Inferior Flotante (Bottom Tab Bar) */}
      <nav
        aria-label="Navegación inferior repartidor"
        className="fixed bottom-3 inset-x-0 mx-auto max-w-md px-3 z-40"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab('ruta')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
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
            onClick={() => setActiveTab('historial')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'historial'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${activeTab === 'historial' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Historial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ganancias')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
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
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
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
