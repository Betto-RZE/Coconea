'use client';

import React, { useState } from 'react';
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
  ArrowRight,
  Info,
  Check,
  ChefHat,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import CustomerDashboard from '@/app/components/CustomerDashboard';

export default function CustomerHome() {
  const [selectedTab, setSelectedTab] = useState<'recommendation' | 'fixed'>('recommendation');
  const [proposalStatus, setProposalStatus] = useState<'pending' | 'confirmed' | 'rejected'>('pending');

  // Estados de Modales
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  // Estado del usuario activo
  const [usuarioActivo, setUsuarioActivo] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  // Estados para Registro
  const [nombreReg, setNombreReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [telefonoReg, setTelefonoReg] = useState('');
  const [direccionReg, setDireccionReg] = useState('');
  const [rolReg, setRolReg] = useState('CONSUMER');
  const [loadingReg, setLoadingReg] = useState(false);
  const [mensajeReg, setMensajeReg] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  // Estados para Login
  const [emailLog, setEmailLog] = useState('');
  const [passwordLog, setPasswordLog] = useState('');
  const [loadingLog, setLoadingLog] = useState(false);
  const [mensajeLog, setMensajeLog] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreReg || !emailReg || !passwordReg) {
      setMensajeReg({ texto: 'Por favor completa al menos los campos obligatorios', tipo: 'error' });
      return;
    }

    if (passwordReg.length < 8 || passwordReg.length > 16) {
      setMensajeReg({ texto: 'La contraseña debe tener entre 8 y 16 caracteres', tipo: 'error' });
      return;
    }

    setLoadingReg(true);
    setMensajeReg(null);

    try {
      const response = await fetch('http://localhost:4000/v1/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreReg,
          email: emailReg,
          passwordHash: passwordReg,
          telefono: telefonoReg,
          direccion: direccionReg,
          rol: rolReg,
        }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn('Respuesta de registro no es un JSON válido:', text);
      }

      if (!response.ok) {
        throw new Error(data.message || `Error en el servidor al registrar (${response.status})`);
      }

      setMensajeReg({ texto: `¡${rolReg} registrado con éxito! ID: ${data.id || 'N/A'}`, tipo: 'success' });
      setNombreReg('');
      setEmailReg('');
      setPasswordReg('');
      setTelefonoReg('');
      setDireccionReg('');
    } catch (error: any) {
      console.error(error);
      setMensajeReg({ texto: error.message || 'Error en el servidor o correo duplicado', tipo: 'error' });
    } finally {
      setLoadingReg(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLog || !passwordLog) {
      setMensajeLog({ texto: 'Por favor ingresa correo y contraseña', tipo: 'error' });
      return;
    }

    setLoadingLog(true);
    setMensajeLog(null);

    try {
      const response = await fetch('http://localhost:4000/v1/usuarios');
      if (!response.ok) throw new Error('No se pudo conectar con la base de datos');

      const text = await response.text();
      if (!text) throw new Error('La API respondió sin datos');

      const usuarios = JSON.parse(text);
      const usuarioEncontrado = usuarios.find(
        (u: any) => u.email === emailLog && u.passwordHash === passwordLog
      );

      if (!usuarioEncontrado) {
        throw new Error('Correo o contraseña incorrectos en SQLite');
      }

      const rol = usuarioEncontrado.rol || 'CONSUMER';
      setMensajeLog({ texto: `¡Bienvenido, ${usuarioEncontrado.nombre}! Redirigiendo...`, tipo: 'success' });

      setTimeout(() => {
        switch (rol) {
          case 'RESTAURANT':
            window.location.href = 'http://localhost:3001';
            break;
          case 'DELIVERY':
            window.location.href = 'http://localhost:3002';
            break;
          case 'ADMIN':
            window.location.href = 'http://localhost:3003';
            break;
          case 'CONSUMER':
          default:
            setUsuarioActivo({
              nombre: usuarioEncontrado.nombre,
              email: usuarioEncontrado.email,
              rol: rol,
            });
            setMostrarModalLogin(false);
            setMensajeLog(null);
            setEmailLog('');
            setPasswordLog('');
            break;
        }
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setMensajeLog({ texto: error.message || 'Error al iniciar sesión', tipo: 'error' });
    } finally {
      setLoadingLog(false);
    }
  };

  const handleConfirmProposal = async () => {
    try {
      const response = await fetch('http://localhost:4000/v1/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'PROGRAMADO', total: 185.0 }),
      });
      if (!response.ok) throw new Error('Error al crear pedido');
      setProposalStatus('confirmed');
    } catch (error) {
      console.error(error);
      alert('Error al conectar con la API para guardar el pedido.');
    }
  };

  if (usuarioActivo) {
    return (
      <CustomerDashboard
        nombre={usuarioActivo.nombre}
        rol={usuarioActivo.rol}
        onConfirmProposal={handleConfirmProposal}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50/30 text-stone-900">
      {/* Barra de Navegación */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-amber-50 font-bold text-xl shadow-sm">
              C
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900">{PROJECT_NAME}</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
                Portal de Acceso
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarModalLogin(true)}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setMostrarModalRegistro(true)}
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-stone-800 active:bg-stone-950 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Comenzar Plan</span>
              <ArrowRight className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-stone-50 py-16 sm:py-24 border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-900 mb-6 border border-amber-200 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" strokeWidth={2} />
              <span>Programación recurrente con confirmación explícita</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
              Alimentación personalizada <br className="hidden sm:block" />
              <span className="text-amber-700 font-black">
                sin sorpresas ni cobros automáticos
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed font-normal">
              {PROJECT_MOTTO}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo-propuesta"
                className="rounded-full bg-stone-900 px-7 py-3.5 text-base font-semibold text-white shadow-md hover:bg-stone-800 transition flex items-center gap-2.5"
              >
                <Calendar className="h-5 w-5 text-amber-200" strokeWidth={2} />
                Explorar Propuesta de Hoy
              </a>
              <a
                href="#como-funciona"
                className="rounded-full border border-stone-300 bg-white px-7 py-3.5 text-base font-medium text-stone-700 hover:bg-stone-50 transition shadow-xs"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>
        </section>

        {/* Modalidades Recurrentes (Tabs) */}
        <section className="py-12 bg-white border-b border-stone-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Modalidades de Programación
            </span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-6">
              Elige cómo planificar tu comida diaria
            </h2>

            <div className="inline-flex p-1.5 rounded-full bg-stone-100 border border-stone-200 mb-8">
              <button
                type="button"
                onClick={() => setSelectedTab('recommendation')}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  selectedTab === 'recommendation'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Recomendación Inteligente
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('fixed')}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  selectedTab === 'fixed'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Selección Fija
              </button>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-amber-50/40 p-6 text-left max-w-2xl mx-auto shadow-xs">
              {selectedTab === 'recommendation' ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                      <ChefHat className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">
                      Modalidad Recomendación
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Nuestro motor determinista calcula propuestas balanceadas basadas en tu perfil
                    nutricional (calorías objetivo, distribución de macronutrientes y exclusión estricta
                    de alérgenos). No requiere que elijas cada plato manualmente.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                      <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">
                      Modalidad Fija
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Tú seleccionas exactamente los platillos y porciones de tus restaurantes favoritos
                    para días específicos de la semana. Coconea te genera la propuesta fielmente
                    en cada ciclo para tu visto bueno.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Regla de Oro */}
        <section id="como-funciona" className="py-16 bg-amber-50/20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Nuestra Garantía Ética
              </span>
              <h2 className="text-3xl font-bold text-stone-900 mt-1">
                La Regla de Oro: «Programar no es comprar»
              </h2>
              <p className="mt-2 text-stone-600 max-w-xl mx-auto text-sm">
                En Coconea nunca se realizarán cargos sorpresa. Tu confirmación voluntaria es el único
                mecanismo que convierte una propuesta en un pedido real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
                  <Heart className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">1. Tus Preferencias</h3>
                <p className="text-xs leading-relaxed text-stone-600">
                  Configura restricciones calóricas, intolerancias y alérgenos con rigor. Si un platillo carece de información de ingredientes, nunca se asume seguro.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
                  <Calendar className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">2. Propuesta Periódica</h3>
                <p className="text-xs leading-relaxed text-stone-600">
                  El sistema genera una propuesta cotizada con anticipación. El registro de la ocurrencia jamás inicia un cargo financiero.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
                  <ShieldCheck className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">3. Confirmación Explícita</h3>
                <p className="text-xs leading-relaxed text-stone-600">
                  Solo cuando presionas confirmar se revalidan precios, disponibilidad y cobertura. Si expira o la rechazas, el costo es estrictamente $0.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Interactiva */}
        <section id="demo-propuesta" className="py-16 bg-white border-t border-stone-200">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Interactivo
              </span>
              <h2 className="text-2xl font-bold text-stone-900">
                Experimenta el flujo de una propuesta
              </h2>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Propuesta Diaria #PROP-8421
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">
                    Bowl Rústico de Quinoa & Salmón Ahumado
                  </h3>
                </div>
                {proposalStatus === 'pending' && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                    Pendiente
                  </span>
                )}
                {proposalStatus === 'confirmed' && (
                  <span className="rounded-full bg-stone-900 text-white px-3 py-1 text-xs font-semibold">
                    Confirmada
                  </span>
                )}
                {proposalStatus === 'rejected' && (
                  <span className="rounded-full bg-stone-200 text-stone-700 px-3 py-1 text-xs font-semibold">
                    Rechazada
                  </span>
                )}
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-600 flex items-center gap-1.5">
                    <UtensilsCrossed className="h-4 w-4 text-stone-500" strokeWidth={2} />
                    Restaurante
                  </span>
                  <span className="font-medium text-stone-900">Bistró Raíces & Grano</span>
                </div>

                <div className="rounded-xl bg-amber-100/60 p-3 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                    <Flame className="h-4 w-4" strokeWidth={2} />
                    <span>580 kcal</span>
                  </div>
                  <span className="text-stone-700 font-medium">36g Proteína</span>
                  <span className="text-stone-700 font-medium">42g Carbs</span>
                  <span className="text-stone-700 font-medium">18g Grasas</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-600 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-stone-500" strokeWidth={2} />
                    Horario de entrega
                  </span>
                  <span className="font-medium text-stone-900">Hoy entre 13:30 - 14:15 hrs</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-stone-200">
                  <span className="text-stone-600">Total cotizado (con envío)</span>
                  <span className="font-bold text-stone-900 text-lg">
                    {formatCurrencyMXN(185.0)}
                  </span>
                </div>
              </div>

              {proposalStatus === 'pending' && (
                <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                  <button
                    id="btn-confirm-proposal"
                    onClick={handleConfirmProposal}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 text-amber-300" strokeWidth={2} />
                    Confirmar y Ordenar
                  </button>
                  <button
                    id="btn-reject-proposal"
                    onClick={() => setProposalStatus('rejected')}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" strokeWidth={2} />
                    Rechazar
                  </button>
                </div>
              )}

              {proposalStatus === 'confirmed' && (
                <div className="mt-4 pt-4 border-t border-stone-200 rounded-xl bg-amber-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-stone-900 font-semibold mb-1">
                    <Check className="h-5 w-5 text-amber-700" strokeWidth={2} />
                    <span>¡Pedido generado exitosamente!</span>
                  </div>
                  <p className="text-xs text-stone-600 mb-3">
                    Se validó la disponibilidad y el restaurante ya está preparando tu menú.
                  </p>
                  <button
                    onClick={() => setProposalStatus('pending')}
                    className="text-xs text-amber-800 underline font-medium hover:text-stone-950 cursor-pointer"
                  >
                    Reiniciar simulación
                  </button>
                </div>
              )}

              {proposalStatus === 'rejected' && (
                <div className="mt-4 pt-4 border-t border-stone-200 rounded-xl bg-stone-100 p-4 text-center">
                  <p className="text-xs text-stone-600 mb-2">
                    Has rechazado esta propuesta. No se ha generado ningún pedido ni cobro ($0 MXN).
                  </p>
                  <button
                    onClick={() => setProposalStatus('pending')}
                    className="text-xs text-amber-800 underline font-medium hover:text-stone-950 cursor-pointer"
                  >
                    Volver a ver propuesta
                  </button>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-stone-500 flex items-center justify-center gap-1">
                <Info className="h-3.5 w-3.5 text-amber-700" strokeWidth={2} />
                <span>Si no confirmas antes de las 11:30 AM, expirará automáticamente sin costo.</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Registro */}
      {mostrarModalRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMostrarModalRegistro(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Crear Cuenta en Coconea</h3>
              <p className="text-xs text-stone-500">Registra tus datos según tu rol en la plataforma</p>
            </div>

            {mensajeReg && (
              <div
                className={`mb-3 p-2.5 rounded-xl text-xs font-medium ${
                  mensajeReg.tipo === 'success'
                    ? 'bg-amber-50 text-stone-900 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {mensajeReg.texto}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Tipo de Rol
                </label>
                <select
                  value={rolReg}
                  onChange={(e) => setRolReg(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none bg-white"
                >
                  <option value="CONSUMER">Cliente / Consumidor</option>
                  <option value="RESTAURANT">Restaurante</option>
                  <option value="DELIVERY">Repartidor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombreReg}
                  onChange={(e) => setNombreReg(e.target.value)}
                  placeholder="Tu nombre o negocio"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={emailReg}
                  onChange={(e) => setEmailReg(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefonoReg}
                  onChange={(e) => setTelefonoReg(e.target.value)}
                  placeholder="+52 222 123 4567"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionReg}
                  onChange={(e) => setDireccionReg(e.target.value)}
                  placeholder="Calle, número, colonia"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Contraseña (8 a 16 caracteres)
                </label>
                <input
                  type="password"
                  value={passwordReg}
                  onChange={(e) => setPasswordReg(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  maxLength={16}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingReg}
                className="w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-stone-800 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loadingReg && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                Registrarse
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Iniciar Sesión */}
      {mostrarModalLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl relative">
            <button
              onClick={() => setMostrarModalLogin(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Iniciar Sesión</h3>
              <p className="text-xs text-stone-500">Accede a tu cuenta de Coconea</p>
            </div>

            {mensajeLog && (
              <div
                className={`mb-3 p-2.5 rounded-xl text-xs font-medium ${
                  mensajeLog.tipo === 'success'
                    ? 'bg-amber-50 text-stone-900 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {mensajeLog.texto}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={emailLog}
                  onChange={(e) => setEmailLog(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-700 uppercase mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={passwordLog}
                  onChange={(e) => setPasswordLog(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLog}
                className="w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-stone-800 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loadingLog && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                Entrar al Sistema
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-stone-900 text-amber-50 flex items-center justify-center font-bold text-xs">
              C
            </span>
            <p>© 2026 Coconea — Monorepo Modular Multi-Rol.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Next.js + React</span>
            <span>·</span>
            <span>NestJS API</span>
            <span>·</span>
            <span>SQLite</span>
            <span>·</span>
            <span>Paleta Café & Crema</span>
          </div>
        </div>
      </footer>
    </div>
  );
}