import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { collections } from "@/data/products";
import { productsQueryOptions } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VELMORA | Press-On Nails" },
      {
        name: "description",
        content:
          "VELMORA press-on nail sets in soft nudes, deep jewel tones and fine details. Choose your shape, length and size.",
      },
      { property: "og:title", content: "VELMORA | Press-On Nails" },
      {
        property: "og:description",
        content: "Press-on nail sets in soft nudes, deep jewel tones and fine details.",
      },
    ],
  }),
  component: Home,
});

const reasons = [
  ["Considered Designs", "Each set is a finished look, defined by its colour, finish, shape and length."],
  ["Choose Your Fit", "Select from the shapes, lengths and sizes offered on each product page."],
  ["Clear Availability", "Stock is shown for the exact option you pick, before you add it to your bag."],
];

const steps = [
  ["Choose your set", "Browse the collection and filter by shape, length, colour and price."],
  ["Select your options", "Pick your colour, shape, length and size, then add the set to your bag."],
  ["Place your order", "Check out with Cash on Delivery. No account is needed."],
];

const trustPoints = [
  ["Cash on Delivery", "Choose Cash on Delivery at checkout — no card details are entered online."],
  ["No Account Needed", "Order with a short form: your name, phone number and delivery address."],
  ["Clear Product Details", "Colour, shape, length and size are shown before you buy."],
  ["Live Availability", "Options that are out of stock can't be added to your bag."],
];

function Home() {
  const { data: products = [], isLoading, isError } = useQuery(productsQueryOptions);
  const bySlug = (slug: string) => products.find((p) => p.slug === slug);

  const heroPrimary = bySlug("cloud-pearl") ?? products[0];
  const heroSecondary = bySlug("midnight-plum") ?? products[1];
  const momentProduct = bySlug("ruby-gilded") ?? products[2];

  // Featured products first (curated in admin), then the rest, up to four cards.
  const featuredSets = [
    ...products.filter((p) => p.bestSeller),
    ...products.filter((p) => !p.bestSeller),
  ].slice(0, 4);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent-foreground">
            Press-on nail sets
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Nails,{" "}
            <em className="not-italic text-accent-foreground">beautifully finished</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Soft nudes, deep jewel tones and fine details. Choose your shape, length and size, and
            find the set that feels like you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/shop">Shop the Collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link to="/about">About VELMORA</Link>
            </Button>
          </div>
        </div>

        <div className="relative pb-8">
          <div className="overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
            {heroPrimary ? (
              <img
                src={heroPrimary.image}
                alt={`${heroPrimary.name} press-on nails`}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/5] w-full" />
            )}
          </div>
          {heroSecondary && (
            <div className="absolute bottom-0 left-4 w-2/5 overflow-hidden rounded-2xl border-4 border-background bg-secondary shadow-[var(--shadow-soft)] md:-left-4">
              <img
                src={heroSecondary.image}
                alt={`${heroSecondary.name} press-on nails`}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <SectionHeading eyebrow="Collections" title="Shop by Collection" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {collections.map((c) => {
            const rep = products.find((p) => p.collection === c.category);
            return (
              <Link
                key={c.category}
                to="/shop"
                search={{ collection: c.category }}
                className="group block"
              >
                <div className="overflow-hidden rounded-2xl bg-secondary">
                  {rep ? (
                    <img
                      src={rep.image}
                      alt={`${c.category} collection — ${rep.name}`}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[3/4] w-full" />
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl">{c.category}</h3>
                <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{c.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-4 md:pb-24">
        <SectionHeading eyebrow="Handpicked" title="Featured Sets" />
        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-2xl bg-secondary" />
                <div className="mt-3 h-4 w-2/3 rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            We couldn't load the sets just now. Please refresh in a moment.
          </p>
        ) : featuredSets.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            New sets are on the way — please check back soon.
          </p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
              {featuredSets.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">View All Sets</Link>
              </Button>
            </div>
          </>
        )}
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
            {momentProduct ? (
              <img
                src={momentProduct.image}
                alt={`${momentProduct.name} press-on nails`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/5] w-full" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent-foreground">The look</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              From soft nudes to deep jewel tones
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Pearl and blush, plum and mauve, ruby with gold detail. Every VELMORA set is defined
              by its colour, shape and length, so you know exactly what you are choosing.
            </p>
            <Button asChild size="lg" variant="outline" className="mt-8">
              <Link to="/shop">Explore the Sets</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading eyebrow="Why VELMORA" title="Made Simple to Choose" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map(([title, copy]) => (
            <div key={title} className="card-soft p-7">
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionHeading eyebrow="Simple" title="How It Works" />
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map(([title, copy], i) => (
            <li key={title} className="border-t border-border pt-5">
              <span className="font-display text-3xl text-accent-foreground">0{i + 1}</span>
              <h3 className="mt-2 font-display text-xl">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-secondary/40 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs uppercase tracking-[0.28em] text-accent-foreground">
            Ordering with VELMORA
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(([title, copy]) => (
              <div key={title}>
                <h3 className="font-display text-lg">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="rounded-3xl bg-secondary px-6 py-14 text-center md:py-20">
          <SectionHeading
            title="Find Your Set"
            subtitle="Explore every colour, shape and length in the VELMORA collection."
          />
          <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
