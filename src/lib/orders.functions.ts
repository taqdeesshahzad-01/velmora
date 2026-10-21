import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderItemInput = z.object({
  variantId: z.string().min(1).nullable(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const createOrderInput = z.object({
  customerName: z.string().trim().min(1, "Name is required"),
  customerPhone: z.string().trim().min(1, "Phone is required"),
  customerEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  shippingAddress: z.string().trim().min(1, "Shipping address is required"),
  city: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  notes: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  items: z.array(orderItemInput).min(1, "Your bag is empty"),
});

export type CreateOrderInput = z.input<typeof createOrderInput>;

// Order creation must run server-side with the service-role client: anon/authenticated
// clients have no INSERT grant on orders/order_items. client.server.ts's admin client is
// only imported dynamically inside the handler so the service-role key never lands in the
// client bundle (this file itself ships to the browser to register the serverFn RPC stub).
export const createOrder = createServerFn({ method: "POST" })
  .validator((data: CreateOrderInput) => createOrderInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-read current stock server-side before committing to the order — never trust
    // client-submitted stock/availability. Items without a variantId (no variant model
    // for that product) skip stock checking, matching existing product-page behavior.
    const variantIds = [...new Set(data.items.map((i) => i.variantId).filter((id): id is string => !!id))];
    const stockById = new Map<string, number>();
    if (variantIds.length > 0) {
      const { data: variants, error: stockError } = await supabaseAdmin
        .from("product_variants")
        .select("id, stock_quantity")
        .in("id", variantIds);

      if (stockError) {
        throw new Error(stockError.message);
      }

      for (const v of variants ?? []) stockById.set(v.id, v.stock_quantity);

      for (const item of data.items) {
        if (!item.variantId) continue;
        const available = stockById.get(item.variantId);
        if (available === undefined) {
          throw new Error("One of the items in your bag is no longer available.");
        }
        if (available < item.quantity) {
          throw new Error("One of the items in your bag no longer has enough stock available.");
        }
      }
    }

    const totalPrice = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail ?? null,
        shipping_address: data.shippingAddress,
        city: data.city ?? null,
        notes: data.notes ?? null,
        total_price: totalPrice,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? "Failed to create order");
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((item) => ({
        order_id: order.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
    );

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error(itemsError.message);
    }

    // Decrement stock only after the order is successfully recorded, using the stock
    // read during validation above. The .gte guard re-checks stock at write time (not
    // just that earlier read), so a concurrent order can't push a variant negative —
    // this covers realistic MVP traffic; it is not a fully serialized reservation system.
    for (const item of data.items) {
      if (!item.variantId) continue;
      const available = stockById.get(item.variantId);
      if (available === undefined) continue;
      await supabaseAdmin
        .from("product_variants")
        .update({ stock_quantity: available - item.quantity })
        .eq("id", item.variantId)
        .gte("stock_quantity", item.quantity);
    }

    return { orderId: order.id as string };
  });
