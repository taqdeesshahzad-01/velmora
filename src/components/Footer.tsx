import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">LUMIÈRE</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Luxury handmade press-on nails, crafted in small batches for salon-quality wear at home.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-xs uppercase tracking-[0.24em] text-foreground">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-accent-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-xs uppercase tracking-[0.24em] text-foreground">Connect</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> hello@lumierenails.com
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4" /> @lumierenails
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4" /> WhatsApp +1 (000) 000-0000
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lumière Nails. All rights reserved.
      </p>
    </footer>
  );
}
