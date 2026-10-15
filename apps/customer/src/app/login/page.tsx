'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PROJECT_NAME } from '@coconea/shared';
import { loginSchema, registerSchema } from '@coconea/validation';
import {
  useAuth,
  DEMO_ACCOUNTS,
  DEMO_DEFAULT_PASSWORD,
  AuthErrorType,
} from '@/context/auth-context';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  // Modo: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<AuthErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetErrors = () => {
    setErrorMessage(null);
    setErrorType(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    // 1. Validación de campos obligatorios
    const localErrors: Record<string, string> = {};

    if (!email.trim()) {
      localErrors.email = 'El correo electrónico es obligatorio *';
    }

    if (!password.trim()) {
      localErrors.password = 'La contraseña es obligatoria *';
    }

    if (authMode === 'register' && !fullName.trim()) {
      localErrors.fullName = 'El nombre completo es obligatorio *';
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setErrorType('MISSING_FIELDS');
      setErrorMessage('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    // 2. Procesamiento según modo
    if (authMode === 'login') {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          const path = issue.path[0] as string;
          if (path && !errors[path]) errors[path] = issue.message;
        }
        setFieldErrors(errors);
        setErrorType('VALIDATION_ERROR');
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('¡Bienvenido de vuelta!');
          setTimeout(() => router.push('/'), 600);
        } else {
          setErrorType(res.errorType || 'UNKNOWN');
          setErrorMessage(res.error || 'Credenciales inválidas.');
        }
      } catch {
        setErrorType('UNKNOWN');
        setErrorMessage('Ocurrió un error inesperado al iniciar sesión.');
      } finally {
        setIsLoading(false);
      }
    } else {
      const validation = registerSchema.safeParse({ fullName, email, password });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          const path = issue.path[0] as string;
          if (path && !errors[path]) errors[path] = issue.message;
        }
        setFieldErrors(errors);
        setErrorType('VALIDATION_ERROR');
        return;
      }

      setIsLoading(true);
      try {
        const res = await register({ fullName, email, password });
        if (res.success) {
          setSuccessMessage('¡Cuenta creada con éxito!');
          setTimeout(() => router.push('/'), 600);
        } else {
          setErrorType(res.errorType || 'UNKNOWN');
          setErrorMessage(res.error || 'No fue posible registrar la cuenta.');
        }
      } catch {
        setErrorType('UNKNOWN');
        setErrorMessage('Error al completar el registro.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Cargar credenciales de demostración con 1 clic
  const loadDemoUser = (type: 'standard' | 'keto' | 'vegan') => {
    const demo = DEMO_ACCOUNTS[type];
    setEmail(demo.email);
    setPassword(demo.password || DEMO_DEFAULT_PASSWORD);
    setAuthMode('login');
    resetErrors();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between py-6 px-4 sm:px-6 selection:bg-caramel/20 selection:text-espresso">
      {/* Barra superior simple */}
      <div className="mx-auto w-full max-w-sm flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-roasted hover:text-espresso transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Contenedor Principal: Limpio, centrado y optimizado para móvil */}
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Cabecera / Identidad */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso text-cream font-extrabold text-2xl shadow-sm">
                C
              </span>
            </Link>

            <div>
              <h1 className="text-2xl font-extrabold text-espresso tracking-tight">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h1>
              <p className="text-xs text-coffee-muted mt-1">
                {authMode === 'login'
                  ? 'Ingresa a tu cuenta de Coconea'
                  : 'Empieza a planificar tu alimentación sin sorpresas'}
              </p>
            </div>
          </div>

          {/* Selector de Pestaña Discreto */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-cream-container border border-cream-border">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                resetErrors();
              }}
              className={`py-1.5 text-xs font-semibold rounded-full transition ${
                authMode === 'login'
                  ? 'bg-espresso text-white shadow-xs'
                  : 'text-roasted hover:text-espresso'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                resetErrors();
              }}
              className={`py-1.5 text-xs font-semibold rounded-full transition ${
                authMode === 'register'
                  ? 'bg-espresso text-white shadow-xs'
                  : 'text-roasted hover:text-espresso'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* ANUNCIO DE ÉXITO */}
          {successMessage && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-emerald-800 text-xs animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* ANUNCIOS DE ERROR CLAROS Y DESTACADOS */}
          {errorMessage && (
            <div
              className={`rounded-2xl p-3.5 border text-xs animate-fadeIn ${
                errorType === 'ACCOUNT_NOT_FOUND'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {errorType === 'ACCOUNT_NOT_FOUND' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-bold">
                    {errorType === 'ACCOUNT_NOT_FOUND'
                      ? 'Cuenta no encontrada'
                      : errorType === 'INVALID_PASSWORD'
                      ? 'Contraseña incorrecta'
                      : errorType === 'EMAIL_ALREADY_EXISTS'
                      ? 'Correo ya registrado'
                      : errorType === 'MISSING_FIELDS'
                      ? 'Campos obligatorios'
                      : 'Error de acceso'}
                  </p>
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>

                  {/* Botón contextual si la cuenta no existe */}
                  {errorType === 'ACCOUNT_NOT_FOUND' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        resetErrors();
                      }}
                      className="mt-1.5 text-[11px] font-bold text-amber-900 underline hover:text-amber-950 block"
                    >
                      ¿Deseas registrarte con este correo ahora? →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formulario Limpio */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo Nombre (solo en registro) */}
            {authMode === 'register' && (
              <div>
                <label
                  htmlFor="input-fullName"
                  className="block text-xs font-semibold text-espresso mb-1"
                >
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="input-fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:ring-2 transition ${
                      fieldErrors.fullName
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                    }`}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Campo Correo */}
            <div>
              <label
                htmlFor="input-email"
                className="block text-xs font-semibold text-espresso mb-1"
              >
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.email
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="input-password"
                  className="block text-xs font-semibold text-espresso"
                >
                  Contraseña <span className="text-red-500">*</span>
                </label>
                {authMode === 'login' && (
                  <span className="text-[11px] text-coffee-muted">
                    Pista demo: <strong className="text-caramel">Coconea2026!</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.password
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-muted hover:text-espresso"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Botón Principal */}
            <button
              id="btn-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-full bg-espresso py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-espresso-light active:bg-espresso-dark transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Accesos rápidos discretos para pruebas */}
          <div className="pt-4 border-t border-cream-border text-center">
            <p className="text-[11px] text-coffee-muted mb-2">
              O autocompleta con una cuenta demo:
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => loadDemoUser('standard')}
                className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition"
              >
                Sofía
              </button>
              <button
                type="button"
                onClick={() => loadDemoUser('keto')}
                className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition"
              >
                Carlos
              </button>
              <button
                type="button"
                onClick={() => loadDemoUser('vegan')}
                className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition"
              >
                Valeria
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página discreto */}
      <footer className="text-center text-xs text-coffee-muted">
        <p>© 2026 {PROJECT_NAME} — Planifica, confirma y recibe.</p>
      </footer>
    </div>
  );
}
