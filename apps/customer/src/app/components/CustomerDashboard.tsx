'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bell,
  ArrowRight,
  Flame,
  ChefHat,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatCurrencyMXN } from '@coconea/shared';

interface CustomerDashboardProps {
  nombre: string;
  rol?: string;
  dietaryPreference?: string;
  proposalStatus?: 'pending' | 'confirmed' | 'rejected';
  orderId?: string | null;
  onConfirmProposal?: () => void;
  onRejectProposal?: () => void;
  onNavigateTab?: (tab: 'inicio' | 'propuesta' | 'modalidad' | 'garantia' | 'cuenta') => void;
}

export default function CustomerDashboard({
  nombre,
  rol = 'CONSUMER',
  dietaryPreference = 'Plan Equilibrado',
  proposalStatus = 'pending',
  orderId = null,
  onConfirmProposal,
  onRejectProposal,
  onNavigateTab,
}: CustomerDashboardProps) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(24);
  const [comidaSeleccionada, setComidaSeleccionada] = useState('Comida');

  const diasSemana = [
    { dia: 'LUN', fecha: 23 },
    { dia: 'MAR', fecha: 24 },
    { dia: 'MIÉ', fecha: 25 },
    { dia: 'JUE', fecha: 26 },
    { dia: 'VIE', fecha: 27 },
  ];

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* Cabecera con Saludo y Notificación */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-espresso">
            ¡Hola, {nombre}! 👋
          </h1>
          <p className="text-xs font-semibold text-coffee-muted mt-0.5">
            Martes, 24 de Octubre · <span className="text-caramel font-bold">Tu plan marcha al 100%</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab?.('cuenta')}
          className="relative p-2.5 rounded-2xl bg-white/95 border border-cream-border/90 shadow-2xs hover:bg-cream-container/50 transition cursor-pointer"
          title="Ver perfil y notificaciones"
        >
          <Bell className="h-4 w-4 text-espresso" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-caramel ring-2 ring-white"></span>
        </button>
      </div>

      {/* Selector de Días de la Semana */}
      <div className="grid grid-cols-5 gap-2">
        {diasSemana.map((item) => {
          const activo = diaSeleccionado === item.fecha;
          return (
            <button
              key={item.fecha}
              type="button"
              onClick={() => setDiaSeleccionado(item.fecha)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition border cursor-pointer ${
                activo
                  ? 'bg-espresso text-white border-espresso shadow-xs scale-[1.02]'
                  : 'bg-white/95 text-espresso border-cream-border/90 hover:bg-cream-container/50'
              }`}
            >
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  activo ? 'text-caramel-light' : 'text-coffee-muted'
                }`}
              >
                {item.dia}
              </span>
              <span className="text-base font-black mt-0.5">{item.fecha}</span>
              <span
                className={`h-1 w-1 rounded-full mt-1 ${
                  activo ? 'bg-caramel' : 'bg-cream-border'
                }`}
              ></span>
            </button>
          );
        })}
      </div>

      {/* Widget de Entrega Programada */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/95 border border-cream-border/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cream-container border border-cream-border flex items-center justify-center text-caramel font-bold text-base">
            🚚
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-caramel">
              Entrega Programada
            </span>
            <p className="text-xs font-semibold text-espresso">
              Tu entrega de mañana llegará entre{' '}
              <strong className="text-espresso font-black">7:30 AM y 8:00 AM</strong>.
            </p>
          </div>
        </div>
        <Clock className="h-4 w-4 text-coffee-muted flex-shrink-0" />
      </div>

      {/* Tarjeta de Balance Nutricional */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-cream-border/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-espresso">Balance Nutricional</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cream-container border border-cream-border text-[10px] font-bold text-roasted">
            <span className="h-1.5 w-1.5 rounded-full bg-caramel"></span>
            {dietaryPreference}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Gráfico circular artesanal */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="h-20 w-20 rounded-full border-6 border-cream-container border-t-espresso border-r-caramel flex flex-col items-center justify-center">
              <span className="text-lg font-black text-espresso">84%</span>
              <span className="text-[8px] font-bold text-coffee-muted uppercase tracking-wider">
                del día
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-espresso">1,850</span>
                <span className="text-xs font-semibold text-coffee-muted">/ 2,200</span>
              </div>
              <span className="text-[10px] font-bold text-coffee-muted uppercase tracking-wider">
                Kcal Consumidas
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cream-container border border-cream-border text-xs font-bold text-espresso">
              <Flame className="h-3.5 w-3.5 text-caramel" />
              <span>Restan 350 kcal</span>
            </div>
          </div>
        </div>

        {/* Macros (Prot, Carb, Grasas) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-cream-container/50 border border-cream-border/80 space-y-1 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-coffee-muted uppercase">PROT</span>
              <span className="h-1.5 w-1.5 rounded-full bg-espresso"></span>
            </div>
            <p className="text-xs font-black text-espresso">140g</p>
            <span className="text-[9px] font-medium text-coffee-muted">de 160g</span>
            <div className="w-full bg-white h-1.5 rounded-full mt-1 overflow-hidden border border-cream-border/50">
              <div className="bg-espresso h-full w-[85%] rounded-full"></div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-cream-container/50 border border-cream-border/80 space-y-1 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-coffee-muted uppercase">CARB</span>
              <span className="h-1.5 w-1.5 rounded-full bg-caramel"></span>
            </div>
            <p className="text-xs font-black text-espresso">180g</p>
            <span className="text-[9px] font-medium text-coffee-muted">de 210g</span>
            <div className="w-full bg-white h-1.5 rounded-full mt-1 overflow-hidden border border-cream-border/50">
              <div className="bg-caramel h-full w-[80%] rounded-full"></div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-cream-container/50 border border-cream-border/80 space-y-1 text-center">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-coffee-muted uppercase">GRASAS</span>
              <span className="h-1.5 w-1.5 rounded-full bg-roasted"></span>
            </div>
            <p className="text-xs font-black text-espresso">55g</p>
            <span className="text-[9px] font-medium text-coffee-muted">de 65g</span>
            <div className="w-full bg-white h-1.5 rounded-full mt-1 overflow-hidden border border-cream-border/50">
              <div className="bg-roasted h-full w-[85%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Comidas de Hoy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-espresso">Comidas de Hoy</h2>
            <p className="text-[11px] text-coffee-muted">Seleccionadas y balanceadas para ti</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab?.('propuesta')}
            className="text-xs font-bold text-caramel hover:text-espresso flex items-center gap-1 transition cursor-pointer"
          >
            Ver propuesta <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['Desayuno', 'Comida', 'Cena', 'Snacks'].map((tipo) => {
            const activo = comidaSeleccionada === tipo;
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => setComidaSeleccionada(tipo)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border whitespace-nowrap cursor-pointer ${
                  activo
                    ? 'bg-espresso text-white border-espresso shadow-xs'
                    : 'bg-white/95 text-coffee-muted border-cream-border/90 hover:bg-cream-container/50'
                }`}
              >
                {activo && <span className="inline-block h-1.5 w-1.5 rounded-full bg-caramel mr-1.5"></span>}
                {tipo}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Propuesta Activa con acciones */}
      <div className="rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-cream-border">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-caramel">
              Propuesta Semanal Activa
            </span>
            <h3 className="text-sm font-bold text-espresso">Almuerzo Nutritivo Balanceado</h3>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
              proposalStatus === 'confirmed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : proposalStatus === 'rejected'
                ? 'bg-stone-100 text-stone-600 border-stone-200'
                : 'bg-cream-container text-espresso border-cream-border'
            }`}
          >
            {proposalStatus === 'confirmed'
              ? 'Confirmada'
              : proposalStatus === 'rejected'
              ? 'Rechazada'
              : 'Pendiente'}
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-coffee-muted">Restaurante</span>
            <span className="font-semibold text-espresso">Green Bowl Cocina Saludable</span>
          </div>
          <div className="flex justify-between">
            <span className="text-coffee-muted">Macros estimadas</span>
            <span className="font-semibold text-espresso">550 kcal · 38g Proteína</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-cream-border">
            <span className="text-coffee-muted font-medium">Total cotizado</span>
            <span className="font-black text-espresso">{formatCurrencyMXN(165.5)}</span>
          </div>
        </div>

        {orderId && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Pedido registrado en API SQLite: <strong>{orderId}</strong></span>
          </div>
        )}

        {proposalStatus === 'pending' ? (
          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={onConfirmProposal}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-espresso py-2.5 text-xs font-bold text-white hover:bg-espresso-light active:bg-espresso-dark transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-caramel-light" />
              <span>Confirmar y Pedir</span>
            </button>
            <button
              type="button"
              onClick={onRejectProposal}
              className="flex items-center justify-center gap-1 rounded-full border border-cream-border bg-white px-4 py-2.5 text-xs font-semibold text-coffee-muted hover:bg-cream-container/50 transition cursor-pointer"
            >
              <XCircle className="h-4 w-4" />
              <span>Rechazar</span>
            </button>
          </div>
        ) : proposalStatus === 'confirmed' ? (
          <div className="p-2.5 rounded-2xl bg-cream-container border border-cream-border text-center text-xs text-espresso font-medium">
            ✨ Propuesta confirmada para mañana. Tu comida llegará entre 7:30 y 8:00 AM.
          </div>
        ) : (
          <div className="p-2.5 rounded-2xl bg-cream-container/50 border border-cream-border text-center text-xs text-coffee-muted">
            Has rechazado esta propuesta. No se generará ningún cobro ni envío.
          </div>
        )}
      </div>
    </div>
  );
}
