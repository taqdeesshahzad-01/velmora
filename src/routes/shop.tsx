import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/lib/products";
import { formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { collection?: string } =>
    typeof s["collection"] === "string" ? { collection: s["collection"] } : {},
  head: () => ({
    meta: [
      { title: "Shop Press-On Nails | VELMORA" },
      {
        name: "description",
        content: "Browse VELMORA press-on nail sets by shape, length, colour and price.",
      },
      { property: "og:title", content: "Shop Press-On Nails | VELMORA" },
      { property: "og:description", content: "Press-on nail sets by shape, length, colour and price." },
    ],
  }),
  component: Shop,
});

const ALL = "All";
const PRICE_BUCKET_1 = 2500;
const PRICE_BUCKET_2 = 5000;
const prices = [
  { label: ALL, test: () => true },
  { label: `Under ${formatPKR(PRICE_BUCKET_1)}`, test: (p: number) => p < PRICE_BUCKET_1 },
  {
    label: `${formatPKR(PRICE_BUCKET_1)} – ${formatPKR(PRICE_BUCKET_2)}`,
    test: (p: number) => p >= PRICE_BUCKET_1 && p <= PRICE_BUCKET_2,
  },
  { label: `Over ${formatPKR(PRICE_BUCKET_2)}`, test: (p: number) => p > PRICE_BUCKET_2 },
];

function distinctFilterValues(products: { color: string; shape: string; length: string }[], key: "color" | "shape" | "length") {
  const present = new Set(products.map((p) => p[key]).filter((v): v is string => !!v));
  return [ALL, ...Array.from(present).sort()];
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="sm:flex sm:items-center sm:gap-3">
      <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground sm:w-16 sm:shrink-0">
        {label}
      </span>
      <div
        role="group"
        aria-label={`Filter by ${label.toLowerCase()}`}
        className="-mx-5 mt-1.5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {options.map((o) => (
          <Button
            key={o}
            size="sm"
            variant={value === o ? "default" : "outline"}
            aria-pressed={value === o}
            className="h-9 shrink-0 px-4"
            onClick={() => onChange(o)}
          >
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Shop() {
  const { collection } = Route.useSearch();
  const { data: products = [], isLoading, isError } = useQuery(productsQueryOptions);
  const [query, setQuery] = useState("");
  const [shape, setShape] = useState(ALL);
  const [length, setLength] = useState(ALL);
  const [color, setColor] = useState(ALL);
  const [price, setPrice] = useState(ALL);

  const colors = useMemo(() => distinctFilterValues(products, "color"), [products]);
  const shapes = useMemo(() => distinctFilterValues(products, "shape"), [products]);
  const lengths = useMemo(() => distinctFilterValues(products, "length"), [products]);

  const results = useMemo(() => {
    const priceTest = prices.find((p) => p.label === price)!.test;
    return products.filter(
      (p) =>
        (!collection || p.collection === collection) &&
        (shape === ALL || p.shape === shape) &&
        (length === ALL || p.length === length) &&
        (color === ALL || p.color === color) &&
        priceTest(p.price) &&
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [products, collection, shape, length, color, price, query]);

  const navigate = useNavigate();
  const hasFilters =
    !!collection || !!query.trim() || shape !== ALL || length !== ALL || color !== ALL || price !== ALL;

  function clearFilters() {
    setQuery("");
    setShape(ALL);
    setLength(ALL);
    setColor(ALL);
    setPrice(ALL);
    if (collection) navigate({ to: "/shop", search: {} });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <SectionHeading
        eyebrow={collection ? `${collection}` : "The Collection"}
        title="Shop All Nails"
        subtitle="Browse every set by shape, length, colour and price."
      />

      <div className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="sr-only" htmlFor="search">
          Search products
        </label>
        <Input
          id="search"
          placeholder="Search designs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 max-w-sm text-base"
        />
        <FilterRow label="Shape" options={shapes} value={shape} onChange={setShape} />
        <FilterRow label="Length" options={lengths} value={length} onChange={setLength} />
        <FilterRow label="Colour" options={colors} value={color} onChange={setColor} />
        <FilterRow
          label="Price"
          options={prices.map((p) => p.label)}
          value={price}
          onChange={setPrice}
        />
      </div>

      {!isLoading && !isError && products.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <p aria-live="polite">
            {results.length} {results.length === 1 ? "set" : "sets"}
          </p>
          {hasFilters && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] w-full rounded-2xl bg-secondary" />
              <div className="mt-3 h-4 w-2/3 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          We couldn't load the collection just now. Please refresh in a moment.
        </p>
      ) : products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          New sets are on the way — please check back soon.
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">No sets match those filters yet.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
