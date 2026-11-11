"use client";

import React, { useState } from "react";
import { Utensils, Calendar, Check, Sparkles } from "lucide-react";

interface DietPreferencesProps {
  currentDiet?: string;
  currentMealsCount?: number;
  onSave: (diet: string, mealsCount: number) => void;
}

const DIET_OPTIONS = [
  { id: "balanced", label: "Balanceada / Estándar", description: "Una mezcla equilibrada de todos los grupos alimenticios." },
  { id: "keto", label: "Keto / Low Carb", description: "Baja en carbohidratos, alta en grasas saludables y proteínas." },
  { id: "vegan", label: "Vegana / Vegetariana", description: "100% basada en plantas, sin productos de origen animal." },
  { id: "high-protein", label: "Alta en Proteína", description: "Enfocada en el desarrollo muscular y rendimiento físico." },
  { id: "gluten-free", label: "Libre de Gluten", description: "Excluye proteínas de trigo, cebada y centeno." },
];

export default function DietPreferencesSettings({
  currentDiet = "balanced",
  currentMealsCount = 3,
  onSave,
}: DietPreferencesProps) {
  const [selectedDiet, setSelectedDiet] = useState(currentDiet);
  const [mealsCount, setMealsCount] = useState(currentMealsCount);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedDiet, mealsCount);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-cream-border bg-white p-5 space-y-6 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
          <Utensils className="h-5 w-5 text-caramel" />
          Preferencias de Dieta y Frecuencia
        </h2>
        <p className="text-sm text-coffee-muted">
          Configura tu estilo de alimentación y cuántas comidas al día deseas programar en tu matriz.
        </p>
      </div>

      {/* Selección de Tipo de Dieta */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-espresso">
          ¿Qué tipo de dieta prefieres?
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {DIET_OPTIONS.map((diet) => {
            const isSelected = selectedDiet === diet.id;
            return (
              <button
                type="button"
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? "border-caramel bg-caramel/5 text-espresso font-semibold shadow-2xs"
                    : "border-cream-border bg-white text-roasted hover:border-mocha-light"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold">{diet.label}</div>
                  <div className="text-xs text-coffee-muted font-normal">{diet.description}</div>
                </div>
                <div className={`flex h-5 w-5 rounded-full items-center justify-center border mt-0.5 flex-shrink-0 ${
                  isSelected ? "bg-caramel border-caramel text-white" : "border-cream-border"
                }`}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selección de Frecuencia de Comidas al Día */}
      <div className="space-y-3 pt-2 border-t border-cream-border">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-espresso flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-caramel" />
            Comidas al día requeridas
          </label>
          <span className="text-sm font-bold bg-cream-soft px-3 py-1 rounded-full text-espresso border border-cream-border">
            {mealsCount} {mealsCount === 1 ? "comida" : "comidas"}
          </span>
        </div>
        <p className="text-xs text-coffee-muted">
          Elige cuántas comidas diarias deseas incluir en tu programación automática (ej. Desayuno, Almuerzo, Cena).
        </p>

        {/* Botones de selección rápida de frecuencia */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setMealsCount(num)}
              className={`py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
                mealsCount === num
                  ? "bg-espresso text-white border-espresso shadow-xs"
                  : "bg-white text-roasted border-cream-border hover:bg-cream-soft"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="pt-2 flex items-center justify-between">
        {saved ? (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5" /> ¡Preferencias actualizadas con éxito!
          </span>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="rounded-full bg-espresso px-6 py-3 text-sm font-bold text-white hover:bg-espresso/90 active:scale-95 transition cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}