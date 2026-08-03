import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({
    collection: typeof s['collection'] === "string" ? (s['collection'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Press-On Nails | Lumière Nails" },
      {
        name: "description",
        content:
          "Browse handmade press-on nail sets by shape, length, colour and price. Reusable and salon-quality.",
      },
      { property: "og:title", content: "Shop Press-On Nails | Lumière Nails" },
      { property: "og:description", content: "Handmade, reusable press-on nail sets." },
    ],
  }),
  component: Shop,
});

const ALL = "All";
const shapes = [ALL, "Almond", "Coffin", "Square", "Stiletto"];
const lengths = [ALL, "Short", "Medium", "Long"];
const colors = [ALL, "Nude", "Pink", "White", "Red", "Chrome"];
const prices = [
  { label: ALL, test: () => true },
  { label: "Under $32", test: (p: number) => p < 32 },
  { label: "$32 – $40", test: (p: number) => p >= 32 && p <= 40 },
  { label: "Over $40", test: (p: number) => p > 40 },
];

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
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {options.map((o) => (
        <Button
          key={o}
          size="sm"
          variant={value === o ? "default" : "outline"}
          onClick={() => onChange(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}

function Shop() {
  const { collection } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [shape, setShape] = useState(ALL);
  const [length, setLength] = useState(ALL);
  const [color, setColor] = useState(ALL);
  const [price, setPrice] = useState(ALL);

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
  }, [collection, shape, length, color, price, query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <SectionHeading
        eyebrow={collection ? `${collection} collection` : "The Collection"}
        title="Shop All Nails"
        subtitle="Handmade sets, ready to wear in minutes."
      />

      <div className="mt-10 space-y-3">
        <label className="sr-only" htmlFor="search">
          Search products
        </label>
        <Input
          id="search"
          placeholder="Search designs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
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

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No sets match those filters yet.
        </p>
      )}
    </div>
  );
}
