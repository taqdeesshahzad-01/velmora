import { Link } from "@tanstack/react-router";
import { DEMO_MODE } from "@/lib/utils";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[2fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">VELMORA</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Press-on nail sets in soft nudes, deep jewel tones and fine details — each with a
            clear shape, length and size.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-xs uppercase tracking-[0.24em] text-foreground">Explore</h2>
          <ul className="mt-3 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-block py-2 transition-colors hover:text-accent-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VELMORA.
        {DEMO_MODE && " Portfolio demo — not an active store."}
      </p>
    </footer>
  );
}
