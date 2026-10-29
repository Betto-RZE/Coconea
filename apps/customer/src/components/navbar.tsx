"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PROJECT_NAME } from "@coconea/shared";
import { useAuth } from "@/context/auth-context";
import {
  Menu,
  X,
  Calendar,
  ChefHat,
  ShieldCheck,
  Home,
  LogOut,
  User,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Store,
} from "lucide-react";

export type CustomerTab =
  "inicio" | "propuesta" | "modalidad" | "garantia" | "cuenta";

interface NavbarProps {
  activeTab?: CustomerTab;
  onSelectTab?: (tab: CustomerTab) => void;
}

const TAB_LABELS: Record<CustomerTab, string> = {
  inicio: "Restaurantes",
  propuesta: "Propuesta",
  modalidad: "Mi Plan",
  garantia: "Garantía",
  cuenta: "Perfil",
};

export function Navbar({ activeTab = "inicio", onSelectTab }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab: CustomerTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    setMenuOpen(false);
  };

  return (
    <header className="w-full relative z-30">
      {/* Barra Superior Principal */}
      <div className="rounded-2xl sm:rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-xs flex items-center justify-between">
        {/* Logotipo y Marca */}
        <button
          type="button"
          onClick={() => handleTabClick("inicio")}
          className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-cream-container border border-cream-border shadow-2xs transition-transform group-hover:scale-105 p-1">
            <img
              src="/images/coconea-pattern-icon.png"
              alt="Coconea"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-base font-extrabold tracking-tight text-espresso leading-tight">
                {PROJECT_NAME}
              </span>
              <span className="hidden min-[400px]:inline text-[12px] text-roasted bg-cream-container px-2 py-0.2 rounded-full font-bold border border-cream-border">
                {TAB_LABELS[activeTab]}
              </span>
            </div>
            <span className="text-[12px] sm:text-[12px] text-coffee-muted font-medium truncate max-w-[130px] sm:max-w-none">
              Planifica, confirma y recibe
            </span>
          </div>
        </button>

        {/* Acciones de Cabecera: Acceso rápido + Botón Menú */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => handleTabClick("cuenta")}
              className={`flex items-center gap-1 sm:gap-1.5 border pl-1 pr-2 sm:pl-1.5 sm:pr-2.5 py-1 rounded-full text-sm font-semibold transition cursor-pointer active:scale-95 ${
                activeTab === "cuenta"
                  ? "bg-espresso text-white border-espresso shadow-2xs"
                  : "bg-cream-container/70 border-cream-border text-espresso hover:bg-cream-container"
              }`}
            >
              <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-caramel text-white text-[12px] sm:text-sm font-bold">
                {user.fullName.charAt(0)}
              </div>
              <span className="max-w-[65px] truncate hidden xs:inline text-sm">
                {user.fullName.split(" ")[0]}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTabClick("cuenta")}
              className={`text-sm font-semibold px-2.5 py-1 rounded-full transition cursor-pointer active:scale-95 ${
                activeTab === "cuenta"
                  ? "bg-espresso text-white"
                  : "text-roasted hover:text-espresso hover:bg-cream-container"
              }`}
            >
              Entrar
            </button>
          )}

          {/* Botón de Menú Hamburguesa */}
          <button
            id="btn-toggle-menu"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="customer-menu"
            className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all duration-150 cursor-pointer active:scale-90 ${
              menuOpen
                ? "bg-espresso text-white border-espresso shadow-xs"
                : "bg-cream-container text-espresso border-cream-border hover:bg-cream-container/80"
            }`}
            aria-label={
              menuOpen
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
            }
          >
            {menuOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menú Desplegable de Navegación Independiente */}
      {menuOpen && (
        <div
          id="customer-menu"
          className="mt-2 rounded-3xl border border-cream-border/90 bg-white/95 backdrop-blur-md p-4 shadow-lg animate-fadeIn space-y-3.5"
        >
          {/* Encabezado del Menú */}
          <div className="flex items-center justify-between pb-2.5 border-b border-cream-border">
            <span className="text-sm font-bold uppercase tracking-wider text-caramel flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Pantallas de la App
            </span>
            <span className="text-[12px] text-coffee-muted">
              Navegación Móvil
            </span>
          </div>

          {/* Enlaces a Ventanas Independientes */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => handleTabClick("inicio")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                activeTab === "inicio"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-coffee hover:bg-cream-container hover:text-espresso"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-xl border ${
                    activeTab === "inicio"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-cream-container text-caramel border-cream-border"
                  }`}
                >
                  <Store className="h-4 w-4" />
                </div>
                <span>Restaurantes & Menús</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("propuesta")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                activeTab === "propuesta"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-coffee hover:bg-cream-container hover:text-espresso"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-xl border ${
                    activeTab === "propuesta"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-cream-container text-roasted border-cream-border"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <span>Propuesta de Hoy</span>
              </div>
              <span
                className={`text-[12px] font-bold px-2 py-0.5 rounded-full border ${
                  activeTab === "propuesta"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-cream-container text-caramel border-cream-border"
                }`}
              >
                Activa
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("modalidad")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                activeTab === "modalidad"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-coffee hover:bg-cream-container hover:text-espresso"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-xl border ${
                    activeTab === "modalidad"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-cream-container text-roasted border-cream-border"
                  }`}
                >
                  <ChefHat className="h-4 w-4" />
                </div>
                <span>Mi Plan Semanal</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("garantia")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                activeTab === "garantia"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-coffee hover:bg-cream-container hover:text-espresso"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-xl border ${
                    activeTab === "garantia"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-cream-container text-espresso border-cream-border"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Garantía & Alérgenos</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => handleTabClick("cuenta")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                activeTab === "cuenta"
                  ? "bg-espresso text-white shadow-xs"
                  : "text-coffee hover:bg-cream-container hover:text-espresso"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-xl border ${
                    activeTab === "cuenta"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-cream-container text-espresso border-cream-border"
                  }`}
                >
                  <User className="h-4 w-4" />
                </div>
                <span>Perfil & Restricciones</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </nav>

          {/* Sección de Cuenta y Autenticación */}
          <div className="pt-2 border-t border-cream-border">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="rounded-2xl border border-cream-border bg-cream-container/50 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-cream text-sm font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-bold text-espresso truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[12px] text-coffee-muted truncate">
                        {user.email}
                      </p>
                      <p className="text-[12px] font-semibold text-caramel mt-0.5">
                        {user.dietaryPreferences?.[0] || "Plan Equilibrado"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center rounded-full border border-cream-border bg-white py-2.5 text-sm font-bold text-espresso hover:bg-cream-container transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center rounded-full bg-espresso py-2.5 text-sm font-bold text-white shadow-xs hover:bg-espresso-light active:bg-espresso-dark transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
