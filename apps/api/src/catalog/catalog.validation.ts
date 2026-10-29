import { z } from "zod";
const image = z
  .string()
  .max(1000)
  .refine(
    (value) =>
      /^\/images\/[\w/.-]+$/.test(value) ||
      (/^https:\/\//.test(value) && URL.canParse(value)),
    "La imagen debe ser una ruta /images/ o una URL HTTPS.",
  );
export const productFields = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(5).max(2000),
    price: z
      .string()
      .regex(/^(?:0|[1-9]\d{0,7})\.\d{2}$/)
      .refine((value) => value !== "0.00", "El precio debe ser positivo."),
    category: z.enum(["fuertes", "complementos", "postres", "bebidas"]),
    image_url: image,
    image_alt: z.string().trim().min(2).max(200),
    availability_status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
    ingredient_disclosure_status: z.enum(["UNKNOWN", "PARTIAL", "COMPLETE"]),
    ingredients: z
      .array(
        z
          .object({
            ingredient_id: z.string().min(1).max(100),
            name: z.string().trim().min(1).max(120).optional(),
            declaration_type: z.enum(["CONTAINS", "MAY_CONTAIN"]),
          })
          .strict(),
      )
      .max(50),
    allergens: z.array(z.string().trim().min(1).max(120)).max(50),
  })
  .strict();
export const createProductSchema = productFields.refine(
  (value) =>
    value.ingredient_disclosure_status !== "COMPLETE" ||
    value.ingredients.length > 0,
  "Declara ingredientes antes de marcar la información como completa.",
);
export const updateProductSchema = productFields
  .extend({ version: z.number().int().positive() })
  .strict()
  .refine(
    (value) =>
      value.ingredient_disclosure_status !== "COMPLETE" ||
      value.ingredients.length > 0,
    "Declara ingredientes antes de marcar la información como completa.",
  );
export const updateRestaurantSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(5).max(1000),
    image_url: image,
    image_alt: z.string().trim().min(2).max(200),
    version: z.number().int().positive(),
  })
  .strict();
