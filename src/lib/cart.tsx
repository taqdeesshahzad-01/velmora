import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import type { ProductVariant } from "@/lib/products";

export type CartItem = {
  slug: string;
  variantId: string | null;
  color: string | null;
  shape: string | null;
  length: string | null;
  size: string | null;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (p: Product, variant?: ProductVariant | null) => void;
  setQty: (slug: string, variantId: string | null, qty: number) => void;
  remove: (slug: string, variantId: string | null) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "velmora-cart";

function isSameLine(item: CartItem, slug: string, variantId: string | null) {
  return item.slug === slug && item.variantId === variantId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(
          parsed.map((i) => ({
            ...i,
            variantId: i.variantId ?? null,
            color: i.color ?? null,
            shape: i.shape ?? null,
            length: i.length ?? null,
            size: i.size ?? null,
          })),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      add: (p, variant = null) =>
        setItems((prev) => {
          const variantId = variant?.id ?? null;
          const found = prev.find((i) => isSameLine(i, p.slug, variantId));
          if (found)
            return prev.map((i) => (isSameLine(i, p.slug, variantId) ? { ...i, qty: i.qty + 1 } : i));
          return [
            ...prev,
            {
              slug: p.slug,
              variantId,
              color: variant?.color ?? null,
              shape: variant?.shape ?? null,
              length: variant?.length ?? null,
              size: variant?.size ?? null,
              name: p.name,
              price: p.price,
              image: p.image,
              qty: 1,
            },
          ];
        }),
      setQty: (slug, variantId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => !isSameLine(i, slug, variantId))
            : prev.map((i) => (isSameLine(i, slug, variantId) ? { ...i, qty } : i)),
        ),
      remove: (slug, variantId) =>
        setItems((prev) => prev.filter((i) => !isSameLine(i, slug, variantId))),
      clear: () => setItems([]),
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      count: items.reduce((s, i) => s + i.qty, 0),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
