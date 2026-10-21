import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { TablesUpdate } from "@/integrations/supabase/types";

// Plain text column in `orders`, no DB enum — this is the app-level allowed set,
// validated here and reused by the admin UI's status selector.
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const LOW_STOCK_THRESHOLD = 5; // matches the customer-facing "Only N left" threshold

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("id, customer_name, total_price, order_status, created_at")
      .order("created_at", { ascending: false });

    if (ordersError) throw new Error(ordersError.message);

    const allOrders = orders ?? [];
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter((o) => o.order_status === "pending").length;
    const revenue = allOrders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_price), 0);
    const recentOrders = allOrders.slice(0, 8);

    const { data: variants, error: variantsError } = await supabaseAdmin
      .from("product_variants")
      .select("id, shape, length, size, color, stock_quantity, products(name)")
      .lte("stock_quantity", LOW_STOCK_THRESHOLD)
      .order("stock_quantity", { ascending: true })
      .limit(10);

    if (variantsError) throw new Error(variantsError.message);

    return {
      totalOrders,
      pendingOrders,
      revenue,
      recentOrders,
      lowStockVariants: variants ?? [],
    };
  });

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

const listOrdersInput = z.object({
  search: z.string().trim().optional(),
  status: z.enum(ORDER_STATUSES).optional(),
});

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: z.input<typeof listOrdersInput>) => listOrdersInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin
      .from("orders")
      .select("id, customer_name, customer_phone, total_price, order_status, created_at")
      .order("created_at", { ascending: false });

    if (data.status) query = query.eq("order_status", data.status);
    if (data.search) {
      query = query.or(`customer_name.ilike.%${data.search}%,customer_phone.ilike.%${data.search}%`);
    }

    const { data: orders, error } = await query;
    if (error) throw new Error(error.message);
    return orders ?? [];
  });

const orderIdInput = z.object({ orderId: z.string().uuid() });

export const getOrderDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: z.input<typeof orderIdInput>) => orderIdInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, customer_name, customer_phone, customer_email, shipping_address, city, notes, total_price, order_status, created_at, order_items(id, quantity, price, product_variants(id, shape, length, size, color, products(name, slug)))",
      )
      .eq("id", data.orderId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    return order;
  });

const updateOrderStatusInput = z.object({
  orderId: z.string().uuid(),
  status: z.enum(ORDER_STATUSES),
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: z.input<typeof updateOrderStatusInput>) => updateOrderStatusInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: updated, error } = await supabaseAdmin
      .from("orders")
      .update({ order_status: data.status })
      .eq("id", data.orderId)
      .select("id, order_status")
      .single();

    if (error || !updated) throw new Error(error?.message ?? "Failed to update order status");
    return updated;
  });

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, slug, description, category, price, active, featured, product_variants(stock_quantity)",
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((p) => {
      const { product_variants, ...rest } = p;
      return {
        ...rest,
        totalStock: (product_variants ?? []).reduce((s, v) => s + v.stock_quantity, 0),
      };
    });
  });

const updateProductInput = z.object({
  productId: z.string().uuid(),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  price: z.number().positive().optional(),
  category: z.string().trim().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: z.input<typeof updateProductInput>) => updateProductInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { productId, ...fields } = data;
    const changes: TablesUpdate<"products"> = {};
    if (fields.name !== undefined) changes.name = fields.name;
    if (fields.description !== undefined) changes.description = fields.description;
    if (fields.price !== undefined) changes.price = fields.price;
    if (fields.category !== undefined) changes.category = fields.category;
    if (fields.active !== undefined) changes.active = fields.active;
    if (fields.featured !== undefined) changes.featured = fields.featured;

    const { data: updated, error } = await supabaseAdmin
      .from("products")
      .update(changes)
      .eq("id", productId)
      .select("id, name, slug, category, price, active, featured")
      .single();

    if (error || !updated) throw new Error(error?.message ?? "Failed to update product");
    return updated;
  });

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const listInventory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data, error } = await supabaseAdmin
      .from("product_variants")
      .select("id, product_id, shape, length, size, color, stock_quantity, products(name)")
      .order("stock_quantity", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

const updateStockInput = z.object({
  variantId: z.string().uuid(),
  stock: z.number().int().nonnegative(),
});

export const updateStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: z.input<typeof updateStockInput>) => updateStockInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: updated, error } = await supabaseAdmin
      .from("product_variants")
      .update({ stock_quantity: data.stock })
      .eq("id", data.variantId)
      .select("id, stock_quantity")
      .single();

    if (error || !updated) throw new Error(error?.message ?? "Failed to update stock");
    return updated;
  });
