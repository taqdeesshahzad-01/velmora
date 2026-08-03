import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
      aria-label={product.name}
    >
      <div className="overflow-hidden rounded-2xl bg-secondary">
        <img
          src={product.image}
          alt={`${product.name} press-on nails`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-lg text-foreground">{product.name}</h3>
        <span className="text-sm text-muted-foreground">${product.price}</span>
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {product.shape} · {product.length}
      </p>
    </Link>
  );
}
