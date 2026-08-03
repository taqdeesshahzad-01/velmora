import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Lumière Nails" },
      {
        name: "description",
        content:
          "Answers on shipping, sizing, application, removal, returns and care for Lumière press-on nails.",
      },
      { property: "og:title", content: "FAQ | Lumière Nails" },
      { property: "og:description", content: "Shipping, sizing, application, removal and care." },
    ],
  }),
  component: Faq,
});

const faqs: [string, string][] = [
  [
    "Shipping",
    "Orders are handmade and dispatched within 3–5 business days. Standard delivery takes 3–7 days; express options are available at checkout.",
  ],
  [
    "Sizing",
    "Every set includes 12 sizes. Measure the widest part of each nail in millimetres and size up if you're in between.",
  ],
  [
    "Application",
    "Buff, cleanse and dehydrate the nail, apply glue or an adhesive tab, then press firmly for 30 seconds. Ready in under 10 minutes.",
  ],
  [
    "Removal",
    "Soak your hands in warm soapy water for 10–15 minutes and gently lift from the sides with a cuticle stick. Never force a nail off.",
  ],
  [
    "Returns",
    "For hygiene reasons we can't accept returns on opened sets. Unopened sets can be returned within 14 days of delivery.",
  ],
  [
    "Care",
    "Avoid prolonged heat and harsh cleaners, wear gloves when washing up, and store your set in its box to reuse it again and again.",
  ],
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading eyebrow="Support" title="Frequently Asked Questions" />
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left font-display text-lg">{q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
