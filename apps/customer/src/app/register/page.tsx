'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PROJECT_NAME } from '@coconea/shared';
import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-cream flex flex-col justify-between py-6 px-4 sm:px-6 selection:bg-caramel/20 selection:text-espresso overflow-x-hidden">
      {/* Fondo Papel Tapiz con iconos Coconea más grandes y alineados en diagonal */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.18] bg-repeat"
        style={{
          backgroundImage: "url('/images/coconea-wallpaper-diagonal.png')",
          backgroundSize: '150px 150px',
          backgroundPosition: '0 0',
        }}
        aria-hidden="true"
      />

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
        <AuthForm initialMode="register" />
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
