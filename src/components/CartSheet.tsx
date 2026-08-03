import type { ReactNode } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";

export function CartSheet({ children }: { children: ReactNode }) {
  const { items, setQty, remove, total } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-light">Your Bag</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          )}
          {items.map((i) => (
            <div key={i.slug} className="flex gap-3">
              <img
                src={i.image}
                alt={i.name}
                loading="lazy"
                className="h-20 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-sm text-muted-foreground">${i.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    aria-label={`Decrease quantity of ${i.name}`}
                    onClick={() => setQty(i.slug, i.qty - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-6 text-center text-sm">{i.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    aria-label={`Increase quantity of ${i.name}`}
                    onClick={() => setQty(i.slug, i.qty + 1)}
                  >
                    <Plus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-7 w-7 text-muted-foreground"
                    aria-label={`Remove ${i.name}`}
                    onClick={() => remove(i.slug)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <Button
            className="mt-4 w-full"
            size="lg"
            disabled={items.length === 0}
            onClick={() => toast("Checkout coming soon", { description: "Payments launch shortly." })}
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
