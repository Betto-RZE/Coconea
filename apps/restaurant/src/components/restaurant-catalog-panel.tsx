"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, LogOut, Plus, Store, Pencil, RefreshCw } from "lucide-react";
import {
  CatalogApiError,
  catalogRequest,
  formatCurrencyMXN,
} from "@coconea/shared";
import type {
  CatalogProduct,
  CatalogRestaurant,
  ProductInput,
} from "@coconea/types";
import { loginSchema } from "@coconea/validation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
const CUSTOMER_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_URL || "http://localhost:3000";
const inputClass =
  "w-full rounded-xl border border-cream-border bg-white px-3 py-3 text-base text-coffee focus:outline-none focus:ring-2 focus:ring-roasted";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-semibold text-white disabled:opacity-50";
const categories = {
  fuertes: "Especialidades",
  complementos: "Complementos",
  postres: "Postres",
  bebidas: "Bebidas",
};
const imageSource = (url: string) =>
  url.startsWith("/images/") ? `${CUSTOMER_URL}${url}` : url;
const message = (error: unknown) =>
  error instanceof Error ? error.message : "No se pudo completar la operación.";

const editorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Escribe un nombre de al menos 2 caracteres.")
      .max(120),
    description: z
      .string()
      .trim()
      .min(5, "La descripción debe tener al menos 5 caracteres.")
      .max(2000),
    price: z
      .string()
      .regex(
        /^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/,
        "Usa un precio con hasta dos decimales.",
      )
      .refine(
        (value) => !/^0(?:\.0{1,2})?$/.test(value),
        "El precio debe ser mayor que cero.",
      ),
    category: z.enum(["fuertes", "complementos", "postres", "bebidas"]),
    image_url: z
      .string()
      .max(1000)
      .refine(
        (value) =>
          /^\/images\/[\w/.-]+$/.test(value) ||
          (/^https:\/\//.test(value) && URL.canParse(value)),
        "Usa una ruta /images/ o una URL HTTPS.",
      ),
    image_alt: z.string().trim().min(2, "Describe la imagen.").max(200),
    availability_status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
    ingredient_disclosure_status: z.enum(["UNKNOWN", "PARTIAL", "COMPLETE"]),
    ingredientsText: z.string().max(6000),
    allergensText: z.string().max(6000),
  })
  .refine(
    (value) =>
      value.ingredient_disclosure_status !== "COMPLETE" ||
      value.ingredientsText.trim().length > 0,
    {
      path: ["ingredientsText"],
      message:
        "Declara los ingredientes antes de marcar la información como completa.",
    },
  );
type EditorValues = z.infer<typeof editorSchema>;

function ProductEditor({
  product,
  onSave,
  onCancel,
}: {
  product: CatalogProduct | null;
  onSave: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: product
      ? {
          ...product,
          ingredientsText: product.ingredients
            .map(
              (ingredient) =>
                (ingredient.declaration_type === "MAY_CONTAIN"
                  ? "Puede contener: "
                  : "") + ingredient.name,
            )
            .join("\n"),
          allergensText: product.allergens.join("\n"),
        }
      : {
          name: "",
          description: "",
          price: "",
          category: "fuertes",
          image_url: "/images/menu/pizza.jpg",
          image_alt: "Imagen de referencia del platillo",
          availability_status: "AVAILABLE",
          ingredient_disclosure_status: "UNKNOWN",
          ingredientsText: "",
          allergensText: "",
        },
  });
  const submit = handleSubmit(
    async ({ ingredientsText, allergensText, price, ...values }) => {
      setError(null);
      const [whole, fraction = ""] = price.split(".");
      const lines = (value: string) =>
        value
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      try {
        await onSave({
          ...values,
          price: `${whole}.${fraction.padEnd(2, "0")}`,
          ingredients: lines(ingredientsText).map((line) => {
            const mayContain = /^puede contener:/i.test(line);
            const name = line.replace(/^puede contener:\s*/i, "");
            const existing = product?.ingredients.find(
              (ingredient) =>
                ingredient.name.toLocaleLowerCase("es") ===
                name.toLocaleLowerCase("es"),
            );
            return {
              ingredient_id: existing?.ingredient_id || crypto.randomUUID(),
              name,
              declaration_type: mayContain
                ? ("MAY_CONTAIN" as const)
                : ("CONTAINS" as const),
            };
          }),
          allergens: lines(allergensText),
        });
      } catch (error) {
        setError(message(error));
      }
    },
  );
  return (
    <section
      className="rounded-2xl border border-mocha bg-cream-soft p-4 sm:p-6 space-y-4"
      aria-labelledby="editor-title"
    >
      <h2 id="editor-title" className="text-xl font-semibold text-espresso">
        {product ? "Editar producto" : "Nuevo producto"}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            Nombre
            <input {...register("name")} className={inputClass} autoFocus />
          </label>
          <label className="space-y-1 text-sm font-medium">
            Precio (MXN)
            <input
              {...register("price")}
              inputMode="decimal"
              placeholder="145.00"
              className={inputClass}
            />
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          Descripción
          <textarea
            {...register("description")}
            rows={3}
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            Categoría
            <select {...register("category")} className={inputClass}>
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium">
            Disponibilidad
            <select {...register("availability_status")} className={inputClass}>
              <option value="AVAILABLE">Disponible</option>
              <option value="UNAVAILABLE">No disponible</option>
            </select>
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          Imagen (URL HTTPS o ruta /images/)
          <input {...register("image_url")} className={inputClass} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Descripción de la imagen
          <input {...register("image_alt")} className={inputClass} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Ingredientes (uno por línea)
          <textarea
            {...register("ingredientsText")}
            rows={3}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Alérgenos declarados (uno por línea)
          <textarea
            {...register("allergensText")}
            rows={2}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Estado de la información
          <select
            {...register("ingredient_disclosure_status")}
            className={inputClass}
          >
            <option value="UNKNOWN">Sin verificar</option>
            <option value="PARTIAL">Declaración parcial</option>
            <option value="COMPLETE">
              Declaración completa del restaurante
            </option>
          </select>
        </label>
        <p className="text-sm text-coffee-muted">
          Un campo vacío no significa que el producto sea seguro. La declaración
          no garantiza ausencia de contaminación cruzada.
        </p>
        {Object.values(errors).map((error, index) => (
          <p key={index} role="alert" className="text-sm text-roasted">
            {error.message}
          </p>
        ))}
        {error && (
          <p role="alert" className="text-sm text-roasted">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={isSubmitting} className={buttonClass}>
            {isSubmitting ? "Guardando…" : "Guardar producto"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-cream-border px-5 py-3 text-sm text-espresso"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

function RestaurantProfileEditor({
  restaurant,
  onSave,
}: {
  restaurant: CatalogRestaurant;
  onSave: (input: {
    name: string;
    description: string;
    image_url: string;
    image_alt: string;
    version: number;
  }) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  return (
    <form
      className="rounded-2xl border border-cream-border bg-white p-5 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSaving(true);
        setError(null);
        try {
          await onSave({
            name: String(data.get("name")),
            description: String(data.get("description")),
            image_url: String(data.get("image")),
            image_alt: restaurant.image_alt,
            version: restaurant.version,
          });
        } catch (error) {
          setError(message(error));
        } finally {
          setSaving(false);
        }
      }}
    >
      <h2 className="text-xl font-semibold text-espresso">Mi restaurante</h2>
      <label className="block space-y-1 text-sm font-medium">
        Nombre
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          defaultValue={restaurant.name}
          className={inputClass}
        />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        Descripción
        <textarea
          name="description"
          required
          minLength={5}
          maxLength={1000}
          defaultValue={restaurant.description}
          rows={3}
          className={inputClass}
        />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        Imagen
        <input
          name="image"
          required
          defaultValue={restaurant.image_url}
          className={inputClass}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-roasted">
          {error}
        </p>
      )}
      <button disabled={saving} className={buttonClass}>
        {saving ? "Guardando…" : "Guardar restaurante"}
      </button>
    </form>
  );
}

export function RestaurantCatalogPanel() {
  const [restaurant, setRestaurant] = useState<CatalogRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<"catalog" | "profile">("catalog");
  const [editor, setEditor] = useState<CatalogProduct | "new" | null>(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const load = async () => {
    try {
      const profile = await catalogRequest<CatalogRestaurant>(
        API_URL,
        "/restaurant/me",
      );
      setRestaurant(profile);
      setError(null);
    } catch (error) {
      if (error instanceof CatalogApiError && error.status === 401)
        setRestaurant(null);
      else setError(message(error));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const login = handleSubmit(async (values) => {
    setError(null);
    try {
      await catalogRequest(API_URL, "/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify(values),
      });
      await load();
    } catch (error) {
      setError(
        error instanceof CatalogApiError && error.status === 401
          ? "Correo o contraseña incorrectos."
          : message(error),
      );
    }
  });
  const saveProduct = async (input: ProductInput) => {
    try {
      await catalogRequest(
        API_URL,
        editor === "new"
          ? "/restaurant/me/products"
          : `/restaurant/me/products/${editor!.id}`,
        {
          method: editor === "new" ? "POST" : "PATCH",
          body: JSON.stringify({
            ...input,
            ...(editor !== "new" && editor ? { version: editor.version } : {}),
          }),
        },
      );
      setEditor(null);
      await load();
      setNotice(
        "Cambios guardados. La app del usuario los recibirá en unos segundos.",
      );
    } catch (error) {
      if (error instanceof CatalogApiError && error.status === 401) {
        setRestaurant(null);
      }
      throw error;
    }
  };
  const logout = async () => {
    try {
      await catalogRequest(API_URL, "/auth/sign-out", {
        method: "POST",
        body: "{}",
      });
      setRestaurant(null);
      setEditor(null);
      setNotice(null);
    } catch (error) {
      setError(message(error));
    }
  };
  if (loading)
    return (
      <main className="mx-auto max-w-lg p-6 text-espresso" role="status">
        Comprobando sesión…
      </main>
    );
  if (!restaurant)
    return (
      <main className="mx-auto max-w-md space-y-5 px-4 py-8">
        <div className="rounded-2xl border border-cream-border bg-white p-6 space-y-5">
          <Store className="h-9 w-9 text-roasted" />
          <div>
            <p className="text-sm text-roasted">Coconea · Restaurantes</p>
            <h1 className="text-2xl font-semibold text-espresso">
              Administra tu menú
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-coffee-muted">
            Entra con la cuenta asignada a tu restaurante para editar el
            catálogo que ven los consumidores.
          </p>
          <form onSubmit={login} className="space-y-4">
            <label className="block space-y-1 text-sm font-medium">
              Correo electrónico
              <input
                {...register("email")}
                type="email"
                autoComplete="username"
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 text-sm font-medium">
              Contraseña
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className={inputClass}
              />
            </label>
            {Object.values(errors).map((error, index) => (
              <p key={index} role="alert" className="text-sm text-roasted">
                {error.message}
              </p>
            ))}
            {error && (
              <p role="alert" className="text-sm text-roasted">
                {error}
              </p>
            )}
            <button disabled={isSubmitting} className={`${buttonClass} w-full`}>
              {isSubmitting ? "Entrando…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
        <p className="text-sm text-coffee-muted">
          Entorno local de prueba. Las marcas son referencias; no hay cobros ni
          pedidos reales.
        </p>
      </main>
    );
  const filtered = restaurant.products.filter(
    (product) =>
      (category === "all" || product.category === category) &&
      `${product.name} ${product.description}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-24 text-coffee">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-border bg-white p-4">
        <div>
          <p className="text-sm text-roasted">
            Coconea · Panel del restaurante
          </p>
          <h1 className="text-xl font-semibold text-espresso">
            {restaurant.name}
          </h1>
        </div>
        <button
          onClick={logout}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cream-border px-4 text-sm"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </header>
      <p className="text-sm text-coffee-muted">
        Catálogo conectado a la app del usuario. Operación local con datos de
        prueba.
      </p>
      <nav aria-label="Panel del restaurante" className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("catalog")}
          aria-current={tab === "catalog" ? "page" : undefined}
          className={
            tab === "catalog"
              ? buttonClass
              : "rounded-full border border-cream-border bg-white px-5 py-3 text-sm"
          }
        >
          <BookOpen className="inline h-4 w-4 mr-1" />
          Mi menú
        </button>
        <button
          onClick={() => setTab("profile")}
          aria-current={tab === "profile" ? "page" : undefined}
          className={
            tab === "profile"
              ? buttonClass
              : "rounded-full border border-cream-border bg-white px-5 py-3 text-sm"
          }
        >
          <Store className="inline h-4 w-4 mr-1" />
          Mi restaurante
        </button>
      </nav>
      {notice && (
        <p
          role="status"
          className="rounded-2xl border border-cream-border bg-cream-container p-4 text-sm"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-cream-border bg-white p-4 text-sm"
        >
          {error}
        </p>
      )}
      {tab === "profile" ? (
        <RestaurantProfileEditor
          key={restaurant.version}
          restaurant={restaurant}
          onSave={async (input) => {
            await catalogRequest(API_URL, "/restaurant/me", {
              method: "PATCH",
              body: JSON.stringify(input),
            });
            await load();
            setNotice("Restaurante actualizado en el catálogo del usuario.");
          }}
        />
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-3">
            <h2 className="text-xl font-semibold text-espresso">
              Mi menú ({restaurant.products.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditor("new");
                  setNotice(null);
                }}
                className={buttonClass}
              >
                <Plus className="h-4 w-4" />
                Nuevo producto
              </button>
              <button
                aria-label="Recargar catálogo"
                onClick={load}
                className="rounded-full border border-cream-border bg-white p-3"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          {editor && (
            <ProductEditor
              key={editor === "new" ? "new" : editor.id}
              product={editor === "new" ? null : editor}
              onSave={saveProduct}
              onCancel={() => setEditor(null)}
            />
          )}
          <input
            aria-label="Buscar productos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar en mi menú"
            className={inputClass}
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[["all", "Todos"], ...Object.entries(categories)].map(
              ([value, label]) => (
                <button
                  key={value}
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                  className={`shrink-0 rounded-full border px-4 py-3 text-sm ${category === value ? "bg-espresso text-white border-espresso" : "border-cream-border bg-white text-roasted"}`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
          {!filtered.length && (
            <p role="status" className="rounded-2xl bg-white p-5">
              No hay productos para este filtro.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-cream-border bg-white"
              >
                <img
                  src={imageSource(product.image_url)}
                  alt={product.image_alt}
                  width={480}
                  height={270}
                  loading="lazy"
                  className="h-36 w-full bg-cream-soft object-contain"
                />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-espresso">
                      {product.name}
                    </h3>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrencyMXN(product.price)}
                    </span>
                  </div>
                  <p className="text-sm text-coffee-muted">
                    {product.description}
                  </p>
                  <p className="text-xs text-roasted">
                    {categories[product.category]} ·{" "}
                    {product.availability_status === "AVAILABLE"
                      ? "Disponible"
                      : "No disponible"}
                  </p>
                  <button
                    onClick={() => {
                      setEditor(product);
                      setNotice(null);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cream-border px-4 text-sm text-espresso"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar {product.name}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
