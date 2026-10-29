export interface DemoMenuItem {
  available?: boolean;
  version?: number;
  image: string;
  imageAlt: string;
  id: string;
  restaurantId: string;
  name: string;
  category:
    | "fuertes"
    | "bowls"
    | "keto"
    | "vegano"
    | "bebidas"
    | "complementos"
    | "postres";
  categoryLabel: string;
  price: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  allergens: string[];
  safeBadges: string[];
  ingredients: string[];
  description: string;
  highlightTag?: string;
  isBeverage?: boolean;
}

export interface DemoRestaurant {
  id: string;
  name: string;
  tagline: string;
  specialty: string;
  image: string;
  imageAlt: string;
  avatarEmoji: string;
  avatarBg: string;
  cuisineCategory: "all" | "burgers" | "chicken" | "subs" | "pizza" | "salads";
  cuisineLabel: string;
  rating: number;
  reviewCount: number;
  distance: string;
  prepTime: string;
  address: string;
  verifiedBadge: string;
  badges: string[];
  menuCategories: { id: string; label: string }[];
  menu: DemoMenuItem[];
}

// -----------------------------------------------------------------------------
// CATÁLOGO DE RESTAURANTES Y MENÚS DETALLADOS
// -----------------------------------------------------------------------------

function menuReferenceImage(
  restaurantId: string,
  category: DemoMenuItem["category"],
): { image: string; imageAlt: string } {
  if (category === "bebidas")
    return {
      image: "/images/menu/drink.webp",
      imageAlt: "Imagen ilustrativa de una bebida",
    };
  if (category === "postres")
    return {
      image: "/images/menu/dessert.webp",
      imageAlt: "Imagen ilustrativa de un postre",
    };
  if (
    (restaurantId === "rest-greengrass" && category === "complementos") ||
    (restaurantId === "rest-botanica" && category === "fuertes")
  )
    return {
      image: "/images/menu/sandwich.jpg",
      imageAlt: "Imagen ilustrativa de un sándwich",
    };
  if (category === "complementos")
    return {
      image: "/images/menu/fries.webp",
      imageAlt: "Imagen ilustrativa de un complemento",
    };
  if (restaurantId === "rest-dominos")
    return {
      image: "/images/menu/pizza.jpg",
      imageAlt: "Imagen ilustrativa de una pizza",
    };
  if (restaurantId === "rest-greengrass")
    return {
      image: "/images/restaurants/greengrass.jpg",
      imageAlt: "Imagen ilustrativa de una ensalada",
    };
  if (restaurantId === "rest-pacifico")
    return {
      image: "/images/restaurants/kfc.png",
      imageAlt: "Imagen ilustrativa de pollo",
    };
  return {
    image: "/images/restaurants/mcdonalds.jpg",
    imageAlt: "Imagen ilustrativa de una hamburguesa",
  };
}

// Reference brands and imagery; all operational and menu data below are fictional.
function demoDish(
  id: string,
  restaurantId: string,
  name: string,
  price: number,
  category: DemoMenuItem["category"] = "fuertes",
): DemoMenuItem {
  return {
    id,
    restaurantId,
    name,
    price,
    category,
    ...menuReferenceImage(restaurantId, category),
    categoryLabel:
      category === "bebidas"
        ? "Bebidas"
        : category === "complementos"
          ? "Complementos"
          : category === "postres"
            ? "Postres"
            : "Especialidades",
    calories: null,
    protein: null,
    carbs: null,
    fats: null,
    allergens: ["Información de alérgenos no verificada"],
    safeBadges: [],
    ingredients: [
      "Consulta la información oficial de ingredientes y alérgenos antes de comprar.",
    ],
    description:
      "Producto de referencia para explorar la demo. Precio y composición no verificados.",
    isBeverage: category === "bebidas",
  };
}

export const DEMO_RESTAURANTS: DemoRestaurant[] = [
  {
    id: "rest-raices",
    name: "McDonald's",
    tagline: "Hamburguesas, papas y tus clásicos favoritos.",
    specialty: "Hamburguesas y complementos",
    image: "/images/restaurants/mcdonalds.jpg",
    imageAlt: "Hamburguesa de referencia de McDonald's",
    avatarEmoji: "🍔",
    avatarBg: "bg-cream-container text-espresso border-cream-border",
    cuisineCategory: "burgers",
    cuisineLabel: "Hamburguesas",
    rating: 4.8,
    reviewCount: 120,
    distance: "1.4 km",
    prepTime: "25–35 min",
    address: "Sucursal de demostración",
    verifiedBadge: "Marca de referencia · Demo",
    badges: [],
    menuCategories: [
      { id: "all", label: "Todo el menú" },
      { id: "fuertes", label: "Hamburguesas" },
      { id: "complementos", label: "Complementos" },
      { id: "postres", label: "Postres" },
      { id: "bebidas", label: "Bebidas" },
    ],
    menu: [
      demoDish("dish-r1", "rest-raices", "Big Mac", 99),
      demoDish("dish-r2", "rest-raices", "Cuarto de Libra con Queso", 109),
      demoDish("dish-r3", "rest-raices", "Hamburguesa con Queso", 59),
      demoDish("dish-r4", "rest-raices", "McPollo", 89),
      demoDish("dish-r5", "rest-raices", "McNuggets de 10 piezas", 99),
      demoDish("dish-r6", "rest-raices", "Doble Hamburguesa con Queso", 79),
      demoDish("side-r1", "rest-raices", "Papas medianas", 45, "complementos"),
      demoDish("side-r2", "rest-raices", "Papas grandes", 55, "complementos"),
      demoDish(
        "dessert-r1",
        "rest-raices",
        "Sundae de chocolate",
        39,
        "postres",
      ),
      demoDish("bev-r1", "rest-raices", "Refresco", 35, "bebidas"),
      demoDish("bev-r2", "rest-raices", "Agua embotellada", 29, "bebidas"),
      demoDish("bev-r3", "rest-raices", "Café americano", 35, "bebidas"),
    ],
  },
  {
    id: "rest-botanica",
    name: "Subway",
    tagline: "Subs para combinar a tu gusto, con vegetales y aderezos.",
    specialty: "Subs y sándwiches",
    image: "/images/restaurants/subway.png",
    imageAlt: "Sándwiches de referencia de Subway",
    avatarEmoji: "🥖",
    avatarBg: "bg-cream-container text-espresso border-cream-border",
    cuisineCategory: "subs",
    cuisineLabel: "Sándwiches",
    rating: 4.7,
    reviewCount: 95,
    distance: "2.1 km",
    prepTime: "20–30 min",
    address: "Sucursal de demostración",
    verifiedBadge: "Marca de referencia · Demo",
    badges: [],
    menuCategories: [
      { id: "all", label: "Todo el menú" },
      { id: "fuertes", label: "Subs" },
      { id: "complementos", label: "Complementos" },
      { id: "postres", label: "Postres" },
      { id: "bebidas", label: "Bebidas" },
    ],
    menu: [
      demoDish("dish-b1", "rest-botanica", "Pollo Estilo Teriyaki", 119),
      demoDish("dish-b2", "rest-botanica", "Italiano B.M.T.", 109),
      demoDish("dish-b3", "rest-botanica", "Deleite Vegetariano", 89),
      demoDish("dish-b4", "rest-botanica", "Sub de Atún", 109),
      demoDish("dish-b5", "rest-botanica", "Sub de Jamón de Pavo", 99),
      demoDish("dish-b6", "rest-botanica", "Pollo Parmesano", 119),
      demoDish("side-b1", "rest-botanica", "Papas", 35, "complementos"),
      demoDish(
        "side-b2",
        "rest-botanica",
        "Boneless Bites",
        59,
        "complementos",
      ),
      demoDish(
        "dessert-b1",
        "rest-botanica",
        "Galleta con chispas de chocolate",
        25,
        "postres",
      ),
      demoDish("bev-b1", "rest-botanica", "Agua embotellada", 29, "bebidas"),
      demoDish(
        "bev-b2",
        "rest-botanica",
        "Bebida de dispensador",
        35,
        "bebidas",
      ),
      demoDish(
        "bev-b3",
        "rest-botanica",
        "Té negro embotellado",
        39,
        "bebidas",
      ),
    ],
  },
  {
    id: "rest-pacifico",
    name: "KFC",
    tagline: "Pollo crujiente y opciones para compartir.",
    specialty: "Pollo y complementos",
    image: "/images/restaurants/kfc.png",
    imageAlt: "Bucket de pollo de referencia de KFC",
    avatarEmoji: "🍗",
    avatarBg: "bg-cream-container text-espresso border-cream-border",
    cuisineCategory: "chicken",
    cuisineLabel: "Pollo",
    rating: 4.6,
    reviewCount: 110,
    distance: "1.8 km",
    prepTime: "30–40 min",
    address: "Sucursal de demostración",
    verifiedBadge: "Marca de referencia · Demo",
    badges: [],
    menuCategories: [
      { id: "all", label: "Todo el menú" },
      { id: "fuertes", label: "Pollo y combos" },
      { id: "complementos", label: "Complementos" },
      { id: "postres", label: "Postres" },
      { id: "bebidas", label: "Bebidas" },
    ],
    menu: [
      demoDish("dish-p1", "rest-pacifico", "Bucket 12 piezas", 499),
      demoDish("dish-p2", "rest-pacifico", "Megabox Big Krunch", 199),
      demoDish("dish-p3", "rest-pacifico", "Pieza de pollo", 49),
      demoDish("dish-p4", "rest-pacifico", "Megabox La Secreta Burger", 219),
      demoDish("dish-p5", "rest-pacifico", "Megabox Ke-Tiras", 169),
      demoDish("dish-p6", "rest-pacifico", "Bucket de 8 piezas", 359),
      demoDish(
        "side-p1",
        "rest-pacifico",
        "Puré individual",
        45,
        "complementos",
      ),
      demoDish(
        "side-p2",
        "rest-pacifico",
        "Bisquet original",
        25,
        "complementos",
      ),
      demoDish("dessert-p1", "rest-pacifico", "Pay de manzana", 39, "postres"),
      demoDish("bev-p1", "rest-pacifico", "Refresco de lata", 35, "bebidas"),
      demoDish("bev-p2", "rest-pacifico", "Agua embotellada", 29, "bebidas"),
      demoDish("bev-p3", "rest-pacifico", "Refresco familiar", 65, "bebidas"),
    ],
  },
  {
    id: "rest-dominos",
    name: "Domino's",
    tagline: "Pizzas clásicas y especialidades para compartir.",
    specialty: "Pizzas y complementos",
    image: "/images/restaurants/dominos.svg",
    imageAlt: "Logotipo de referencia de Domino's",
    avatarEmoji: "🍕",
    avatarBg: "bg-cream-container text-espresso border-cream-border",
    cuisineCategory: "pizza",
    cuisineLabel: "Pizza",
    rating: 4.7,
    reviewCount: 130,
    distance: "2.3 km",
    prepTime: "30–45 min",
    address: "Sucursal de demostración",
    verifiedBadge: "Marca de referencia · Demo",
    badges: [],
    menuCategories: [
      { id: "all", label: "Todo el menú" },
      { id: "fuertes", label: "Pizzas" },
      { id: "complementos", label: "Complementos" },
      { id: "postres", label: "Postres" },
      { id: "bebidas", label: "Bebidas" },
    ],
    menu: [
      demoDish("dish-d1", "rest-dominos", "Pizza de pepperoni", 199),
      demoDish("dish-d2", "rest-dominos", "Pizza hawaiana", 219),
      demoDish("dish-d3", "rest-dominos", "Pizza mexicana", 239),
      demoDish("dish-d4", "rest-dominos", "Pizza de cuatro quesos", 239),
      demoDish("dish-d5", "rest-dominos", "Pizza vegetariana", 219),
      demoDish("dish-d6", "rest-dominos", "Pizza de carnes", 249),
      demoDish("side-d1", "rest-dominos", "Papotas", 69, "complementos"),
      demoDish("side-d2", "rest-dominos", "Pan de ajo", 59, "complementos"),
      demoDish("dessert-d1", "rest-dominos", "Baitz de canela", 69, "postres"),
      demoDish("bev-d1", "rest-dominos", "Refresco individual", 35, "bebidas"),
      demoDish("bev-d2", "rest-dominos", "Refresco familiar", 65, "bebidas"),
      demoDish("bev-d3", "rest-dominos", "Agua embotellada", 29, "bebidas"),
    ],
  },
  {
    id: "rest-greengrass",
    name: "Green Grass",
    tagline: "Ensaladas, bowls y chapatas para variar tu semana.",
    specialty: "Ensaladas y chapatas",
    image: "/images/restaurants/greengrass.jpg",
    imageAlt: "Ensalada de referencia de Green Grass",
    avatarEmoji: "🥗",
    avatarBg: "bg-cream-container text-espresso border-cream-border",
    cuisineCategory: "salads",
    cuisineLabel: "Ensaladas",
    rating: 4.8,
    reviewCount: 85,
    distance: "1.9 km",
    prepTime: "20–35 min",
    address: "Sucursal de demostración",
    verifiedBadge: "Marca de referencia · Demo",
    badges: [],
    menuCategories: [
      { id: "all", label: "Todo el menú" },
      { id: "fuertes", label: "Ensaladas" },
      { id: "complementos", label: "Chapatas" },
      { id: "bebidas", label: "Bebidas" },
    ],
    menu: [
      demoDish("dish-g1", "rest-greengrass", "Cesar & Bacon", 159),
      demoDish("dish-g2", "rest-greengrass", "Parmesan Grilled Chicken", 169),
      demoDish("dish-g3", "rest-greengrass", "Chicken Club Ranch", 169),
      demoDish("dish-g4", "rest-greengrass", "Asian Tuna Rice", 179),
      demoDish("dish-g5", "rest-greengrass", "Balsamic Red Apple", 159),
      demoDish("dish-g6", "rest-greengrass", "Guacamole Chic", 169),
      demoDish(
        "side-g1",
        "rest-greengrass",
        "Chapata Rustic Pesto",
        139,
        "complementos",
      ),
      demoDish(
        "side-g2",
        "rest-greengrass",
        "Chapata Italian Chicken Bacon",
        149,
        "complementos",
      ),
      demoDish(
        "side-g3",
        "rest-greengrass",
        "Green Club Sándwich",
        149,
        "complementos",
      ),
      demoDish("bev-g1", "rest-greengrass", "Agua embotellada", 29, "bebidas"),
      demoDish("bev-g2", "rest-greengrass", "Agua de limón", 39, "bebidas"),
      demoDish("bev-g3", "rest-greengrass", "Té frío", 39, "bebidas"),
    ],
  },
];
