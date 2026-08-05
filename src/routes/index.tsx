import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { collections } from "@/data/products";
import { productsQueryOptions } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière Nails | Luxury Handmade Press-On Nails" },
      {
        name: "description",
        content:
          "Salon-quality handmade press-on nails. Reusable, easy to apply and crafted in small batches.",
      },
      { property: "og:title", content: "Lumière Nails | Luxury Press-On Nails" },
      {
        property: "og:description",
        content: "Salon-quality handmade press-on nails, crafted in small batches.",
      },
    ],
  }),
  component: Home,
});

const reasons = [
  ["Handmade", "Each set is shaped and finished by hand."],
  ["Reusable", "Wear your favourites again and again."],
  ["Salon Quality", "Gel-cured shine that lasts up to 14 days."],
  ["Affordable", "Luxury finish without the salon price."],
  ["Easy Application", "Ready to wear in under 10 minutes."],
];

const steps = ["Choose Design", "Select Size", "Apply", "Enjoy"];

const testimonials = [
  ["Amelia R.", "The finish is unreal — everyone asks where I get my nails done."],
  ["Sofia L.", "Took me ten minutes and they lasted two full weeks."],
  ["Noor K.", "Elegant, comfortable and worth every penny."],
];

function Home() {
  const [email, setEmail] = useState("");
  const { data: products = [], isLoading, isError } = useQuery(productsQueryOptions);
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent-foreground">
            Handmade in small batches
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-6xl">
            Salon-worthy nails, <em className="not-italic text-accent-foreground">made by hand ✨</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Lumière press-on nails bring the polish of a luxury salon to your dressing table —
            reusable, comfortable and ready in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop" search={{}}>Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
          <img
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=75"
            alt="Manicured press-on nails in a soft nude finish"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Collections" title="Featured Collections" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ collection: c.name }}
              className="group overflow-hidden rounded-2xl"
            >
              <img
                src={c.image}
                alt={`${c.name} collection`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pt-3">
                <h3 className="font-display text-xl">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Loved by you" title="Best Sellers" />
        {isLoading ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-2xl bg-secondary" />
                <div className="mt-3 h-4 w-2/3 rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            We couldn't load our nails just now. Please refresh in a moment.
          </p>
) : bestSellers.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Our new collection is being crafted — check back very soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="Why Choose Us" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {reasons.map(([title, copy]) => (
              <div key={title} className="card-soft p-6">
                <h3 className="font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Simple" title="How It Works" />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="card-soft p-6 text-center">
              <span className="font-display text-3xl text-accent-foreground">0{i + 1}</span>
              <p className="mt-2 text-sm uppercase tracking-[0.16em]">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Kind words" title="Testimonials" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map(([name, quote]) => (
            <figure key={name} className="card-soft p-6">
              <blockquote className="font-display text-lg leading-relaxed">“{quote}”</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="@lumierenails" title="Follow Along" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <img
              key={p.slug}
              src={p.image}
              alt={`Instagram preview of ${p.name}`}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <SectionHeading
          title="Join the List"
          subtitle="New drops, restocks and 10% off your first set."
        />
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
            toast("You're on the list", { description: "Welcome to Lumière." });
          }}
        >
          <label className="sr-only" htmlFor="newsletter">
            Email address
          </label>
          <Input
            id="newsletter"
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </>
  );
}
