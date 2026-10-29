import type { CatalogRestaurant } from "@coconea/types";
import { DEMO_RESTAURANTS, type DemoRestaurant } from "./demo-catalog";

/** Maps public API contracts to the existing presentation model; prices remain authoritative on the API. */
export function catalogToPresentation(
  catalog: CatalogRestaurant[],
): DemoRestaurant[] {
  return catalog.map((restaurant) => {
    const fixture =
      DEMO_RESTAURANTS.find((item) => item.id === restaurant.id) ||
      DEMO_RESTAURANTS[0];
    if (!fixture)
      throw new Error("No hay configuración de presentación del catálogo.");
    const categories = Array.from(
      new Set(restaurant.products.map((product) => product.category)),
    );
    const labels = {
      fuertes: "Especialidades",
      complementos: "Complementos",
      bebidas: "Bebidas",
      postres: "Postres",
    };
    return {
      ...fixture,
      id: restaurant.id,
      name: restaurant.name,
      tagline: restaurant.description,
      image: restaurant.image_url,
      imageAlt: restaurant.image_alt,
      cuisineCategory: restaurant.category,
      badges: [],
      menuCategories: [
        { id: "all", label: "Todo el menú" },
        ...categories.map((category) => ({
          id: category,
          label: labels[category],
        })),
      ],
      menu: restaurant.products.map((product) => ({
        id: product.id,
        restaurantId: product.restaurant_id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        categoryLabel: labels[product.category],
        image: product.image_url,
        imageAlt: product.image_alt,
        available: product.availability_status === "AVAILABLE",
        version: product.version,
        isBeverage: product.category === "bebidas",
        calories: null,
        protein: null,
        carbs: null,
        fats: null,
        safeBadges: [],
        ingredients: product.ingredients.length
          ? product.ingredients.map(
              (ingredient) =>
                `${ingredient.declaration_type === "MAY_CONTAIN" ? "Puede contener: " : ""}${ingredient.name}`,
            )
          : ["Información de ingredientes no disponible."],
        allergens:
          product.ingredient_disclosure_status === "UNKNOWN"
            ? ["Información de alérgenos no verificada", ...product.allergens]
            : [
                "Declaración del restaurante; no garantiza ausencia de contaminación cruzada.",
                ...product.allergens,
              ],
      })),
    };
  });
}
