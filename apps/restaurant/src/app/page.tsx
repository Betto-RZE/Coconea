'use client';

import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  UtensilsCrossed,
  Sparkles,
  Home,
  BarChart3,
  BookOpen,
  Store,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

type RestaurantTab = 'cocina' | 'metricas' | 'catalogo' | 'perfil';

const TAB_LABELS: Record<RestaurantTab, string> = {
  cocina: 'Cocina',
  metricas: 'Métricas',
  catalogo: 'Catálogo',
  perfil: 'Restaurante',
};

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState<RestaurantTab>('cocina');
  const [menuOpen, setMenuOpen] = useState(false);
  const [order1Ready, setOrder1Ready] = useState(false);
  const [order2Ready, setOrder2Ready] = useState(false);

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
                setActiveTab('cocina');
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
                  Monitor de Cocina y Operaciones
                </span>
              </div>
            </button>

            {/* Badge de estado y botón de menú */}
            <div className="flex items-center gap-2">
              <span className="hidden xs:inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-espresso">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>En Línea</span>
              </span>

              <button
                id="btn-restaurant-menu"
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

          {/* Menú desplegable */}
          {menuOpen && (
            <div className="mt-2 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-lg animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                <span className="text-xs font-bold uppercase tracking-wider text-caramel flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Operación de Cocina
                </span>
                <span className="text-[10px] text-coffee-muted">Bistró Raíces & Grano</span>
              </div>

              <nav className="space-y-1">
                {(['cocina', 'metricas', 'catalogo', 'perfil'] as RestaurantTab[]).map((tab) => (
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
                        {tab === 'cocina' && <UtensilsCrossed className="h-4 w-4" />}
                        {tab === 'metricas' && <BarChart3 className="h-4 w-4" />}
                        {tab === 'catalogo' && <BookOpen className="h-4 w-4" />}
                        {tab === 'perfil' && <Store className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === 'cocina' && 'Monitor de Cocina (KDS)'}
                        {tab === 'metricas' && 'Métricas y Tiempos'}
                        {tab === 'catalogo' && 'Catálogo de Alérgenos'}
                        {tab === 'perfil' && 'Perfil de Restaurante'}
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
            VENTANA 1: COCINA (KDS / MONITOR DE ÓRDENES)
           ========================================================================= */}
        {activeTab === 'cocina' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Banner de restaurante activo */}
            <div className="rounded-2xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-3.5 shadow-2xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-espresso">
                <ChefHat className="h-4 w-4 text-caramel" />
                <span className="font-bold">Bistró Raíces & Grano</span>
              </div>
              <span className="text-[10px] font-bold text-roasted bg-cream-container border border-cream-border px-2.5 py-0.5 rounded-full">
                Turno Comida
              </span>
            </div>

            {/* Orden 1: Bowl Rústico de Quinoa */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-cream-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                    ORDEN #ORD-2026-081
                  </span>
                  <h2 className="text-sm font-extrabold text-espresso">
                    Bowl Rústico de Quinoa & Salmón
                  </h2>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                    order1Ready
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-cream-container text-caramel border-cream-border'
                  }`}
                >
                  {order1Ready ? 'Listo p/ Repartidor' : 'En Cocción'}
                </span>
              </div>

              {/* Lista de Alérgenos & Restricciones Rigurosas */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-espresso font-bold text-[11px]">
                  <AlertTriangle className="h-3.5 w-3.5 text-caramel" />
                  <span>Restricciones alimenticias estrictas:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-caramel border border-cream-border">
                    Sin Gluten
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-roasted border border-cream-border">
                    Sin Lácteos
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-espresso border border-cream-border">
                    580 kcal objetivo
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-coffee-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-roasted" />
                  Tiempo transcurrido: 12 min
                </span>
                <span className="font-bold text-espresso">{formatCurrencyMXN(185.0)}</span>
              </div>

              <button
                type="button"
                onClick={() => setOrder1Ready(!order1Ready)}
                className={`w-full py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  order1Ready
                    ? 'border border-cream-border text-coffee-muted hover:bg-cream-container'
                    : 'bg-espresso text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{order1Ready ? 'Regresar a Cocción' : 'Marcar Listo para Entrega'}</span>
              </button>
            </div>

            {/* Orden 2: Ensalada Keto Verde */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-cream-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                    ORDEN #ORD-2026-082
                  </span>
                  <h2 className="text-sm font-extrabold text-espresso">
                    Pechuga al Romero & Vegetales Salteados
                  </h2>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                    order2Ready
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-cream-soft text-roasted border-cream-border'
                  }`}
                >
                  {order2Ready ? 'Listo p/ Repartidor' : 'Por Iniciar'}
                </span>
              </div>

              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-espresso font-bold text-[11px]">
                  <Flame className="h-3.5 w-3.5 text-caramel" />
                  <span>Perfil Cetogénico (Keto):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-caramel border border-cream-border">
                    Bajo en Carbohidratos (&lt;10g)
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-roasted border border-cream-border">
                    Sin Azúcares Añadidos
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-coffee-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-roasted" />
                  Programado: 13:45 hrs
                </span>
                <span className="font-bold text-espresso">{formatCurrencyMXN(165.0)}</span>
              </div>

              <button
                type="button"
                onClick={() => setOrder2Ready(!order2Ready)}
                className={`w-full py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  order2Ready
                    ? 'border border-cream-border text-coffee-muted hover:bg-cream-container'
                    : 'bg-espresso text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{order2Ready ? 'Regresar a Cocción' : 'Iniciar Preparación'}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: MÉTRICAS Y TIEMPOS
           ========================================================================= */}
        {activeTab === 'metricas' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Rendimiento de Turno
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Métricas de Cocina y Tiempos
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">Por Preparar</span>
                <p className="text-2xl font-black text-espresso mt-1">3</p>
                <span className="text-[9px] text-caramel font-semibold">T. obj: 20m</span>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">En Cocción</span>
                <p className="text-2xl font-black text-espresso mt-1">2</p>
                <span className="text-[9px] text-roasted font-semibold">Chefs act.</span>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                <span className="text-[10px] font-bold text-coffee-muted block">Listos Rep.</span>
                <p className="text-2xl font-black text-espresso mt-1">1</p>
                <span className="text-[9px] text-emerald-700 font-semibold">Esperando</span>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Tiempo medio de despacho:</span>
                <span className="font-extrabold text-espresso">16.4 minutos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Cumplimiento de alérgenos:</span>
                <span className="font-extrabold text-emerald-700">100% verificado</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Órdenes atendidas hoy:</span>
                <span className="font-extrabold text-espresso">14 pedidos</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: CATÁLOGO DE PLATILLOS & ALÉRGENOS
           ========================================================================= */}
        {activeTab === 'catalogo' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Menú y Verificación
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Catálogo de Platillos y Alérgenos
              </h2>
              <p className="text-[11px] text-coffee-muted mt-0.5">
                Regla de negocio: Sin lista completa de ingredientes, no se asume seguro.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-espresso text-xs">Bowl Rústico de Quinoa</h3>
                    <p className="text-[10px] text-coffee-muted">580 kcal • Quinoa, Salmón, Aguacate</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Auditado
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] font-bold text-coffee-muted">
                  <span className="bg-cream-container px-2 py-0.5 rounded-full">Libre de Gluten</span>
                  <span className="bg-cream-container px-2 py-0.5 rounded-full">Sin Lácteos</span>
                  <span className="bg-cream-container px-2 py-0.5 rounded-full">Sin Maní</span>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-espresso text-xs">Pechuga al Romero & Salteado</h3>
                    <p className="text-[10px] text-coffee-muted">490 kcal • Pollo orgánico, Espárragos</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Auditado
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] font-bold text-coffee-muted">
                  <span className="bg-cream-container px-2 py-0.5 rounded-full">Apto Keto</span>
                  <span className="bg-cream-container px-2 py-0.5 rounded-full">Alto en Proteína</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: PERFIL DEL RESTAURANTE
           ========================================================================= */}
        {activeTab === 'perfil' && (
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
                  <h3 className="text-sm font-extrabold text-espresso">Bistró Raíces & Grano</h3>
                  <p className="text-[11px] text-coffee-muted">ID: REST-001 • Roma Norte</p>
                  <p className="text-[10px] text-caramel font-bold">Comisión regulada 0% (Demo)</p>
                </div>
              </div>

              <div className="pt-2 border-t border-cream-border/70 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Horario de despacho:</span>
                  <span className="font-bold text-espresso">12:30 - 15:30 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coffee-muted">Chef responsable:</span>
                  <span className="font-bold text-espresso">Carlos Valencia</span>
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
            onClick={() => setActiveTab('cocina')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'cocina'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <UtensilsCrossed className={`h-4 w-4 ${activeTab === 'cocina' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Cocina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metricas')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'metricas'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <BarChart3 className={`h-4 w-4 ${activeTab === 'metricas' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Métricas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalogo')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'catalogo'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <BookOpen className={`h-4 w-4 ${activeTab === 'catalogo' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Catálogo</span>
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
            <Store className={`h-4 w-4 ${activeTab === 'perfil' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
