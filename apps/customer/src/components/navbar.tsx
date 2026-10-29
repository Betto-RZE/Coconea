"use client";

import { PROJECT_NAME } from "@coconea/shared";
import { useAuth } from "@/context/auth-context";

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
  const { user, isAuthenticated } = useAuth();

  const handleTabClick = (tab: CustomerTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
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

        {/* Acceso rápido a la cuenta */}
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
        </div>
      </div>
    </header>
  );
}
