import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  productQueryOptions,
  productsQueryOptions,
  type ProductDetail,
  type ProductVariant,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { cn, formatPKR } from "@/lib/utils";

type VariantDimension = "color" | "shape" | "length" | "size";

function distinctValues(variants: ProductVariant[], key: VariantDimension) {
  const values = new Set<string>();
  for (const v of variants) {
    const val = v[key];
    if (val) values.add(val);
  }
  return Array.from(values);
}

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.slug));
    if (!product) throw notFound();
    return product;
  },
  pendingComponent: () => (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid animate-pulse gap-10 md:grid-cols-2">
        <div className="aspect-[4/5] w-full rounded-3xl bg-secondary" />
        <div className="space-y-4">
          <div className="h-9 w-2/3 rounded bg-secondary" />
          <div className="h-4 w-1/4 rounded bg-secondary" />
          <div className="h-24 w-full rounded bg-secondary" />
        </div>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-6xl px-5 py-24 text-center text-sm text-muted-foreground">
      We couldn't load this set just now. Please refresh in a moment.
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-5 py-24 text-center text-sm text-muted-foreground">
      This set isn't available right now.
    </div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Not found | VELMORA" }, { name: "robots", content: "noindex" }],
      };
    const title = `${loaderData.name} Press-On Nails | VELMORA`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQueryOptions(slug));
  const loaded = Route.useLoaderData();
  const product = data ?? loaded;
  const { data: all = [] } = useQuery(productsQueryOptions);
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ProductDetailSection key={product.id} product={product} />

      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <SectionHeading title="You May Also Love" />
          <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductDetailSection({ product }: { product: ProductDetail }) {
  const { add } = useCart();
  const variants = product.variants;
  const hasVariants = variants.length > 0;

  const gallery = product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  const colorOptions = useMemo(() => distinctValues(variants, "color"), [variants]);
  const shapeOptions = useMemo(() => distinctValues(variants, "shape"), [variants]);
  const lengthOptions = useMemo(() => distinctValues(variants, "length"), [variants]);
  const sizeOptions = useMemo(() => distinctValues(variants, "size"), [variants]);

  const preferredVariant = variants.find((v) => v.stock_quantity > 0) ?? variants[0];
  const [selectedColor, setSelectedColor] = useState(
    preferredVariant?.color ?? colorOptions[0] ?? "",
  );
  const [selectedShape, setSelectedShape] = useState(
    preferredVariant?.shape ?? shapeOptions[0] ?? "",
  );
  const [selectedLength, setSelectedLength] = useState(
    preferredVariant?.length ?? lengthOptions[0] ?? "",
  );
  const [selectedSize, setSelectedSize] = useState(preferredVariant?.size ?? sizeOptions[0] ?? "");

  const matchedVariant = variants.find((v) => {
    if (colorOptions.length && v.color !== selectedColor) return false;
    if (shapeOptions.length && v.shape !== selectedShape) return false;
    if (lengthOptions.length && v.length !== selectedLength) return false;
    if (sizeOptions.length && v.size !== selectedSize) return false;
    return true;
  });

  const isUnavailable = hasVariants ? !matchedVariant || matchedVariant.stock_quantity <= 0 : false;
  const isLowStock =
    !!matchedVariant && matchedVariant.stock_quantity > 0 && matchedVariant.stock_quantity <= 5;

  const stockLabel = !hasVariants
    ? null
    : !matchedVariant
      ? "This combination isn't available"
      : matchedVariant.stock_quantity <= 0
        ? "Out of stock"
        : isLowStock
          ? "Low stock"
          : "In stock";

  const staticAttributes = [
    ["Colour", colorOptions.length <= 1 ? product.color : ""],
    ["Shape", shapeOptions.length <= 1 ? product.shape : ""],
    ["Length", lengthOptions.length <= 1 ? product.length : ""],
  ].filter(([, value]) => value);

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
      <div className="md:sticky md:top-24 md:self-start">
        <img
          src={gallery[activeImage]}
          alt={`${product.name} press-on nails`}
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
        />
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1} of ${product.name}`}
                aria-current={i === activeImage}
                className={cn(
                  "aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                  i === activeImage ? "border-primary" : "border-transparent",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.collection && (
          <p className="text-xs uppercase tracking-[0.24em] text-accent-foreground">
            {product.collection}
          </p>
        )}
        <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-2xl font-medium text-accent-foreground">
          {formatPKR(product.price)}
        </p>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-8 space-y-6 border-t border-border pt-8">
          {staticAttributes.length > 0 && (
            <dl className="grid grid-cols-3 gap-4 text-sm">
              {staticAttributes.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {colorOptions.length > 1 && (
            <VariantPicker
              label="Colour"
              options={colorOptions}
              selected={selectedColor}
              onSelect={setSelectedColor}
              isAvailable={(opt) => variants.some((v) => v.color === opt && v.stock_quantity > 0)}
            />
          )}
          {shapeOptions.length > 1 && (
            <VariantPicker
              label="Shape"
              options={shapeOptions}
              selected={selectedShape}
              onSelect={setSelectedShape}
              isAvailable={(opt) => variants.some((v) => v.shape === opt && v.stock_quantity > 0)}
            />
          )}
          {lengthOptions.length > 1 && (
            <VariantPicker
              label="Length"
              options={lengthOptions}
              selected={selectedLength}
              onSelect={setSelectedLength}
              isAvailable={(opt) => variants.some((v) => v.length === opt && v.stock_quantity > 0)}
            />
          )}
          {sizeOptions.length > 0 && (
            <VariantPicker
              label="Size"
              options={sizeOptions}
              selected={selectedSize}
              onSelect={setSelectedSize}
              isAvailable={(opt) => variants.some((v) => v.size === opt && v.stock_quantity > 0)}
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="-my-2 py-2.5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Size guide
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl font-light">
                        Size guide
                      </DialogTitle>
                      <DialogDescription>
                        Choosing the size that fits your natural nails.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Compare the width of each of your natural nails, at the widest point, with the
                      sizes offered for this set, and choose the closest match. If you are between
                      sizes, the larger size is usually the more comfortable choice.
                    </p>
                  </DialogContent>
                </Dialog>
              }
            />
          )}

          {stockLabel && (
            <div className="flex flex-wrap items-center gap-3" aria-live="polite">
              <Badge variant={isUnavailable ? "destructive" : isLowStock ? "outline" : "secondary"}>
                {stockLabel}
              </Badge>
              {matchedVariant && (
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {[selectedColor, selectedShape, selectedLength, selectedSize]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="mt-8 h-12 w-full text-base"
          disabled={isUnavailable}
          onClick={() => {
            add(product, matchedVariant ?? null);
            toast("Added to bag", { description: product.name });
          }}
        >
          {isUnavailable ? "Unavailable" : "Add to Cart"}
        </Button>

        <Accordion type="single" collapsible className="mt-10">
          <AccordionItem value="set">
            <AccordionTrigger>What&rsquo;s in a set</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Each set contains 10 nails.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sizing">
            <AccordionTrigger>Sizing</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Choose the size closest to the width of your natural nails. The sizes offered for this
              set are shown above.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery">
            <AccordionTrigger>Payment, delivery &amp; returns</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Checkout offers Cash on Delivery. Delivery details and the returns policy have not
              been finalised yet and will be published before real orders open.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function VariantPicker({
  label,
  options,
  selected,
  onSelect,
  isAvailable,
  action,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  isAvailable: (value: string) => boolean;
  action?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {action}
      </div>
      <ToggleGroup
        type="single"
        value={selected}
        onValueChange={(value) => value && onSelect(value)}
        aria-label={label}
        className="mt-2.5 flex-wrap justify-start gap-2"
      >
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt}
            value={opt}
            disabled={!isAvailable(opt)}
            className="h-10 min-w-12 rounded-full border border-input px-4 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground disabled:line-through"
            aria-label={`${label}: ${opt}${!isAvailable(opt) ? " (out of stock)" : ""}`}
          >
            {opt}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
