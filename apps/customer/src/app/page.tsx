import React from 'react';
import { PROJECT_NAME, PROJECT_MOTTO, formatCurrencyMXN } from '@coconea/shared';
import { Utensils, Calendar, ShieldCheck, Heart, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export default function CustomerHome() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Barra de Navegación */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-bold text-xl shadow-sm">
              C
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">{PROJECT_NAME}</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                Consumidor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Iniciar Sesión
            </button>
            <button
              id="btn-register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              Comenzar Plan
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 mb-6 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Programación recurrente con confirmación explícita</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Alimentación personalizada <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                sin sorpresas ni cobros automáticos
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
              {PROJECT_MOTTO}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo-propuesta"
                className="rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-emerald-500 transition flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Explorar Programaciones
              </a>
              <a
                href="#como-funciona"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>
        </section>

        {/* Regla de Oro: Programar no es comprar */}
        <section id="como-funciona" className="py-12 border-y border-slate-200/80 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">1. Tus Preferencias</h2>
                <p className="text-sm text-slate-600">
                  Define objetivos calóricos, distribución de macros y exclusión de alérgenos con rigor nutricional.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">2. Propuesta Periódica</h2>
                <p className="text-sm text-slate-600">
                  Generamos una propuesta según tu modalidad (Fija o Recomendación). Programar nunca genera un cargo inmediato.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">3. Confirmación Explícita</h2>
                <p className="text-sm text-slate-600">
                  Solo cuando confirmas voluntariamente se revalida la cotización y se crea el pedido.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Interactiva de Propuesta */}
        <section id="demo-propuesta" className="py-16 bg-slate-50">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Propuesta Semanal Activa
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Almuerzo Nutritivo Balanceado</h3>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  Pendiente de Confirmación
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Restaurante</span>
                  <span className="font-medium text-slate-900">Green Bowl Cocina Saludable</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Macros estimadas</span>
                  <span className="font-medium text-slate-900">550 kcal · 38g Proteína · 45g Carbs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total cotizado</span>
                  <span className="font-bold text-slate-900 text-base">{formatCurrencyMXN(165.50)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                <button
                  id="btn-confirm-proposal"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirmar y Pedir
                </button>
                <button
                  id="btn-reject-proposal"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-slate-400">
                Si no confirmas antes de las 10:00 AM, la propuesta expirará sin ningún costo.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Coconea. Proyecto de portafolio profesional — Presupuesto objetivo $0 MXN.</p>
          <div className="flex gap-4">
            <span>Next.js + React</span>
            <span>·</span>
            <span>NestJS API</span>
            <span>·</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
