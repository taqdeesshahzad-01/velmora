import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getProduct, products } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found | Lumière Nails" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} Press-On Nails | Lumière`;
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
  const product = Route.useLoaderData();
  const { add } = useCart();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid gap-10 md:grid-cols-2">
        <img
          src={product.image}
          alt={`${product.name} press-on nails`}
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
        />
        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <p className="mt-2 text-lg text-accent-foreground">${product.price}</p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Shape</dt>
              <dd>{product.shape}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Length</dt>
              <dd>{product.length}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              What's Included
            </h2>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>24 hand-finished nails in 12 sizes</li>
              <li>Adhesive tabs & nail glue</li>
              <li>Mini file, buffer and cuticle stick</li>
              <li>Application & care card</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                add(product);
                toast("Added to bag", { description: product.name });
              }}
            >
              Add to Cart
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                  Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-light">Size Guide</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Measure the widest part of each nail in millimetres and match it to the closest
                  size in your set. If you're between sizes, size up for comfort. Every set includes
                  12 sizes so you can mix and match across both hands.
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading title="You May Also Love" />
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
