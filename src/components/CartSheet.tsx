import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/utils";

export function CartSheet({ children }: { children: ReactNode }) {
  const { items, setQty, remove, total } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-light">Your Bag</SheetTitle>
          <SheetDescription className="sr-only">Items in your shopping bag</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
          {items.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              <Button asChild variant="outline" className="mt-5" onClick={() => setOpen(false)}>
                <Link to="/shop">Shop the Collection</Link>
              </Button>
            </div>
          )}
          {items.map((i) => (
            <div key={`${i.slug}:${i.variantId ?? ""}`} className="flex gap-4">
              <img
                src={i.image}
                alt={i.name}
                loading="lazy"
                className="h-24 w-[4.5rem] shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg leading-snug">{i.name}</p>
                  <p className="shrink-0 text-sm font-medium">{formatPKR(i.price * i.qty)}</p>
                </div>
                {(i.color || i.shape || i.length || i.size) && (
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {[i.color, i.shape, i.length, i.size].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-0.5 text-sm text-muted-foreground">{formatPKR(i.price)} each</p>
                <div className="mt-3 flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    aria-label={`Decrease quantity of ${i.name}`}
                    onClick={() => setQty(i.slug, i.variantId, i.qty - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-9 text-center text-sm" aria-live="polite">
                    {i.qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    aria-label={`Increase quantity of ${i.name}`}
                    onClick={() => setQty(i.slug, i.variantId, i.qty + 1)}
                  >
                    <Plus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-9 w-9 text-muted-foreground"
                    aria-label={`Remove ${i.name}`}
                    onClick={() => remove(i.slug, i.variantId)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-display text-xl">{formatPKR(total)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Payment is Cash on Delivery.</p>
          {items.length === 0 ? (
            <Button className="mt-4 h-12 w-full text-base" size="lg" disabled>
              Checkout
            </Button>
          ) : (
            <Button className="mt-4 h-12 w-full text-base" size="lg" asChild>
              <Link to="/checkout" onClick={() => setOpen(false)}>
                Checkout
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
