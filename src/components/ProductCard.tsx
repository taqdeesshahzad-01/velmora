import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatPKR } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const variantSummary = [product.color, product.shape, product.length]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block rounded-2xl"
      aria-label={`${product.name}, ${formatPKR(product.price)}`}
    >
      <div className="overflow-hidden rounded-2xl bg-secondary">
        <img
          src={product.image}
          alt={`${product.name} press-on nails`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug text-foreground sm:text-xl">
        {product.name}
      </h3>
      <p className="mt-0.5 text-sm font-medium text-accent-foreground">{formatPKR(product.price)}</p>
      {variantSummary && (
        <p className="mt-1 text-xs leading-snug uppercase tracking-[0.14em] text-muted-foreground">
          {variantSummary}
        </p>
      )}
    </Link>
  );
}
