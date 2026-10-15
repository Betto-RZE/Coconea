'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PROJECT_NAME } from '@coconea/shared';
import { AuthForm } from '@/components/auth-form';

function LoginContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  return <AuthForm initialMode={initialMode} />;
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-cream flex flex-col justify-between py-6 px-4 sm:px-6 selection:bg-caramel/20 selection:text-espresso overflow-x-hidden">

      {/* Barra superior con navegación de regreso */}
      <div className="relative z-10 mx-auto w-full max-w-md flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-roasted hover:text-espresso transition bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-cream-border/70 shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Contenedor Principal posicionado en la parte superior */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-3 sm:pt-5 pb-10">
        <Suspense fallback={<div className="text-xs text-coffee-muted">Cargando...</div>}>
          <LoginContent />
        </Suspense>
      </main>

      {/* Pie de página discreto */}
      <footer className="relative z-10 text-center text-xs text-coffee-muted">
        <p className="inline-block bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-cream-border/60">
          © 2026 {PROJECT_NAME} — Planifica, confirma y recibe.
        </p>
      </footer>
    </div>
  );
}
