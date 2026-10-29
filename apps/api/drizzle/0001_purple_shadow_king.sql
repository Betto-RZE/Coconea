CREATE TABLE "ingredient" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"allergen_flag" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "ingredient_normalized_name_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
CREATE TABLE "product_ingredient" (
	"product_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"declaration_type" text NOT NULL,
	CONSTRAINT "product_ingredient_product_id_ingredient_id_declaration_type_pk" PRIMARY KEY("product_id","ingredient_id","declaration_type"),
	CONSTRAINT "ingredient_declaration_type" CHECK ("product_ingredient"."declaration_type" in ('CONTAINS', 'MAY_CONTAIN'))
);
--> statement-breakpoint
ALTER TABLE "product_ingredient" ADD CONSTRAINT "product_ingredient_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ingredient" ADD CONSTRAINT "product_ingredient_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE no action ON UPDATE no action;