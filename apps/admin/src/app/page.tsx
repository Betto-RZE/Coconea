import React from 'react';
import { ShieldAlert, BarChart3, Users, Store, DollarSign, Activity } from 'lucide-react';
import { PROJECT_NAME, formatCurrencyMXN } from '@coconea/shared';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{PROJECT_NAME} Administración</h1>
            <p className="text-xs text-slate-500">Métricas globales, auditoría y control de plataforma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
            Ambiente Local ($0 MXN)
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-sm">
              <span>Volumen Transaccionado</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrencyMXN(12480.00)}</p>
            <p className="mt-1 text-xs text-slate-400">Simulador MockPaymentProvider</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-sm">
              <span>Restaurantes Activos</span>
              <Store className="h-4 w-4 text-orange-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
            <p className="mt-1 text-xs text-slate-400">100% menús auditados</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-sm">
              <span>Consumidores Registrados</span>
              <Users className="h-4 w-4 text-sky-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">254</p>
            <p className="mt-1 text-xs text-slate-400">Better Auth con RBAC</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-sm">
              <span>Propuestas Programadas</span>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">89</p>
            <p className="mt-1 text-xs text-emerald-600">82% confirmación voluntaria</p>
          </div>
        </div>

        {/* Auditoría y Reglas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Panel de Seguridad y Cumplimiento</h2>
            <span className="text-xs text-slate-500">Auditoría inmutable</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-sm text-slate-700 space-y-2">
            <p className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Regla de Autorización:</strong> Los permisos de administrador nunca sustituyen la confirmación explícita del consumidor.
              </span>
            </p>
            <p className="text-xs text-slate-500 pl-6">
              Toda transacción financiera simulada y cambio de estado queda asentado en logs Pino y base de datos PostgreSQL.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
