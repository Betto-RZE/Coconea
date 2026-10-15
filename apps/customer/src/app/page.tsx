'use client';

import React, { useState } from 'react';
import {
  PROJECT_NAME,
  PROJECT_MOTTO,
  formatCurrencyMXN,
  COCONEA_COLORS,
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
  ArrowRight,
  Info,
  Check,
  ChefHat,
  SlidersHorizontal,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function CustomerHome() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'recommendation' | 'fixed'>('recommendation');
  const [proposalStatus, setProposalStatus] = useState<'pending' | 'confirmed' | 'rejected'>('pending');

  return (
    <div className="flex min-h-screen flex-col bg-cream text-coffee selection:bg-caramel/20 selection:text-espresso">
      {/* Barra de Navegación con detección de sesión */}
      <Navbar />

      {/* Banner de Bienvenida Personalizado si hay sesión iniciada */}
      {isAuthenticated && user && (
        <div className="bg-cream-container/80 border-b border-cream-border px-4 py-2.5">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-espresso">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-caramel text-white text-[10px] font-bold">
                ✓
              </span>
              <span>
                Hola, <strong>{user.fullName}</strong>. Tu perfil está activo con:{' '}
                <span className="text-caramel font-semibold">
                  {user.dietaryPreferences?.join(', ') || 'Plan Estándar'}
                </span>
                {user.allergies && user.allergies.length > 0 && (
                  <span className="text-coffee-muted ml-1">
                    (Excluyendo: {user.allergies.join(', ')})
                  </span>
                )}
              </span>
            </div>
            <a href="#demo-propuesta" className="font-semibold text-roasted hover:text-espresso underline decoration-caramel">
              Revisar propuesta pendiente →
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-container/50 via-cream to-cream-soft py-16 sm:py-24 border-b border-cream-border/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            {/* Pill superior */}
            <div className="inline-flex items-center gap-2 rounded-full bg-cream-container px-4 py-1.5 text-xs font-semibold text-caramel mb-6 border border-cream-border shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-caramel" strokeWidth={2} />
              <span>Programación recurrente con confirmación explícita</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-espresso sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
              Alimentación personalizada <br className="hidden sm:block" />
              <span className="text-caramel font-black">
                sin sorpresas ni cobros automáticos
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-coffee-muted leading-relaxed font-normal">
              {PROJECT_MOTTO}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo-propuesta"
                className="rounded-full bg-espresso px-7 py-3.5 text-base font-semibold text-white shadow-md hover:bg-espresso-light transition flex items-center gap-2.5"
              >
                <Calendar className="h-5 w-5" strokeWidth={2} />
                Explorar Propuesta de Hoy
              </a>
              <a
                href="#como-funciona"
                className="rounded-full border border-cream-border bg-white px-7 py-3.5 text-base font-medium text-roasted hover:bg-cream-container transition shadow-xs"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>
        </section>

        {/* Modalidades Recurrentes (Tabs) */}
        <section className="py-12 bg-white border-b border-cream-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
              Modalidades de Programación
            </span>
            <h2 className="text-2xl font-bold text-espresso mt-1 mb-6">
              Elige cómo planificar tu comida diaria
            </h2>

            {/* Selector de Tabs */}
            <div className="inline-flex p-1.5 rounded-full bg-cream-container border border-cream-border mb-8">
              <button
                type="button"
                onClick={() => setSelectedTab('recommendation')}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                  selectedTab === 'recommendation'
                    ? 'bg-espresso text-white shadow-sm'
                    : 'text-roasted hover:text-espresso'
                }`}
              >
                Recomendación Inteligente
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('fixed')}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                  selectedTab === 'fixed'
                    ? 'bg-espresso text-white shadow-sm'
                    : 'text-roasted hover:text-espresso'
                }`}
              >
                Selección Fija
              </button>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-soft p-6 text-left max-w-2xl mx-auto shadow-xs">
              {selectedTab === 'recommendation' ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-xl bg-cream-container text-caramel border border-cream-border">
                      <ChefHat className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="text-lg font-bold text-espresso">
                      Modalidad Recomendación
                    </h3>
                  </div>
                  <p className="text-sm text-coffee-muted leading-relaxed">
                    Nuestro motor determinista calcula propuestas balanceadas basadas en tu perfil
                    nutricional (calorías objetivo, distribución de macronutrientes y exclusión estricta
                    de alérgenos). No requiere que elijas cada plato manualmente.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-xl bg-cream-container text-roasted border border-cream-border">
                      <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="text-lg font-bold text-espresso">
                      Modalidad Fija
                    </h3>
                  </div>
                  <p className="text-sm text-coffee-muted leading-relaxed">
                    Tú seleccionas exactamente los platillos y porciones de tus restaurantes favoritos
                    para días específicos de la semana. Coconea te genera la propuesta fielmente
                    en cada ciclo para tu visto bueno.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Regla de Oro: Programar no es comprar */}
        <section id="como-funciona" className="py-16 bg-cream">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
                Nuestra Garantía Ética
              </span>
              <h2 className="text-3xl font-bold text-espresso mt-1">
                La Regla de Oro: «Programar no es comprar»
              </h2>
              <p className="mt-2 text-coffee-muted max-w-xl mx-auto text-sm">
                En Coconea nunca se realizarán cargos sorpresa. Tu confirmación voluntaria es el único
                mecanismo que convierte una propuesta en un pedido real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjeta 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-cream-border shadow-xs hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-container text-caramel mb-4">
                  <Heart className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-espresso mb-2">1. Tus Preferencias</h3>
                <p className="text-xs leading-relaxed text-coffee-muted">
                  Configura restricciones calóricas, intolerancias y alérgenos con rigor. Si un platillo carece de información de ingredientes, nunca se asume seguro.
                </p>
              </div>

              {/* Tarjeta 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-cream-border shadow-xs hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-container text-roasted mb-4">
                  <Calendar className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-espresso mb-2">2. Propuesta Periódica</h3>
                <p className="text-xs leading-relaxed text-coffee-muted">
                  El sistema genera una propuesta cotizada con anticipación. El registro de la ocurrencia jamás inicia un cargo financiero.
                </p>
              </div>

              {/* Tarjeta 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-cream-border shadow-xs hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-container text-espresso mb-4">
                  <ShieldCheck className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-espresso mb-2">3. Confirmación Explícita</h3>
                <p className="text-xs leading-relaxed text-coffee-muted">
                  Solo cuando presionas confirmar se revalidan precios, disponibilidad y cobertura. Si expira o la rechazas, el costo es estrictamente $0.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Interactiva de Propuesta */}
        <section id="demo-propuesta" className="py-16 bg-cream-soft border-t border-cream-border">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
                Interactivo
              </span>
              <h2 className="text-2xl font-bold text-espresso">
                Experimenta el flujo de una propuesta
              </h2>
            </div>

            <div className="rounded-2xl border border-cream-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-cream-border">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
                    Propuesta Diaria #PROP-8421
                  </span>
                  <h3 className="text-lg font-bold text-espresso">
                    Bowl Rústico de Quinoa & Salmón Ahumado
                  </h3>
                </div>
                {proposalStatus === 'pending' && (
                  <span className="rounded-full bg-cream-container px-3 py-1 text-xs font-semibold text-caramel border border-cream-border">
                    Pendiente
                  </span>
                )}
                {proposalStatus === 'confirmed' && (
                  <span className="rounded-full bg-espresso text-cream px-3 py-1 text-xs font-semibold">
                    Confirmada
                  </span>
                )}
                {proposalStatus === 'rejected' && (
                  <span className="rounded-full bg-cream-soft text-coffee-muted px-3 py-1 text-xs font-semibold border border-cream-border">
                    Rechazada
                  </span>
                )}
              </div>

              {/* Detalles nutricionales y restaurante */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-coffee-muted flex items-center gap-1.5">
                    <UtensilsCrossed className="h-4 w-4 text-roasted" strokeWidth={2} />
                    Restaurante
                  </span>
                  <span className="font-medium text-espresso">Bistró Raíces & Grano</span>
                </div>

                {/* Badges de macronutrientes */}
                <div className="rounded-xl bg-cream-container/70 p-3 border border-cream-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-caramel font-semibold">
                    <Flame className="h-4 w-4" strokeWidth={2} />
                    <span>580 kcal</span>
                  </div>
                  <span className="text-roasted font-medium">36g Proteína</span>
                  <span className="text-roasted font-medium">42g Carbs</span>
                  <span className="text-roasted font-medium">18g Grasas</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-coffee-muted flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-roasted" strokeWidth={2} />
                    Horario de entrega
                  </span>
                  <span className="font-medium text-espresso">Hoy entre 13:30 - 14:15 hrs</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-cream-border/60">
                  <span className="text-coffee-muted">Total cotizado (con envío)</span>
                  <span className="font-bold text-espresso text-lg">
                    {formatCurrencyMXN(185.0)}
                  </span>
                </div>
              </div>

              {/* Botones de acción según estado */}
              {proposalStatus === 'pending' && (
                <div className="mt-4 pt-4 border-t border-cream-border flex flex-col sm:flex-row gap-3">
                  <button
                    id="btn-confirm-proposal"
                    onClick={() => setProposalStatus('confirmed')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-espresso py-3 text-sm font-semibold text-white hover:bg-espresso-light active:bg-espresso-dark transition shadow-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-mocha-light" strokeWidth={2} />
                    Confirmar y Ordenar
                  </button>
                  <button
                    id="btn-reject-proposal"
                    onClick={() => setProposalStatus('rejected')}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-cream-border px-5 py-3 text-sm font-medium text-roasted hover:bg-cream-container transition"
                  >
                    <XCircle className="h-4 w-4" strokeWidth={2} />
                    Rechazar
                  </button>
                </div>
              )}

              {proposalStatus === 'confirmed' && (
                <div className="mt-4 pt-4 border-t border-cream-border rounded-xl bg-cream-container p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-espresso font-semibold mb-1">
                    <Check className="h-5 w-5 text-caramel" strokeWidth={2} />
                    <span>¡Pedido generado exitosamente!</span>
                  </div>
                  <p className="text-xs text-coffee-muted mb-3">
                    Se validó la disponibilidad y el restaurante ya está preparando tu menú.
                  </p>
                  <button
                    onClick={() => setProposalStatus('pending')}
                    className="text-xs text-caramel underline font-medium hover:text-espresso"
                  >
                    Reiniciar simulación
                  </button>
                </div>
              )}

              {proposalStatus === 'rejected' && (
                <div className="mt-4 pt-4 border-t border-cream-border rounded-xl bg-cream-soft p-4 text-center">
                  <p className="text-xs text-coffee-muted mb-2">
                    Has rechazado esta propuesta. No se ha generado ningún pedido ni cobro ($0 MXN).
                  </p>
                  <button
                    onClick={() => setProposalStatus('pending')}
                    className="text-xs text-caramel underline font-medium hover:text-espresso"
                  >
                    Volver a ver propuesta
                  </button>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-coffee-muted flex items-center justify-center gap-1">
                <Info className="h-3.5 w-3.5 text-caramel" strokeWidth={2} />
                <span>Si no confirmas antes de las 11:30 AM, expirará automáticamente sin costo.</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-border bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-muted">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-espresso text-cream flex items-center justify-center font-bold text-xs">
              C
            </span>
            <p>© 2026 Coconea — Presupuesto objetivo $0 MXN.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Next.js + React</span>
            <span>·</span>
            <span>NestJS API</span>
            <span>·</span>
            <span>PostgreSQL</span>
            <span>·</span>
            <span>Paleta Café & Crema</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
