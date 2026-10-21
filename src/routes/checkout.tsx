import { useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/SectionHeading";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/orders.functions";
import { DEMO_MODE, formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout | VELMORA" }, { name: "robots", content: "noindex" }],
  }),
  component: Checkout,
});

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "address", string>>;

function validate(values: { name: string; phone: string; email: string; address: string }) {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  const digits = values.phone.replace(/[^\d]/g, "");
  if (!values.phone.trim()) errors.phone = "Enter a phone number we can reach you on.";
  else if (digits.length < 10 || digits.length > 15)
    errors.phone = "Enter a valid phone number with 10 to 15 digits.";
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address, or leave this blank.";
  if (!values.address.trim()) errors.address = "Enter your full delivery address.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  );
}

function Checkout() {
  const { items, total, clear } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submittingRef = useRef(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    setError(null);

    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
    };
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = Object.keys(errors)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const result = await createOrder({
        data: {
          customerName: values.name,
          customerPhone: values.phone,
          customerEmail: values.email,
          shippingAddress: values.address,
          city: String(form.get("city") ?? ""),
          notes: String(form.get("notes") ?? ""),
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.qty,
            price: i.price,
          })),
        },
      });
      clear();
      setOrderId(result.orderId);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Your bag has not been cleared — please review it and try again.`
          : "We couldn't place your order just now. Your bag has not been cleared — please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center md:py-28">
        <SectionHeading eyebrow="Thank you" title="Order Placed" />
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Your order{" "}
          <span className="font-medium text-foreground">#{orderId.slice(0, 8)}</span> has been
          recorded with Cash on Delivery as the payment method.
        </p>
        {DEMO_MODE && (
          <p className="mt-4 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            This is a portfolio demonstration. Orders placed here are test orders and will not be
            fulfilled.
          </p>
        )}
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-base text-muted-foreground">Your bag is empty.</p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/shop">Shop the Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <SectionHeading align="left" eyebrow="Checkout" title="Complete Your Order" />

      <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
        <form onSubmit={handleSubmit} noValidate className="order-2 space-y-8 md:order-1">
          {DEMO_MODE && (
            <p
              role="note"
              className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
            >
              Portfolio demo: orders placed here are test orders and will not be fulfilled.
            </p>
          )}

          <fieldset className="space-y-4" disabled={submitting}>
            <legend className="font-display text-xl">Your details</legend>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                className="mt-1.5 h-11 text-base"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              <FieldError id="name-error" message={fieldErrors.name} />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-1.5 h-11 text-base"
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              />
              <FieldError id="phone-error" message={fieldErrors.phone} />
            </div>
            <div>
              <Label htmlFor="email">
                Email <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1.5 h-11 text-base"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              <FieldError id="email-error" message={fieldErrors.email} />
            </div>
          </fieldset>

          <fieldset className="space-y-4" disabled={submitting}>
            <legend className="font-display text-xl">Delivery address</legend>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                rows={3}
                autoComplete="street-address"
                className="mt-1.5 text-base"
                aria-invalid={!!fieldErrors.address}
                aria-describedby={fieldErrors.address ? "address-error" : undefined}
              />
              <FieldError id="address-error" message={fieldErrors.address} />
            </div>
            <div>
              <Label htmlFor="city">
                City <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="city"
                name="city"
                autoComplete="address-level2"
                className="mt-1.5 h-11 text-base"
              />
            </div>
            <div>
              <Label htmlFor="notes">
                Order notes <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea id="notes" name="notes" rows={3} className="mt-1.5 text-base" />
            </div>
          </fieldset>

          <div>
            <h2 className="font-display text-xl">Payment</h2>
            <div className="mt-3 rounded-xl border border-primary/40 bg-secondary/40 px-4 py-3">
              <p className="text-sm font-medium">Cash on Delivery</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                No card details are required on this website.
              </p>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/40 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="h-12 w-full text-base" size="lg" disabled={submitting}>
            {submitting ? "Placing your order…" : "Place Order"}
          </Button>
        </form>

        <aside className="order-1 md:order-2 md:sticky md:top-24 md:self-start">
          <div className="card-soft p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <div className="mt-5 space-y-5">
              {items.map((i) => (
                <div key={`${i.slug}:${i.variantId ?? ""}`} className="flex gap-4">
                  <img
                    src={i.image}
                    alt={i.name}
                    loading="lazy"
                    className="h-20 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-snug">{i.name}</p>
                    {(i.color || i.shape || i.length || i.size) && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {[i.color, i.shape, i.length, i.size].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Qty {i.qty} × {formatPKR(i.price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">{formatPKR(i.price * i.qty)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl">{formatPKR(total)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Payment method: Cash on Delivery.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
