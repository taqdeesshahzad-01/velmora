import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { productsQueryOptions } from "@/lib/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | VELMORA" },
      {
        name: "description",
        content:
          "VELMORA is a press-on nail brand built around clear colours, shapes and lengths.",
      },
      { property: "og:title", content: "About | VELMORA" },
      {
        property: "og:description",
        content: "A press-on nail brand built around clear colours, shapes and lengths.",
      },
    ],
  }),
  component: About,
});

const pillars = [
  ["Colour", "From pearl and blush to plum, mauve and ruby, each set has a defined colour and finish."],
  ["Shape & Length", "Every set comes in one shape and length, shown clearly on its product page."],
  ["Size", "Choose the size that fits your natural nails from the options offered for each set."],
];

function About() {
  const { data: products = [] } = useQuery(productsQueryOptions);
  const showcase = products.filter((p) => p.images.length > 0).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
      <SectionHeading eyebrow="About" title="About VELMORA" />

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          VELMORA is a press-on nail brand. Each set is designed around a clear look — a defined
          colour, finish, shape and length — so choosing is simple.
        </p>
        <p>
          The collection ranges from soft pearl and blush nudes to deep plum, mauve and ruby, with
          details such as chrome tips and gold accents.
        </p>
      </div>

      {showcase.length > 0 && (
        <div className="mt-12 grid grid-cols-3 gap-3 md:gap-5">
          {showcase.map((p) => (
            <img
              key={p.slug}
              src={p.image}
              alt={`${p.name} press-on nails`}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {pillars.map(([title, copy]) => (
          <div key={title} className="card-soft p-6">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
        More about the brand and how it operates will be shared here as VELMORA prepares to open
        for orders.
      </p>
      <div className="mt-8 text-center">
        <Button asChild size="lg">
          <Link to="/shop">Shop the Collection</Link>
        </Button>
      </div>
    </div>
  );
}
