"use client";
import { Calendar, ArrowRight, User } from "lucide-react";
import type { CustomerTab } from "@/components/navbar";
interface Props {
  nombre: string;
  onNavigateTab: (tab: CustomerTab) => void;
}
export default function CustomerDashboard({ nombre, onNavigateTab }: Props) {
  const today = new Date();
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      label: date.toLocaleDateString("es-MX", { weekday: "short" }),
      day: date.getDate(),
    };
  });
  return (
    <section
      className="rounded-2xl border border-cream-border bg-white p-4 space-y-4"
      aria-label="Resumen de tu planificación"
    >
      <div>
        <p className="text-sm text-roasted">
          {today.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-2xl font-semibold text-espresso">
          Hola, {nombre.split(" ")[0]}
        </h1>
        <p className="text-sm text-coffee-muted mt-1">
          Explora los restaurantes y organiza tus próximas comidas.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2" aria-label="Próximos días">
        {days.map((date, index) => (
          <div
            key={index}
            className="rounded-2xl border border-cream-border bg-cream-soft py-2 text-center"
          >
            <span className="block text-xs text-roasted">{date.label}</span>
            <span className="text-lg font-semibold text-espresso">
              {date.day}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-coffee-muted">
        La planificación y la confirmación de pedidos siguen en demostración.
        Programar no realiza compras.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onNavigateTab("modalidad")}
          className="min-h-11 rounded-full bg-espresso px-4 py-3 text-sm font-medium text-white inline-flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Mi plan
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onNavigateTab("cuenta")}
          className="min-h-11 rounded-full border border-cream-border px-4 py-3 text-sm text-roasted inline-flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Mi cuenta
        </button>
      </div>
    </section>
  );
}
