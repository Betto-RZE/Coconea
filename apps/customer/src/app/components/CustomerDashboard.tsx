'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Sparkles, Bell, ArrowRight, Home, Compass, User, Flame } from 'lucide-react';
import { formatCurrencyMXN } from '@coconea/shared';

interface CustomerDashboardProps {
  nombre: string;
  rol: string;
  onConfirmProposal: () => void;
}

export default function CustomerDashboard({ nombre, rol, onConfirmProposal }: CustomerDashboardProps) {
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
    <div className="flex-1 flex flex-col bg-[#FDFBF7] text-slate-900 pb-20">
      
      {/* Contenedor principal estilo app móvil optimizado */}
      <div className="max-w-md mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* Cabecera con Saludo y Notificación */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              ¡Hola, {nombre}! 👋
            </h1>
            <p className="text-xs font-semibold text-amber-900/70 mt-0.5">
              Martes, 24 de Octubre · <span className="text-amber-800 font-bold">Tu plan marcha al 100%</span>
            </p>
          </div>
          <button className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 transition">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-700"></span>
          </button>
        </div>

        {/* Selector de Días de la Semana */}
        <div className="grid grid-cols-5 gap-2">
          {diasSemana.map((item) => {
            const activo = diaSeleccionado === item.fecha;
            return (
              <button
                key={item.fecha}
                onClick={() => setDiaSeleccionado(item.fecha)}
                className={`flex flex-col items-center justify-center py-3 rounded-2xl transition border ${
                  activo
                    ? 'bg-[#43281C] text-white border-[#43281C] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${activo ? 'text-amber-200/80' : 'text-slate-400'}`}>
                  {item.dia}
                </span>
                <span className="text-lg font-black mt-0.5">{item.fecha}</span>
                <span className={`h-1 w-1 rounded-full mt-1 ${activo ? 'bg-amber-400' : 'bg-slate-300'}`}></span>
              </button>
            );
          })}
        </div>

        {/* Widget de Entrega Programada */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100/60 flex items-center justify-center text-amber-800 font-bold">
              🚚
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Entrega Programada
              </span>
              <p className="text-xs font-semibold text-slate-700">
                Tu entrega de mañana llegará entre <strong className="text-slate-900">7:30 AM y 8:00 AM</strong>.
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>

        {/* Tarjeta de Balance Nutricional */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">Balance Nutricional</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-900">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
              Meta Saludable
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Gráfico circular simulado */}
            <div className="relative flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border-8 border-slate-100 border-t-[#43281C] flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">84%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">del día</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">1,850</span>
                  <span className="text-xs font-semibold text-slate-400">/ 2,200</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kcal Consumidas</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/40 text-xs font-bold text-amber-900">
                <Flame className="h-3.5 w-3.5 text-amber-700" />
                Restan 350 kcal
              </div>
            </div>
          </div>

          {/* Macros (Prot, Carb, Grasas) */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">PROT</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#43281C]"></span>
              </div>
              <p className="text-sm font-black text-slate-900">140g</p>
              <span className="text-[10px] font-medium text-slate-400">de 160g</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#43281C] h-full w-[85%]"></div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CARB</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#43281C]"></span>
              </div>
              <p className="text-sm font-black text-slate-900">180g</p>
              <span className="text-[10px] font-medium text-slate-400">de 210g</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#43281C] h-full w-[80%]"></div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">GRASAS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#43281C]"></span>
              </div>
              <p className="text-sm font-black text-slate-900">55g</p>
              <span className="text-[10px] font-medium text-slate-400">de 65g</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#43281C] h-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Comidas de Hoy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Comidas de Hoy</h2>
              <p className="text-xs text-slate-500">Seleccionadas y balanceadas para ti</p>
            </div>
            <button className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
              Ver agenda <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Desayuno', 'Comida', 'Cena', 'Snacks'].map((tipo) => {
              const activo = comidaSeleccionada === tipo;
              return (
                <button
                  key={tipo}
                  onClick={() => setComidaSeleccionada(tipo)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition border whitespace-nowrap ${
                    activo
                      ? 'bg-[#43281C] text-white border-[#43281C]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {activo && <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5"></span>}
                  {tipo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Propuesta Activa con tus botones originales */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Propuesta Semanal Activa
              </span>
              <h3 className="text-base font-bold text-slate-900">Almuerzo Nutritivo Balanceado</h3>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-800 border border-amber-200/60">
              Pendiente
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Restaurante</span>
              <span className="font-semibold text-slate-900">Green Bowl Cocina Saludable</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Macros estimadas</span>
              <span className="font-semibold text-slate-900">550 kcal · 38g Proteína</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Total cotizado</span>
              <span className="font-black text-slate-900">{formatCurrencyMXN(165.50)}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={onConfirmProposal}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#43281C] py-3 text-xs font-bold text-white hover:bg-[#2e1b12] transition shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              Confirmar y Pedir
            </button>
            <button
              onClick={() => alert("Propuesta rechazada.")}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </button>
          </div>
        </div>

      </div>

      {/* Barra de Navegación Inferior Estilo App Móvil */}
      <nav aria-label="Navegación inferior" className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-2.5 px-6 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs font-bold text-slate-400">
          <button className="flex flex-col items-center gap-1 text-[#43281C]">
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-slate-700 transition">
            <Calendar className="h-5 w-5" />
            <span>Agenda</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-slate-700 transition">
            <Compass className="h-5 w-5" />
            <span>Explorar</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-slate-700 transition">
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </button>
        </div>
      </nav>

    </div>
  );
}