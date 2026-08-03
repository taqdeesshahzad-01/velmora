import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Lumière Nails" },
      {
        name: "description",
        content:
          "Questions about sizing, orders or custom sets? Message the Lumière studio by email, Instagram or WhatsApp.",
      },
      { property: "og:title", content: "Contact | Lumière Nails" },
      { property: "og:description", content: "Get in touch with the Lumière studio." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2">
      <div>
        <SectionHeading align="left" eyebrow="We'd love to hear from you" title="Get in Touch" />
        <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
          <li className="flex items-center gap-3">
            <Mail className="size-4" /> hello@lumierenails.com
          </li>
          <li className="flex items-center gap-3">
            <Instagram className="size-4" /> @lumierenails
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle className="size-4" /> WhatsApp +1 (000) 000-0000
          </li>
        </ul>
      </div>

      <form
        className="card-soft space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          (e.target as HTMLFormElement).reset();
          toast("Message sent", { description: "We'll reply within 1–2 business days." });
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} required className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  );
}
