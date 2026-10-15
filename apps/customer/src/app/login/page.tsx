'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PROJECT_NAME, PROJECT_MOTTO } from '@coconea/shared';
import { loginSchema, registerSchema } from '@coconea/validation';
import { useAuth, DEMO_ACCOUNTS } from '@/context/auth-context';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Flame,
  ChefHat,
  Utensils,
  Clock,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, isAuthenticated, user, logout } = useAuth();

  // Modo: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Campos de formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Manejo de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (authMode === 'login') {
      // Validar con loginSchema de @coconea/validation
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          const path = issue.path[0] as string;
          if (path && !errors[path]) {
            errors[path] = issue.message;
          }
        }
        setFieldErrors(errors);
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('¡Bienvenido de vuelta a Coconea! Redirigiendo...');
          setTimeout(() => {
            router.push('/');
          }, 800);
        } else {
          setFormError(res.error || 'Credenciales inválidas. Inténtalo de nuevo.');
        }
      } catch {
        setFormError('Ocurrió un error inesperado al iniciar sesión.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Validar con registerSchema de @coconea/validation
      const validation = registerSchema.safeParse({
        fullName,
        email,
        password,
        phone: phone || undefined,
      });

      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          const path = issue.path[0] as string;
          if (path && !errors[path]) {
            errors[path] = issue.message;
          }
        }
        setFieldErrors(errors);
        return;
      }

      setIsLoading(true);
      try {
        await login(email, password);
        setSuccessMessage('¡Cuenta creada exitosamente! Bienvenido a Coconea.');
        setTimeout(() => {
          router.push('/');
        }, 800);
      } catch {
        setFormError('No fue posible completar el registro.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Acceso con un clic en modo Demo
  const handleQuickDemo = (type: 'standard' | 'keto' | 'vegan') => {
    loginAsDemo(type);
    const demo = DEMO_ACCOUNTS[type];
    setSuccessMessage(`Sesión iniciada como ${demo.fullName} (${demo.dietaryPreferences?.[0]}). Redirigiendo...`);
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between selection:bg-caramel/20 selection:text-espresso">
      {/* Barra superior con navegación de regreso */}
      <div className="border-b border-cream-border/70 bg-white/70 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-roasted hover:text-espresso transition group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
            <span>Volver a la página principal</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-coffee-muted">Ambiente Local / Demo MVP</span>
          </div>
        </div>
      </div>

      {/* Contenedor Principal (Split Layout) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-cream-border bg-white shadow-xl lg:grid-cols-12">
          {/* LADO IZQUIERDO: Propuesta de valor & estética Coconea (Desktop) */}
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-cream-container via-cream to-cream-soft p-8 lg:col-span-5 lg:flex border-r border-cream-border/60">
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-caramel/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-6 right-6 h-56 w-56 rounded-full bg-mocha/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge y Logo */}
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-espresso text-cream font-bold text-2xl shadow-md">
                  C
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-espresso">{PROJECT_NAME}</h2>
                  <p className="text-xs font-medium text-caramel">Planifica tu comida, confirma y recibe</p>
                </div>
              </div>

              {/* Mensaje de Bienvenida */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-caramel border border-cream-border shadow-xs">
                  <Sparkles className="h-3 w-3 text-caramel" />
                  <span>Tu alimentación bajo tu control</span>
                </div>
                <h3 className="text-2xl font-extrabold text-espresso leading-snug">
                  Come sano y variado sin cobros automáticos sorpresa.
                </h3>
                <p className="text-xs text-coffee-muted leading-relaxed">
                  En Coconea, cada propuesta semanal requiere tu aprobación expresa antes de emitir cualquier pedido o simular el pago.
                </p>
              </div>

              {/* Tarjeta Visual: Mini Preview de Propuesta */}
              <div className="rounded-2xl border border-cream-border bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-espresso">
                    <Clock className="h-3.5 w-3.5 text-caramel" />
                    Propuesta de Mañana 13:00
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                    Pendiente de confirmar
                  </span>
                </div>

                <div className="rounded-xl bg-cream p-2.5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-container text-espresso">
                    <Utensils className="h-4 w-4 text-caramel" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-espresso">Bowl Proteico de Salmón & Edamames</p>
                    <p className="text-[10px] text-coffee-muted">Bistró Verde • 540 kcal • Sin Gluten</p>
                  </div>
                </div>

                <div className="text-[10px] text-coffee-subtle flex items-center justify-between pt-1 border-t border-cream-border/50">
                  <span className="font-semibold text-espresso">$165.00 MXN</span>
                  <span className="text-caramel font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Requiere tu autorización
                  </span>
                </div>
              </div>
            </div>

            {/* Pilares al pie */}
            <div className="relative z-10 pt-6 border-t border-cream-border/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-roasted">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Exclusión rigurosa de alérgenos personales</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-roasted">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Cancelación o pausa de tu plan con un clic</span>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: Formulario de Login / Registro */}
          <div className="p-6 sm:p-8 md:p-10 lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Header de formulario y selector de pestañas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
                    {authMode === 'login' ? 'Bienvenido a Coconea' : 'Registro de nuevo cliente'}
                  </span>

                  {/* Switch rápido Login / Register */}
                  <div className="inline-flex rounded-full bg-cream-container p-1 border border-cream-border">
                    <button
                      id="tab-login"
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setFieldErrors({});
                        setFormError(null);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        authMode === 'login'
                          ? 'bg-espresso text-cream shadow-xs'
                          : 'text-roasted hover:text-espresso'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      id="tab-register"
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setFieldErrors({});
                        setFormError(null);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        authMode === 'register'
                          ? 'bg-espresso text-cream shadow-xs'
                          : 'text-roasted hover:text-espresso'
                      }`}
                    >
                      Crear Cuenta
                    </button>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-espresso">
                    {authMode === 'login' ? 'Inicia sesión en tu cuenta' : 'Comienza tu plan alimenticio'}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-coffee-muted">
                    {authMode === 'login'
                      ? 'Ingresa tus credenciales para revisar y confirmar tus propuestas activas.'
                      : 'Crea tu perfil nutricional y recibe sugerencias personalizadas sin riesgos.'}
                  </p>
                </div>
              </div>

              {/* Alerta de Mensaje de Éxito */}
              {successMessage && (
                <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-medium animate-fadeIn">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Alerta de Mensaje de Error General */}
              {formError && (
                <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-3 text-red-800 text-xs sm:text-sm font-medium animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Campo Nombre Completo (solo en registro) */}
                {authMode === 'register' && (
                  <div>
                    <label
                      htmlFor="input-fullName"
                      className="block text-xs font-semibold text-espresso mb-1.5"
                    >
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-subtle">
                        <User className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <input
                        id="input-fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Sofía Méndez"
                        className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-subtle/70 focus:outline-none focus:ring-2 transition ${
                          fieldErrors.fullName
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                            : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                        }`}
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Campo Correo Electrónico */}
                <div>
                  <label htmlFor="input-email" className="block text-xs font-semibold text-espresso mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-subtle">
                      <Mail className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <input
                      id="input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      autoComplete="email"
                      className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-subtle/70 focus:outline-none focus:ring-2 transition ${
                        fieldErrors.email
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Campo Teléfono (Opcional en registro) */}
                {authMode === 'register' && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="input-phone" className="block text-xs font-semibold text-espresso">
                        Teléfono Móvil
                      </label>
                      <span className="text-[10px] text-coffee-subtle font-medium">Opcional para avisos SMS</span>
                    </div>
                    <input
                      id="input-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="w-full rounded-xl border border-cream-border bg-white px-3.5 py-2.5 text-sm text-coffee placeholder-coffee-subtle/70 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 transition"
                    />
                  </div>
                )}

                {/* Campo Contraseña */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="input-password" className="block text-xs font-semibold text-espresso">
                      Contraseña
                    </label>
                    {authMode === 'login' && (
                      <button
                        id="link-forgot-password"
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] font-medium text-roasted hover:text-espresso hover:underline transition"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-subtle">
                      <Lock className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <input
                      id="input-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-coffee placeholder-coffee-subtle/70 focus:outline-none focus:ring-2 transition ${
                        fieldErrors.password
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-subtle hover:text-espresso transition"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Recordar sesión */}
                {authMode === 'login' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="input-remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-cream-border text-espresso focus:ring-caramel accent-espresso cursor-pointer"
                    />
                    <label htmlFor="input-remember" className="text-xs text-coffee-muted select-none cursor-pointer">
                      Mantener sesión abierta en este navegador
                    </label>
                  </div>
                )}

                {/* Botón Principal de Envío */}
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 rounded-full bg-espresso py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-espresso-light active:bg-espresso-dark transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>

              {/* SECCIÓN ACCESO DEMO RÁPIDO (Portafolio & Evaluación MVP) */}
              <div className="mt-8 pt-6 border-t border-cream-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-caramel" />
                    <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                      Acceso Rápido para Demostración
                    </span>
                  </div>
                  <span className="text-[10px] text-coffee-muted font-medium bg-cream px-2 py-0.5 rounded-full border border-cream-border">
                    1 Clic
                  </span>
                </div>
                <p className="text-[11px] text-coffee-muted mb-3 leading-relaxed">
                  Prueba la plataforma de inmediato seleccionando un perfil de consumidor preconfigurado con preferencias y restricciones alimenticias:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Demo 1: Sofia Méndez */}
                  <button
                    id="btn-demo-sofia"
                    type="button"
                    onClick={() => handleQuickDemo('standard')}
                    className="flex flex-col text-left p-2.5 rounded-xl border border-cream-border bg-cream/60 hover:bg-cream-container hover:border-caramel/40 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-espresso group-hover:text-caramel transition">
                        Sofía Méndez
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full font-bold">
                        Fit
                      </span>
                    </div>
                    <span className="text-[10px] text-coffee-muted mt-0.5 truncate">
                      Alta Proteína • Sin Mariscos
                    </span>
                  </button>

                  {/* Demo 2: Carlos Gómez */}
                  <button
                    id="btn-demo-carlos"
                    type="button"
                    onClick={() => handleQuickDemo('keto')}
                    className="flex flex-col text-left p-2.5 rounded-xl border border-cream-border bg-cream/60 hover:bg-cream-container hover:border-caramel/40 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-espresso group-hover:text-caramel transition">
                        Carlos Gómez
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded-full font-bold">
                        Keto
                      </span>
                    </div>
                    <span className="text-[10px] text-coffee-muted mt-0.5 truncate">
                      Cetogénica • Sin Gluten
                    </span>
                  </button>

                  {/* Demo 3: Valeria Ríos */}
                  <button
                    id="btn-demo-valeria"
                    type="button"
                    onClick={() => handleQuickDemo('vegan')}
                    className="flex flex-col text-left p-2.5 rounded-xl border border-cream-border bg-cream/60 hover:bg-cream-container hover:border-caramel/40 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-espresso group-hover:text-caramel transition">
                        Valeria Ríos
                      </span>
                      <span className="text-[10px] text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded-full font-bold">
                        Vegana
                      </span>
                    </div>
                    <span className="text-[10px] text-coffee-muted mt-0.5 truncate">
                      100% Plant-Based • Sin Lácteos
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Aviso de Privacidad y Simulación */}
            <div className="mt-8 pt-4 border-t border-cream-border/60 text-center">
              <p className="text-[11px] text-coffee-subtle flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-caramel flex-shrink-0" />
                <span>Simulación de pago MVP ($0 MXN). Nunca solicitamos tarjetas bancarias reales.</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Información para Recuperación de Acceso (RF-004) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-2xl border border-cream-border animate-fadeIn space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-container text-caramel">
                <HelpCircle className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-espresso">Recuperación de Contraseña</h3>
                <p className="text-xs text-coffee-muted">Requerimiento RF-004</p>
              </div>
            </div>

            <p className="text-xs text-coffee leading-relaxed">
              En el entorno de demostración y pruebas, puedes ingresar con cualquiera de las cuentas demo de acceso rápido que no requieren contraseña, o ingresar con cualquier correo válido con al menos 8 caracteres de contraseña para simular un inicio de sesión exitoso.
            </p>

            <div className="rounded-xl bg-cream p-3 text-xs text-coffee-muted space-y-1">
              <p className="font-semibold text-espresso">En producción (Better Auth):</p>
              <p>Se envía un enlace con token temporal de un solo uso a tu correo para restablecer las credenciales sin comprometer la seguridad.</p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full rounded-full bg-espresso py-2.5 text-xs font-semibold text-white hover:bg-espresso-light transition"
            >
              Entendido, volver al login
            </button>
          </div>
        </div>
      )}

      {/* Footer sutil */}
      <footer className="py-4 text-center text-xs text-coffee-subtle border-t border-cream-border/60 bg-cream-soft">
        <p>© 2026 Coconea. Todos los derechos reservados. Proyecto de demostración y portafolio.</p>
      </footer>
    </div>
  );
}
