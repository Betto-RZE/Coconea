'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PROJECT_NAME,
  PROJECT_MOTTO,
  formatCurrencyMXN,
} from '@coconea/shared';
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
  Info,
  Check,
  ChefHat,
  SlidersHorizontal,
  Home,
  User as UserIcon,
  ArrowRight,
  LogOut,
  Mail,
  Lock,
} from 'lucide-react';
import { Navbar, CustomerTab } from '@/components/navbar';
import { useAuth, DEMO_ACCOUNTS } from '@/context/auth-context';

export default function CustomerHome() {
  const { user, isAuthenticated, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerTab>('inicio');
  const [selectedMode, setSelectedMode] = useState<'recommendation' | 'fixed'>('recommendation');
  const [proposalStatus, setProposalStatus] = useState<'pending' | 'confirmed' | 'rejected'>('pending');

  return (
    <div className="min-h-screen flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 pb-24 selection:bg-caramel/20 selection:text-espresso">
      {/* Contenedor Principal Centrado Estilo Mobile (max-w-md) */}
      <main className="w-full max-w-md mx-auto space-y-4">
        {/* Barra Superior con Menú de Pantallas */}
        <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* =========================================================================
            VENTANA 1: INICIO & BIENVENIDA
           ========================================================================= */}
        {activeTab === 'inicio' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Saludo si hay sesión activa */}
            {isAuthenticated && user && (
              <div className="rounded-2xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-3.5 shadow-2xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-espresso truncate">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-caramel text-white text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="truncate">
                    Hola, <strong className="font-bold">{user.fullName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cuenta')}
                  className="flex-shrink-0 text-[10px] font-bold text-roasted bg-cream-container border border-cream-border px-2.5 py-0.5 rounded-full hover:bg-cream-container/80 transition cursor-pointer"
                >
                  {user.dietaryPreferences?.[0] || 'Plan Equilibrado'} →
                </button>
              </div>
            )}

            {/* Tarjeta Hero Principal */}
            <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cream-container px-3 py-1 text-[11px] font-semibold text-caramel border border-cream-border shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-caramel" />
                <span>Sin sorpresas ni cobros automáticos</span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-black text-espresso tracking-tight leading-tight">
                  Alimentación planificada,{' '}
                  <span className="text-caramel">confirmada por ti</span>
                </h1>
                <p className="text-xs text-coffee-muted leading-relaxed font-normal">
                  {PROJECT_MOTTO}
                </p>
              </div>

              {/* Acceso Rápido a la Propuesta del Día */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('propuesta')}
                  className="w-full rounded-full bg-espresso py-3 px-5 text-xs font-bold text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-mocha-light" />
                  <span>Ver Propuesta de Hoy</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-caramel text-white text-[10px] font-bold">
                    Activa
                  </span>
                </button>
              </div>
            </section>

            {/* Accesos a las otras ventanas en forma de tarjetas interactivas */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <button
                type="button"
                onClick={() => setActiveTab('modalidad')}
                className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-2xs hover:shadow-xs hover:border-caramel/50 transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-2xl bg-cream-container text-caramel border border-cream-border">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-coffee-muted" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-espresso">Modalidades</h2>
                  <p className="text-[10px] text-coffee-muted leading-snug mt-0.5">
                    Recomendación o selección fija.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('garantia')}
                className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-2xs hover:shadow-xs hover:border-caramel/50 transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-2xl bg-cream-container text-espresso border border-cream-border">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-coffee-muted" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-espresso">Garantía Ética</h2>
                  <p className="text-[10px] text-coffee-muted leading-snug mt-0.5">
                    Programar no es comprar ($0 MXN).
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VENTANA 2: PROPUESTA DE HOY
           ========================================================================= */}
        {activeTab === 'propuesta' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            {/* Encabezado de la Propuesta */}
            <div className="flex items-center justify-between pb-3 border-b border-cream-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                  PROPUESTA DIARIA #8421
                </span>
                <h2 className="text-base font-extrabold text-espresso leading-snug">
                  Bowl Rústico de Quinoa & Salmón
                </h2>
              </div>

              {proposalStatus === 'pending' && (
                <span className="rounded-full bg-cream-container px-2.5 py-1 text-[11px] font-bold text-caramel border border-cream-border flex-shrink-0">
                  Pendiente
                </span>
              )}
              {proposalStatus === 'confirmed' && (
                <span className="rounded-full bg-espresso text-cream px-2.5 py-1 text-[11px] font-bold flex-shrink-0">
                  Confirmada
                </span>
              )}
              {proposalStatus === 'rejected' && (
                <span className="rounded-full bg-cream-soft text-coffee-muted px-2.5 py-1 text-[11px] font-bold border border-cream-border flex-shrink-0">
                  Rechazada
                </span>
              )}
            </div>

            {/* Restaurante & Macronutrientes */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-coffee-muted flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-roasted" />
                  Restaurante
                </span>
                <span className="font-semibold text-espresso">Bistró Raíces & Grano</span>
              </div>

              {/* Chips de Macronutrientes */}
              <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-cream-container/70 border border-cream-border text-center text-[11px]">
                <div className="font-bold text-caramel">
                  <span className="block text-[9px] uppercase text-coffee-muted">Calorías</span>
                  580 kcal
                </div>
                <div className="font-semibold text-espresso">
                  <span className="block text-[9px] uppercase text-coffee-muted">Prot</span>
                  36g
                </div>
                <div className="font-semibold text-espresso">
                  <span className="block text-[9px] uppercase text-coffee-muted">Carbs</span>
                  42g
                </div>
                <div className="font-semibold text-espresso">
                  <span className="block text-[9px] uppercase text-coffee-muted">Grasas</span>
                  18g
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-coffee-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-roasted" />
                  Entrega estimada
                </span>
                <span className="font-semibold text-espresso">Hoy 13:30 - 14:15 hrs</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-cream-border/60">
                <span className="text-coffee-muted">Total cotizado (con envío)</span>
                <span className="font-extrabold text-espresso text-base">
                  {formatCurrencyMXN(185.0)}
                </span>
              </div>
            </div>

            {/* Acciones de la propuesta */}
            {proposalStatus === 'pending' && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-confirm-proposal"
                  type="button"
                  onClick={() => setProposalStatus('confirmed')}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-espresso py-3 text-xs font-bold text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark transition cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-mocha-light" />
                  <span>Confirmar y Recibir</span>
                </button>
                <button
                  id="btn-reject-proposal"
                  type="button"
                  onClick={() => setProposalStatus('rejected')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full border border-cream-border py-2.5 text-xs font-semibold text-roasted hover:bg-cream-container transition cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Rechazar ($0 MXN)</span>
                </button>
              </div>
            )}

            {proposalStatus === 'confirmed' && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>¡Propuesta confirmada exitosamente!</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Se revalidó disponibilidad y el restaurante ha recibido la comanda.
                </p>
                <button
                  type="button"
                  onClick={() => setProposalStatus('pending')}
                  className="text-[11px] text-emerald-800 underline font-semibold hover:text-emerald-950 block mx-auto cursor-pointer"
                >
                  Reiniciar simulación
                </button>
              </div>
            )}

            {proposalStatus === 'rejected' && (
              <div className="rounded-2xl bg-cream-soft border border-cream-border p-3.5 text-center space-y-1.5 animate-fadeIn">
                <p className="text-xs font-bold text-espresso">Propuesta rechazada</p>
                <p className="text-[11px] text-coffee-muted">
                  No se ha generado ningún pedido ni cobro financiero ($0 MXN).
                </p>
                <button
                  type="button"
                  onClick={() => setProposalStatus('pending')}
                  className="text-[11px] text-caramel underline font-semibold hover:text-espresso block mx-auto cursor-pointer"
                >
                  Ver propuesta nuevamente
                </button>
              </div>
            )}

            {/* Recordatorio de regla de expiración */}
            <p className="text-center text-[10px] text-coffee-muted flex items-center justify-center gap-1 pt-1">
              <Info className="h-3 w-3 text-caramel flex-shrink-0" />
              <span>Si no confirmas antes de las 11:30 AM, expirará a $0 MXN.</span>
            </p>
          </section>
        )}

        {/* =========================================================================
            VENTANA 3: MODALIDADES DE PLAN
           ========================================================================= */}
        {activeTab === 'modalidad' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Configuración Recurrente
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                Modalidad de Plan Alimenticio
              </h2>
              <p className="text-[11px] text-coffee-muted mt-0.5">
                Selecciona cómo deseas que Coconea programe tus comidas
              </p>
            </div>

            {/* Switch interactivo tipo píldora */}
            <div className="grid grid-cols-2 p-1 rounded-full bg-cream-container border border-cream-border shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedMode('recommendation')}
                className={`py-2 text-xs font-bold rounded-full text-center transition-all duration-200 cursor-pointer ${
                  selectedMode === 'recommendation'
                    ? 'bg-espresso text-white shadow-xs'
                    : 'text-roasted hover:text-espresso'
                }`}
              >
                Recomendación
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('fixed')}
                className={`py-2 text-xs font-bold rounded-full text-center transition-all duration-200 cursor-pointer ${
                  selectedMode === 'fixed'
                    ? 'bg-espresso text-white shadow-xs'
                    : 'text-roasted hover:text-espresso'
                }`}
              >
                Selección Fija
              </button>
            </div>

            {/* Contenido descriptivo de la modalidad seleccionada */}
            <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 text-xs space-y-3">
              {selectedMode === 'recommendation' ? (
                <>
                  <div className="flex items-center gap-2 text-espresso font-bold">
                    <div className="p-1.5 rounded-xl bg-white border border-cream-border text-caramel">
                      <ChefHat className="h-4 w-4" />
                    </div>
                    <span>Recomendación Inteligente Determinista</span>
                  </div>
                  <p className="text-coffee-muted leading-relaxed text-[11px]">
                    Nuestro motor determinista calcula propuestas balanceadas basadas en tu perfil
                    nutricional (calorías objetivo, distribución de macronutrientes y exclusión estricta
                    de alérgenos). No requiere que elijas cada plato manualmente.
                  </p>
                  <div className="rounded-xl bg-white border border-cream-border p-2.5 text-[11px] space-y-1">
                    <div className="font-bold text-espresso">Ventajas para ti:</div>
                    <ul className="list-disc list-inside text-coffee-muted space-y-0.5">
                      <li>Variedad balanceada sin repetir platillos consecutivos.</li>
                      <li>Cumplimiento estricto de intolerancias verificadas.</li>
                      <li>Notificación matutina lista para tu visto bueno.</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-espresso font-bold">
                    <div className="p-1.5 rounded-xl bg-white border border-cream-border text-roasted">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <span>Selección Fija Recurrente</span>
                  </div>
                  <p className="text-coffee-muted leading-relaxed text-[11px]">
                    Tú seleccionas exactamente los platillos y porciones de tus restaurantes favoritos
                    para días específicos de la semana. Coconea te genera la propuesta fielmente
                    en cada ciclo para tu visto bueno.
                  </p>
                  <div className="rounded-xl bg-white border border-cream-border p-2.5 text-[11px] space-y-1">
                    <div className="font-bold text-espresso">Ventajas para ti:</div>
                    <ul className="list-disc list-inside text-coffee-muted space-y-0.5">
                      <li>Tus alimentos preferidos de forma consistente.</li>
                      <li>Control total sobre tus restaurantes predilectos.</li>
                      <li>Cotización transparente y revalidada en cada ciclo.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('propuesta')}
              className="w-full text-center rounded-full bg-espresso py-2.5 text-xs font-bold text-white shadow-xs hover:bg-espresso-light transition cursor-pointer"
            >
              Ver Propuesta Actual con esta Modalidad →
            </button>
          </section>
        )}

        {/* =========================================================================
            VENTANA 4: GARANTÍA ÉTICA («PROGRAMAR NO ES COMPRAR»)
           ========================================================================= */}
        {activeTab === 'garantia' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Nuestra Garantía Ética
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                La Regla de Oro: «Programar no es comprar»
              </h2>
              <p className="text-[11px] text-coffee-muted mt-1">
                Tu confirmación voluntaria es el único mecanismo que autoriza un cobro financiero.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Paso 1 */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/30 p-3.5 flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-caramel border border-cream-border font-bold">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-xs">1. Tus Preferencias</h3>
                  <p className="text-[11px] text-coffee-muted leading-snug mt-0.5">
                    Restricciones y alérgenos con rigor médico ético. Si un plato carece de ingredientes verificados, nunca se asume seguro.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/30 p-3.5 flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-roasted border border-cream-border font-bold">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-xs">2. Propuesta Oportuna</h3>
                  <p className="text-[11px] text-coffee-muted leading-snug mt-0.5">
                    Se genera con anticipación para que la revises. La creación de la propuesta jamás genera un cobro financiero ni toca tus cuentas.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="rounded-2xl border border-cream-border bg-cream-container/30 p-3.5 flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cream-container text-espresso border border-cream-border font-bold">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-espresso text-xs">3. Confirmación Explícita</h3>
                  <p className="text-[11px] text-coffee-muted leading-snug mt-0.5">
                    Solo cuando tú confirmas se valida cobertura, cocina y pago. Si la rechazas o expira, el costo es estrictamente $0 MXN.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-soft border border-cream-border p-3 text-center text-[11px] text-coffee-muted">
              🔒 <strong>Compromiso $0 MXN:</strong> Sin tarjetas obligatorias ni cobros fantasma.
            </div>
          </section>
        )}

        {/* =========================================================================
            VENTANA 5: MI CUENTA & PREFERENCIAS
           ========================================================================= */}
        {activeTab === 'cuenta' && (
          <section className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 animate-fadeIn">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-caramel block">
                Gestión de Perfil
              </span>
              <h2 className="text-base font-extrabold text-espresso">
                {isAuthenticated && user ? 'Tu Cuenta Coconea' : 'Acceso a tu Cuenta'}
              </h2>
            </div>

            {isAuthenticated && user ? (
              <div className="space-y-3.5">
                {/* Tarjeta de usuario */}
                <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso text-cream text-base font-bold shadow-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-bold text-espresso truncate">{user.fullName}</p>
                      <p className="text-xs text-coffee-muted truncate">{user.email}</p>
                      {user.phone && <p className="text-[11px] text-coffee-muted">{user.phone}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cream-border/70 flex items-center justify-between text-xs">
                    <span className="text-coffee-muted font-medium">Preferencia activa:</span>
                    <span className="font-bold text-caramel bg-white px-2.5 py-0.5 rounded-full border border-cream-border">
                      {user.dietaryPreferences?.[0] || 'Plan Equilibrado'}
                    </span>
                  </div>
                </div>

                {/* Acciones de Cuenta */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('modalidad')}
                    className="w-full text-center rounded-full border border-cream-border bg-white py-2.5 text-xs font-bold text-espresso hover:bg-cream-container transition cursor-pointer"
                  >
                    Ajustar Modalidad de Plan
                  </button>
                  <button
                    id="btn-profile-logout"
                    type="button"
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/80 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-cream-container/60 border border-cream-border text-xs text-coffee-muted space-y-1">
                  <p className="font-bold text-espresso text-sm">¿Ya tienes cuenta o deseas registrarte?</p>
                  <p className="text-[11px]">
                    Inicia sesión para gestionar tus propuestas o crea una cuenta para personalizar tu plan.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full rounded-full bg-espresso py-3 text-xs font-bold text-white shadow-xs hover:bg-espresso-light transition flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="w-full rounded-full border border-cream-border bg-white py-3 text-xs font-bold text-espresso hover:bg-cream-container transition"
                  >
                    Crear tu Cuenta
                  </Link>
                </div>

                {/* Acceso Rápido con Cuenta Demo */}
                <div className="pt-2 border-t border-cream-border">
                  <p className="text-[10px] text-coffee-muted mb-2 font-medium">
                    O prueba al instante con una cuenta demo:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const demo = DEMO_ACCOUNTS.standard;
                      login(demo.email, demo.password || 'Coconea2026!');
                    }}
                    className="text-xs font-bold text-caramel hover:text-espresso underline cursor-pointer"
                  >
                    Entrar como Sofía Méndez (Demo Estándar) →
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Pie de página discreto */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-coffee-muted mt-6 pb-2">
        <p className="inline-block bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-cream-border/70 shadow-2xs text-[11px]">
          © 2026 {PROJECT_NAME} — Planifica, confirma y recibe.
        </p>
      </footer>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN MÓVIL INFERIOR FLOTANTE (BOTTOM TAB BAR)
          Permite cambiar de ventana al instante SIN scrolls
         ========================================================================= */}
      <nav
        aria-label="Navegación inferior móvil"
        className="fixed bottom-3 inset-x-0 mx-auto max-w-md px-3 z-40"
      >
        <div className="rounded-full border border-cream-border/90 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg flex items-center justify-around">
          {/* Tab 1: Inicio */}
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'inicio'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Home className={`h-4 w-4 ${activeTab === 'inicio' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Inicio</span>
          </button>

          {/* Tab 2: Propuesta */}
          <button
            type="button"
            onClick={() => setActiveTab('propuesta')}
            className={`relative flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'propuesta'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <Calendar className={`h-4 w-4 ${activeTab === 'propuesta' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Propuesta</span>
            {proposalStatus === 'pending' && (
              <span className="absolute top-1 right-2.5 h-1.5 w-1.5 rounded-full bg-caramel ring-2 ring-white" />
            )}
          </button>

          {/* Tab 3: Modalidad */}
          <button
            type="button"
            onClick={() => setActiveTab('modalidad')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'modalidad'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <ChefHat className={`h-4 w-4 ${activeTab === 'modalidad' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Plan</span>
          </button>

          {/* Tab 4: Garantía */}
          <button
            type="button"
            onClick={() => setActiveTab('garantia')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'garantia'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${activeTab === 'garantia' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>Garantía</span>
          </button>

          {/* Tab 5: Cuenta */}
          <button
            type="button"
            onClick={() => setActiveTab('cuenta')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2.5 rounded-full transition cursor-pointer ${
              activeTab === 'cuenta'
                ? 'font-bold text-espresso bg-cream-container shadow-2xs'
                : 'font-medium text-coffee-muted hover:text-espresso'
            }`}
          >
            <UserIcon className={`h-4 w-4 ${activeTab === 'cuenta' ? 'text-caramel' : 'text-coffee-muted'}`} />
            <span>{isAuthenticated ? 'Perfil' : 'Cuenta'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
