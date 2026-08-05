import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLACEHOLDER_IMAGE, type Product } from "@/data/products";

export type ProductVariant = {
  id: string;
  shape: string | null;
  length: string | null;
  size: string | null;
  stock_quantity: number;
};

export type ProductDetail = Product & {
  images: string[];
  variants: ProductVariant[];
};

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  featured: boolean;
  active: boolean;
  product_images: { image_url: string; display_order: number }[] | null;
  product_variants: ProductVariant[] | null;
};

const SELECT =
  "id,name,slug,description,price,category,featured,active,product_images(image_url,display_order),product_variants(id,shape,length,size,stock_quantity)";

function mapRow(row: Row): ProductDetail {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => i.image_url);
  const variants = row.product_variants ?? [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    image: images[0] ?? PLACEHOLDER_IMAGE,
    images,
    variants,
    shape: variants.find((v) => v.shape)?.shape ?? "",
    length: variants.find((v) => v.length)?.length ?? "",
    color: "",
    collection: row.category ?? "",
    bestSeller: row.featured,
    description: row.description ?? "",
  };
}
// ---------------------------------------------------------------------
// export async function fetchProducts(): Promise<ProductDetail[]> {
//   const { data, error } = await supabase
//     .from("products")
//     .select(SELECT)
//     .eq("active", true)
//     .order("created_at", { ascending: false });

//   console.log("SUPABASE DATA:", data);
//   console.log("SUPABASE ERROR:", error);

//   if (error) throw new Error(error.message);

//   return ((data ?? []) as unknown as Row[]).map(mapRow);
// }

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as unknown as Row) : null;
}
// ------------------------------------------------------------

export async function fetchProducts(): Promise<ProductDetail[]> {
  console.log("===== FETCH PRODUCTS START =====");

  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("created_at", { ascending: false });

  console.log("SUPABASE ERROR:", error);
  console.log("RAW DATA:", data);

  if (data) {
    console.table(data);
  }

  if (error) {
    throw new Error(error.message);
  }

  const mapped = ((data ?? []) as Row[]).map(mapRow);

  console.log("MAPPED PRODUCTS:", mapped);

  console.table(
    mapped.map((p) => ({
      name: p.name,
      featured: p.bestSeller,
      active: true,
      image: p.image,
      shape: p.shape,
      length: p.length,
    }))
  );

  console.log("===== FETCH PRODUCTS END =====");

  return mapped;
}
export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

export const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });
