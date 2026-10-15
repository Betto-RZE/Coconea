'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PROJECT_NAME } from '@coconea/shared';
import { useAuth } from '@/context/auth-context';
import {
  User,
  LogOut,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  ChefHat,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logotipo y Título de Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-espresso text-cream font-bold text-xl shadow-sm transition-transform duration-200 group-hover:scale-105">
            C
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-espresso">{PROJECT_NAME}</span>
              <span className="hidden sm:inline-block text-[11px] text-caramel bg-cream-container px-2.5 py-0.5 rounded-full font-semibold border border-cream-border">
                Consumidor
              </span>
            </div>
            <span className="text-[11px] text-coffee-muted -mt-0.5 hidden sm:block">
              Alimentación planificada
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-roasted">
          <Link
            href="/#como-funciona"
            className="hover:text-espresso transition-colors hover:underline underline-offset-4 decoration-caramel"
          >
            ¿Cómo funciona?
          </Link>
          <Link
            href="/#demo-propuesta"
            className="hover:text-espresso transition-colors hover:underline underline-offset-4 decoration-caramel"
          >
            Propuesta de Hoy
          </Link>
          <Link
            href="/#restricciones"
            className="hover:text-espresso transition-colors hover:underline underline-offset-4 decoration-caramel"
          >
            Restricciones & Alérgenos
          </Link>
        </nav>

        {/* Acciones de Autenticación Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                id="btn-user-menu"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-cream-border bg-cream-container/60 px-3.5 py-1.5 text-sm font-medium text-espresso hover:bg-cream-container transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso text-cream text-xs font-bold">
                  {user.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-xs text-espresso leading-tight">
                    {user.fullName}
                  </span>
                  <span className="block text-[10px] text-caramel font-medium leading-tight">
                    {user.dietaryPreferences?.[0] || 'Plan Activo'}
                  </span>
                </div>
              </button>

              {/* Menú Desplegable de Usuario */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-cream-border bg-white p-2 shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-cream-border/60">
                    <p className="text-xs text-coffee-muted">Sesión iniciada como</p>
                    <p className="text-sm font-semibold text-espresso truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/#demo-propuesta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-coffee hover:bg-cream-container transition"
                    >
                      <Calendar className="h-4 w-4 text-caramel" strokeWidth={2} />
                      <span>Mi Propuesta Semanal</span>
                    </Link>
                    <button
                      id="btn-logout"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={2} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                id="btn-nav-login"
                className="rounded-full px-4 py-2 text-sm font-medium text-roasted hover:text-espresso hover:bg-cream-container transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/login"
                id="btn-nav-register"
                className="rounded-full bg-espresso px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-espresso-light active:bg-espresso-dark transition flex items-center gap-2"
              >
                <span>Comenzar Plan</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && user && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso text-cream text-xs font-bold">
              {user.fullName.charAt(0)}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-coffee hover:bg-cream-container"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-cream-border bg-white px-4 py-4 space-y-3">
          <Link
            href="/#como-funciona"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-roasted hover:text-espresso py-1"
          >
            ¿Cómo funciona?
          </Link>
          <Link
            href="/#demo-propuesta"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-roasted hover:text-espresso py-1"
          >
            Propuesta de Hoy
          </Link>
          <Link
            href="/#restricciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-roasted hover:text-espresso py-1"
          >
            Restricciones & Alérgenos
          </Link>

          <div className="pt-3 border-t border-cream-border">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="rounded-xl bg-cream-container p-3">
                  <p className="text-xs text-coffee-muted">Conectado como:</p>
                  <p className="font-semibold text-espresso text-sm">{user.fullName}</p>
                  <p className="text-xs text-caramel">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-full border border-cream-border py-2 text-sm font-medium text-espresso"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-full bg-espresso py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                  Comenzar Plan
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
