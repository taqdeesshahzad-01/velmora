import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story | Lumière Nails" },
      {
        name: "description",
        content:
          "Meet the founder behind Lumière — a female-owned studio crafting luxury handmade press-on nails.",
      },
      { property: "og:title", content: "Our Story | Lumière Nails" },
      { property: "og:description", content: "A female-owned studio for handmade press-on nails." },
    ],
  }),
  component: About,
});

const values = [
  ["Craft", "Every set is shaped, painted and cured by hand in small batches."],
  ["Care", "Kind formulas, comfortable fits and packaging we're proud of."],
  ["Confidence", "Beautiful nails should feel effortless, never complicated."],
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <SectionHeading eyebrow="Founded 2023" title="Our Story" />
      <img
        src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=70"
        alt="Handmade press-on nails in the Lumière studio"
        loading="lazy"
        className="mt-10 aspect-[16/9] w-full rounded-3xl object-cover"
      />
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Lumière began at a kitchen table with a single nail file and an obsession with detail. Our
          founder, Layla, wanted the polish of a luxury salon without the appointments, the cost or
          the damage — so she started making sets by hand for herself, then for friends, then for a
          growing community of women who wanted the same.
        </p>
        <p>
          Today every Lumière set is still shaped, hand-painted and gel-cured in our small studio.
          Nothing is mass produced, and nothing leaves us unless we'd wear it ourselves.
        </p>
      </div>

      <h2 className="mt-14 font-display text-2xl">Our Mission</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        To make salon-quality nails accessible, reusable and kind to your natural nails — so getting
        ready feels like a treat, not a task.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {values.map(([title, copy]) => (
          <div key={title} className="card-soft p-6">
            <h3 className="font-display text-lg">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
