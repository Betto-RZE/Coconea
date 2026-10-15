import React from 'react';
import { ChefHat, Clock, AlertTriangle, CheckCircle, PackageCheck, UtensilsCrossed } from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

export default function RestaurantDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white font-bold">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{PROJECT_NAME} Restaurante</h1>
            <p className="text-xs text-stone-500">Monitor de cocina y catálogo de alérgenos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Cocina en Línea
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Por Preparar</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-stone-900">3</p>
            <p className="mt-1 text-xs text-amber-600">Tiempo objetivo: 20 min</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">En Preparación</span>
              <UtensilsCrossed className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-stone-900">2</p>
            <p className="mt-1 text-xs text-stone-500">Chefs asignados</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Listos para Repartidor</span>
              <PackageCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-stone-900">1</p>
            <p className="mt-1 text-xs text-emerald-600">Esperando recolección</p>
          </div>
        </div>

        {/* Órdenes activas en cocina */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>Órdenes Confirmadas en Cocina</span>
          </h2>

          <div className="divide-y divide-stone-100">
            <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-base">Orden #ORD-2026-081</span>
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
                    En Preparación
                  </span>
                </div>
                <p className="text-sm text-stone-600">
                  1x Bowl Salmón Quinoa (Keto) · 1x Ensalada Proteica Sin Maní
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-flex border border-amber-200">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Restricción declarada por cliente: Alergia severa a frutos secos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-900">{formatCurrencyMXN(230.00)}</span>
                <button
                  id="btn-ready-order"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar Listo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
