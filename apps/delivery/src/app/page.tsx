import React from 'react';
import { Bike, Navigation, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { PROJECT_NAME } from '@coconea/shared';

export default function DeliveryDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-bold">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">{PROJECT_NAME} Repartidor</h1>
            <span className="text-xs text-sky-700 font-medium">Turno Activo</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            En Ruta
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        {/* Pedido Activo */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Entrega en Curso
              </span>
              <h2 className="text-base font-bold text-slate-900">Orden #ORD-2026-081</h2>
            </div>
            <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 border border-sky-200">
              1.8 km restante
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Recolección: Green Bowl</p>
                <p className="text-xs text-slate-500">Av. Insurgentes Sur 420 (Completado)</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Navigation className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Destino: Cliente María González</p>
                <p className="text-xs text-slate-500">Calle Durango 154, Int 3B, Roma Norte</p>
              </div>
            </div>
          </div>

          {/* Confirmación con PIN según regla de negocio */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label htmlFor="pin-input" className="block text-xs font-medium text-slate-600">
              Código PIN de Confirmación (Proporcionado por el cliente)
            </label>
            <div className="flex gap-2">
              <input
                id="pin-input"
                type="text"
                maxLength={6}
                placeholder="Ej. 4829"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-center text-base tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                id="btn-confirm-delivery"
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                Validar
              </button>
            </div>
            <p className="text-xs text-slate-400">
              El PIN confirma la recepción física y cierra la entrega en la plataforma.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
