export type CatalogCategory =
  "burgers" | "pizza" | "salads" | "chicken" | "subs";
export type ProductCategory =
  "fuertes" | "complementos" | "postres" | "bebidas";
export interface IngredientDeclaration {
  ingredient_id: string;
  name: string;
  declaration_type: "CONTAINS" | "MAY_CONTAIN";
}
export interface CatalogProduct {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: string;
  currency: "MXN";
  category: ProductCategory;
  image_url: string;
  image_alt: string;
  availability_status: "AVAILABLE" | "UNAVAILABLE";
  ingredient_disclosure_status: "UNKNOWN" | "PARTIAL" | "COMPLETE";
  ingredients: IngredientDeclaration[];
  allergens: string[];
  version: number;
  updated_at: string;
}
export interface CatalogRestaurant {
  id: string;
  name: string;
  description: string;
  category: CatalogCategory;
  image_url: string;
  image_alt: string;
  version: number;
  updated_at: string;
  products: CatalogProduct[];
}
export interface ProductInput {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  image_url: string;
  image_alt: string;
  availability_status: "AVAILABLE" | "UNAVAILABLE";
  ingredient_disclosure_status: "UNKNOWN" | "PARTIAL" | "COMPLETE";
  ingredients: IngredientDeclaration[];
  allergens: string[];
}
