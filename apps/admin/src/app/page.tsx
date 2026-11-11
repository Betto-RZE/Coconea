'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Store,
  DollarSign,
  Activity,
  Sparkles,
  ShieldCheck,
  Calendar,
  Settings,
  Menu,
  X,
  ArrowRight,
  Lock,
  Layers,
} from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

type AdminTab = 'metricas' | 'usuarios' | 'operaciones' | 'seguridad' | 'sistema';

const TAB_LABELS: Record<AdminTab, string> = {
  metricas: 'Métricas',
  usuarios: 'Usuarios',
  operaciones: 'Operaciones',
  seguridad: 'Seguridad',
  sistema: 'Sistema',
};

const RESTAURANT_USERS = [
  { name: "McDonald's", email: 'mcdonalds@coconea.local' },
  { name: 'Subway', email: 'subway@coconea.local' },
  { name: 'KFC', email: 'kfc@coconea.local' },
  { name: "Domino's", email: 'dominos@coconea.local' },
  { name: 'Green Grass', email: 'greengrass@coconea.local' },
] as const;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('metricas');
  const [menuOpen, setMenuOpen] = useState(false);

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
                setActiveTab('metricas');
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
                  Panel de Control Global & Auditoría
                </span>
              </div>
            </button>

            {/* Badge de presupuesto $0 y botón menú */}
            <div className="flex items-center gap-2">
              <span className="hidden xs:inline-flex items-center gap-1.5 rounded-full bg-cream-container border border-cream-border px-2.5 py-1 text-[11px] font-bold text-espresso">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>$0 MXN</span>
              </span>

              <button
                id="btn-admin-menu"
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
                  Módulos de Administración
                </span>
                <span className="text-[10px] text-coffee-muted">Ambiente Local Seguro</span>
              </div>

              <nav className="space-y-1">
                {(['metricas', 'usuarios', 'operaciones', 'seguridad', 'sistema'] as AdminTab[]).map((tab) => (
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
                        {tab === 'metricas' && <BarChart3 className="h-4 w-4" />}
                        {tab === 'usuarios' && <Users className="h-4 w-4" />}
                        {tab === 'operaciones' && <Activity className="h-4 w-4" />}
                        {tab === 'seguridad' && <ShieldCheck className="h-4 w-4" />}
                        {tab === 'sistema' && <Settings className="h-4 w-4" />}
                      </div>
                      <span>
                        {tab === 'metricas' && 'Métricas y KPIs'}
                        {tab === 'usuarios' && 'Usuarios y accesos'}
                        {tab === 'operaciones' && 'Operaciones y Propuestas'}
                        {tab === 'seguridad' && 'Seguridad y RBAC'}
                        {tab === 'sistema' && 'Parámetros del Sistema'}
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
            VENTANA 1: MÉTRICAS Y KPIS
           ========================================================================= */}
        {activeTab === 'metricas' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Banner de Volumen */}
            <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 text-center shadow-sm space-y-1">
              <span className="text-xs text-coffee-muted font-medium">Volumen Transaccionado (Simulado):</span>
              <p className="text-3xl font-black text-espresso">{formatCurrencyMXN(12480.0)}</p>
              <span className="text-[10px] text-caramel font-bold">Proveedor simulado MockPaymentProvider</span>
            </div>

            {/* Grid de 3 KPIs principales */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-2xl border border-cream-border bg-white/95 backdrop-blur-md p-3.5 shadow-2xs space-y-1">
                <Store className="h-4 w-4 text-caramel mx-auto" />
                <p className="text-xl font-black text-espresso">12</p>
                <span className="text-[10px] text-coffee-muted block">Restaurantes</span>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white/95 backdrop-blur-md p-3.5 shadow-2xs space-y-1">
                <Users className="h-4 w-4 text-roasted mx-auto" />
                <p className="text-xl font-black text-espresso">254</p>
                <span className="text-[10px] text-coffee-muted block">Consumidores</span>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white/95 backdrop-blur-md p-3.5 shadow-2xs space-y-1">
                <Calendar className="h-4 w-4 text-espresso mx-auto" />
                <p className="text-xl font-black text-espresso">89</p>
                <span className="text-[10px] text-coffee-muted block">Propuestas</span>
              </div>
            </div>

            {/* Desglose de Operaciones */}
            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Tasa de confirmación voluntaria:</span>
                <span className="font-extrabold text-espresso">84.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Ocurrencias expiradas sin cargo:</span>
                <span className="font-extrabold text-caramel">14 ($0 MXN)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Tiempo medio de confirmación:</span>
                <span className="font-extrabold text-espresso">38 minutos</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: USUARIOS Y ACCESOS
           ========================================================================= */}
        {activeTab === 'usuarios' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Cuentas locales de prueba
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Accesos de restaurantes
              </h2>
            </div>

            <ul className="space-y-2">
              {RESTAURANT_USERS.map((restaurant) => (
                <li
                  key={restaurant.email}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-cream-border bg-white p-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-espresso">{restaurant.name}</p>
                    <p className="break-all text-xs text-coffee-muted">{restaurant.email}</p>
                  </div>
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full bg-espresso px-3 py-2 text-xs font-bold text-white transition hover:bg-roasted"
                  >
                    Ingresar
                  </a>
                </li>
              ))}
            </ul>

            <p className="rounded-2xl border border-cream-border bg-cream-container/50 p-3 text-xs leading-relaxed text-coffee-muted">
              Usa la contraseña de cada cuenta guardada en{' '}
              <code className="break-all font-semibold text-espresso">
                tmp/restaurant-accounts.json
              </code>
              . Por seguridad, este panel no muestra contraseñas. Estas cuentas
              corresponden al entorno local y no sirven en la demo estática.
            </p>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: OPERACIONES Y PROPUESTAS
           ========================================================================= */}
        {activeTab === 'operaciones' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Auditoría de Ocurrencias
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Propuestas & Ciclos Recurrentes
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-espresso">#PROP-8421 • Sofía Méndez</span>
                  <span className="text-[10px] font-bold text-caramel bg-cream-container px-2 py-0.5 rounded-full border border-cream-border">
                    Pendiente
                  </span>
                </div>
                <p className="text-[11px] text-coffee-muted">Bistró Raíces • Modalidad Recomendación</p>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                  <span>Expira: 11:30 AM</span>
                  <span className="font-bold text-espresso">{formatCurrencyMXN(185.0)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-border bg-white p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-espresso">#PROP-8419 • Carlos Vega</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmada
                  </span>
                </div>
                <p className="text-[11px] text-coffee-muted">Green Bowl • Modalidad Fija</p>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-cream-border/60 text-coffee-muted">
                  <span>Confirmó: 09:14 AM</span>
                  <span className="font-bold text-espresso">{formatCurrencyMXN(165.0)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: SEGURIDAD Y RBAC
           ========================================================================= */}
        {activeTab === 'seguridad' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Controles de Acceso
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Seguridad & Políticas Innegociables
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-espresso font-bold">
                <ShieldCheck className="h-4 w-4 text-caramel" />
                <span>Regla de Privilegios Administrativos</span>
              </div>
              <p className="text-[11px] text-coffee-muted leading-relaxed">
                Los permisos de administrador permiten auditar y supervisar el sistema, pero
                <strong> jamás pueden autorizar compras ni cobros en nombre del consumidor</strong>.
                Solo la firma voluntaria del usuario crea un pedido.
              </p>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Mecanismo de Identidad:</span>
                <span className="font-extrabold text-espresso">Better Auth + RBAC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Validación por recurso:</span>
                <span className="font-extrabold text-emerald-700">Protección IDOR activa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Sesiones administrativas:</span>
                <span className="font-extrabold text-espresso">1 activa (Local)</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 5: PARÁMETROS DEL SISTEMA
           ========================================================================= */}
        {activeTab === 'sistema' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Entorno y Configuración
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Parámetros Globales ($0 MXN)
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Límite de confirmación:</span>
                <span className="font-extrabold text-espresso">11:30 AM (Diario)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Persistencia de estado:</span>
                <span className="font-extrabold text-espresso">PostgreSQL / Drizzle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Cola de trabajos:</span>
                <span className="font-extrabold text-espresso">pg-boss asíncrono</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted">Presupuesto MVP:</span>
                <span className="font-extrabold text-emerald-700">$0 MXN (100% gratuito)</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Pie de página discreto */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-coffee-muted mt-6 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-cream-border/70 shadow-2xs text-[11px]">
          © 2026 {PROJECT_NAME} Administración — Presupuesto objetivo $0 MXN.
        </p>
      </footer>

      {/* Barra de Navegación Inferior Flotante (Bottom Tab Bar) */}
      <nav
        aria-label="Navegación inferior admin"
        className="fixed bottom-3 inset-x-0 mx-auto max-w-md px-3 z-40"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg flex items-center justify-around">
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
            onClick={() => setActiveTab('usuarios')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-full transition cursor-pointer ${
              activeTab === 'usuarios'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Users className={`h-4 w-4 ${activeTab === 'usuarios' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Usuarios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operaciones')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'operaciones'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Activity className={`h-4 w-4 ${activeTab === 'operaciones' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Operaciones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seguridad')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'seguridad'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${activeTab === 'seguridad' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Seguridad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sistema')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 rounded-full transition cursor-pointer ${
              activeTab === 'sistema'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Settings className={`h-4 w-4 ${activeTab === 'sistema' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Sistema</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
