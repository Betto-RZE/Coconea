'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const DIETARY_OPTIONS = [
  'Plan Equilibrado',
  'Alto en Proteína',
  'Cetogénico (Keto)',
  'Vegano',
  'Vegetariano',
];

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

export function AuthForm({ initialMode = 'login' }: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { login, register } = useAuth();

  // Sincronizar automáticamente el modo a partir de la ruta activa o prop inicial
  const modeFromPath = pathname?.includes('register') ? 'register' : initialMode;
  const [authMode, setAuthMode] = useState<'login' | 'register'>(modeFromPath);

  // Efecto para sincronizar cuando el usuario navega entre /login y /register
  useEffect(() => {
    if (pathname?.includes('register')) {
      setAuthMode('register');
      resetErrors();
    } else if (pathname?.includes('login')) {
      setAuthMode('login');
      resetErrors();
    }
  }, [pathname]);

  // Campos de formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('Plan Equilibrado');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Alternar entre modo Iniciar Sesión y Registrarse con navegación de ruta
  const switchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    resetErrors();
    setSuccessMessage(null);

    const targetUrl = mode === 'register' ? '/register' : '/login';
    if (pathname !== targetUrl) {
      router.push(targetUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const localErrors: Record<string, string> = {};

    // Validar correo
    if (!email.trim()) {
      localErrors.email = 'El correo electrónico es obligatorio *';
    }

    // Validar contraseña
    if (!password.trim()) {
      localErrors.password = 'La contraseña es obligatoria *';
    } else if (password.trim().length < 8) {
      localErrors.password = 'La contraseña debe tener al menos 8 caracteres *';
    }

    // Validaciones exclusivas de registro
    if (authMode === 'register') {
      if (!fullName.trim()) {
        localErrors.fullName = 'El nombre completo es obligatorio *';
      }

      if (!confirmPassword.trim()) {
        localErrors.confirmPassword = 'Debes confirmar tu contraseña *';
      } else if (password.trim() !== confirmPassword.trim()) {
        localErrors.confirmPassword = 'Las contraseñas no coinciden *';
      }

      if (!termsAccepted) {
        localErrors.terms = 'Debes aceptar los términos y condiciones *';
      }
    }

    // Si hay campos obligatorios faltantes
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setErrorType('MISSING_FIELDS');
      const firstErrorMessage = Object.values(localErrors)[0];
      setErrorMessage(firstErrorMessage || 'Por favor completa todos los campos requeridos (*)');
      return;
    }

    // Flujo de Inicio de Sesión
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
        setErrorMessage(validation.error.issues[0]?.message || 'Verifica los datos ingresados.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('¡Bienvenido de vuelta a Coconea! Redirigiendo...');
          setTimeout(() => router.push('/'), 700);
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
      // Flujo de Registro de Usuario
      const validation = registerSchema.safeParse({
        fullName,
        email,
        password,
        phone: phone.trim() || undefined,
      });

      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          const path = issue.path[0] as string;
          if (path && !errors[path]) errors[path] = issue.message;
        }
        setFieldErrors(errors);
        setErrorType('VALIDATION_ERROR');
        setErrorMessage(validation.error.issues[0]?.message || 'Verifica los datos del registro.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await register({
          fullName,
          email,
          password,
          phone: phone.trim() || undefined,
          dietaryPreference,
        });

        if (res.success) {
          setSuccessMessage(
            `¡Cuenta creada exitosamente! Bienvenido, ${fullName.trim()}. Redirigiendo a tu plan...`
          );
          setTimeout(() => router.push('/'), 800);
        } else {
          setErrorType(res.errorType || 'UNKNOWN');
          setErrorMessage(res.error || 'No fue posible completar el registro.');
        }
      } catch {
        setErrorType('UNKNOWN');
        setErrorMessage('Error al completar el registro.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loadDemoUser = (type: 'standard' | 'keto' | 'vegan') => {
    const demo = DEMO_ACCOUNTS[type];
    setEmail(demo.email);
    setPassword(demo.password || DEMO_DEFAULT_PASSWORD);
    switchMode('login');
  };

  return (
    <div className="w-full max-w-sm space-y-5 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-sm relative z-10">
      {/* Contenedor Superior: Logo y Switch en posición idéntica en ambas vistas */}
      <div className="space-y-4">
        {/* Logotipo con el emblema oficial de Coconea */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center group"
            aria-label="Ir a la página principal de Coconea"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-container border border-cream-border shadow-xs transition-transform group-hover:scale-105 p-2">
              <img
                src="/images/coconea-pattern-icon.png"
                alt="Coconea"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Switch de Ventanas: Iniciar Sesión / Registrarse */}
        <div className="grid grid-cols-2 p-1 rounded-full bg-cream-container border border-cream-border relative z-20 shadow-xs">
          <Link
            href="/login"
            id="switch-btn-login"
            onClick={() => switchMode('login')}
            className={`py-2 text-xs font-bold rounded-full text-center transition-all duration-200 select-none cursor-pointer flex items-center justify-center ${
              authMode === 'login'
                ? 'bg-espresso text-white shadow-sm'
                : 'text-roasted hover:text-espresso hover:bg-cream/60'
            }`}
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            id="switch-btn-register"
            onClick={() => switchMode('register')}
            className={`py-2 text-xs font-bold rounded-full text-center transition-all duration-200 select-none cursor-pointer flex items-center justify-center ${
              authMode === 'register'
                ? 'bg-espresso text-white shadow-sm'
                : 'text-roasted hover:text-espresso hover:bg-cream/60'
            }`}
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Título de la vista activa con altura estable */}
      <div className="text-center min-h-[50px] flex flex-col justify-center">
        <h1 className="text-2xl font-extrabold text-espresso tracking-tight">
          {authMode === 'login' ? 'Iniciar Sesión' : 'Crear tu Cuenta'}
        </h1>
        <p className="text-xs text-coffee-muted mt-0.5">
          {authMode === 'login'
            ? 'Ingresa a tu cuenta para confirmar tus propuestas'
            : 'Regístrate y configura tu plan alimenticio semanal'}
        </p>
      </div>


      {/* ANUNCIO DE ÉXITO */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-emerald-800 text-xs animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">¡Operación exitosa!</p>
            <p className="text-[11px] mt-0.5 leading-snug">{successMessage}</p>
          </div>
        </div>
      )}

      {/* ANUNCIOS DE ERROR CLAROS Y DESTACADOS */}
      {errorMessage && (
        <div
          className={`rounded-2xl p-3.5 border text-xs animate-fadeIn ${
            errorType === 'ACCOUNT_NOT_FOUND' || errorType === 'EMAIL_ALREADY_EXISTS'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {errorType === 'ACCOUNT_NOT_FOUND' || errorType === 'EMAIL_ALREADY_EXISTS' ? (
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
                  ? 'Campos requeridos incompletos'
                  : 'Aviso de autenticación'}
              </p>
              <p className="text-[11px] leading-relaxed">{errorMessage}</p>

              {errorType === 'ACCOUNT_NOT_FOUND' && (
                <Link
                  href="/register"
                  onClick={() => switchMode('register')}
                  className="mt-1 text-[11px] font-bold text-amber-900 underline hover:text-amber-950 block cursor-pointer"
                >
                  ¿Deseas crear esta cuenta ahora? →
                </Link>
              )}

              {errorType === 'EMAIL_ALREADY_EXISTS' && (
                <Link
                  href="/login"
                  onClick={() => switchMode('login')}
                  className="mt-1 text-[11px] font-bold text-amber-900 underline hover:text-amber-950 block cursor-pointer"
                >
                  Iniciar sesión con este correo →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Campo Nombre Completo (solo en registro) */}
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
                placeholder="Ej. Sofía Méndez"
                className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.fullName
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                }`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">
                {fieldErrors.fullName}
              </p>
            )}
          </div>
        )}

        {/* Campo Correo Electrónico */}
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
            <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Campo Teléfono Opcional (solo en registro) */}
        {authMode === 'register' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="input-phone" className="block text-xs font-semibold text-espresso">
                Teléfono móvil
              </label>
              <span className="text-[10px] text-coffee-muted">Opcional para avisos</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="w-full rounded-xl border border-cream-border bg-white pl-10 pr-3.5 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 transition"
              />
            </div>
          </div>
        )}

        {/* Preferencia Alimenticia Inicial (solo en registro) */}
        {authMode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-espresso mb-1.5">
              Preferencia alimenticia inicial
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDietaryPreference(opt)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    dietaryPreference === opt
                      ? 'bg-espresso text-cream shadow-xs'
                      : 'bg-white border border-cream-border text-roasted hover:bg-cream-container'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

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
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-muted hover:text-espresso cursor-pointer"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-[11px] text-red-600 font-medium">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Confirmar Contraseña (solo en registro) */}
        {authMode === 'register' && (
          <div>
            <label
              htmlFor="input-confirmPassword"
              className="block text-xs font-semibold text-espresso mb-1"
            >
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-muted">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="input-confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-coffee placeholder-coffee-muted/50 focus:outline-none focus:ring-2 transition ${
                  fieldErrors.confirmPassword
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-cream-border focus:border-caramel focus:ring-caramel/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-muted hover:text-espresso cursor-pointer"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Checkbox de términos y no cobros automáticos (solo en registro) */}
        {authMode === 'register' && (
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                id="checkbox-terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-cream-border text-espresso focus:ring-caramel accent-espresso cursor-pointer"
              />
              <span className="text-[11px] text-coffee-muted leading-tight">
                Acepto los términos de servicio y confirmo que en Coconea{' '}
                <strong className="text-espresso">nunca hay cobros automáticos</strong> sin mi
                autorización explícita.
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.terms}</p>
            )}
          </div>
        )}

        {/* Botón Principal de Envío */}
        <button
          id="btn-submit-auth"
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 rounded-full bg-espresso py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-espresso-light active:bg-espresso-dark transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Enlaces al pie del formulario */}
      <div className="pt-3 border-t border-cream-border text-center space-y-3">
        {authMode === 'login' ? (
          <>
            <p className="text-xs text-coffee-muted">
              ¿No tienes una cuenta aún?{' '}
              <Link
                href="/register"
                id="btn-switch-to-register"
                onClick={() => switchMode('register')}
                className="font-bold text-caramel hover:underline cursor-pointer"
              >
                Regístrate aquí
              </Link>
            </p>

            {/* Accesos demo */}
            <div className="pt-1">
              <p className="text-[11px] text-coffee-muted mb-2">
                O autocompleta con una cuenta demo:
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoUser('standard')}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition cursor-pointer"
                >
                  Sofía
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoUser('keto')}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition cursor-pointer"
                >
                  Carlos
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoUser('vegan')}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-cream-border bg-white text-espresso hover:bg-cream-container transition cursor-pointer"
                >
                  Valeria
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-coffee-muted">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link
              href="/login"
              id="btn-switch-to-login"
              onClick={() => switchMode('login')}
              className="font-bold text-caramel hover:underline cursor-pointer"
            >
              Inicia sesión aquí
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
