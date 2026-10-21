import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";
import { DEMO_MODE } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | VELMORA" },
      {
        name: "description",
        content: "Answers about sizing, shapes, lengths and ordering with VELMORA.",
      },
      { property: "og:title", content: "FAQ | VELMORA" },
      { property: "og:description", content: "Sizing, shapes, lengths and ordering." },
    ],
  }),
  component: Faq,
});

const faqs: [string, string][] = [
  [
    "How do I choose a size?",
    "Each product page lists the sizes available for that set. Compare the width of your natural nails at their widest point and choose the closest size. If you are between sizes, the larger size is usually the more comfortable choice.",
  ],
  [
    "Which shapes and lengths are available?",
    "Each set comes in a single shape and length, shown on its product page. You can also filter the shop by shape and length.",
  ],
  ["How many nails are in a set?", "Each set contains 10 nails."],
  [
    "How do I pay?",
    "Checkout currently offers Cash on Delivery only. No card details are collected on this website.",
  ],
  ...(DEMO_MODE
    ? ([
        [
          "Can I place a real order?",
          "Not yet. This website is a portfolio demonstration, so orders placed here are test orders and will not be fulfilled.",
        ],
      ] as [string, string][])
    : []),
  [
    "What about delivery, returns and exchanges?",
    "Delivery areas, timing and charges, along with the returns and exchange policy, have not been finalised yet. They will be published here before real orders open.",
  ],
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <SectionHeading eyebrow="Support" title="Frequently Asked Questions" />
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="py-5 text-left font-display text-lg">{q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
