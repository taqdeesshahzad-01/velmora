import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | VELMORA" },
      {
        name: "description",
        content: "Contact information for VELMORA will be published when the store is ready.",
      },
      { property: "og:title", content: "Contact | VELMORA" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <SectionHeading eyebrow="Contact" title="Get in Touch" />
      <div className="card-soft mt-10 p-8 text-center">
        <p className="text-base leading-relaxed text-muted-foreground">
          VELMORA&rsquo;s contact details have not been published yet. They will appear here once
          the store is ready to accept orders.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          In the meantime, the FAQ covers sizing and ordering.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/faq">Read the FAQ</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
