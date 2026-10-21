import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/inventory", label: "Inventory" },
] as const;

// Client-side redirect for UX only. The real security boundary is server-side:
// every admin server function independently rejects unauthenticated calls
// (see requireSupabaseAuth), so bypassing this guard exposes no data.
function AdminGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setChecked(true);
      } else {
        navigate({ to: "/admin/login" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/admin/login" });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminShell({
  active,
  children,
}: {
  active: (typeof navItems)[number]["label"];
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-secondary/20 md:flex">
        <aside className="border-b border-border bg-card px-4 py-4 md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:self-start md:overflow-y-auto md:border-b-0 md:border-r md:px-5 md:py-8">
          <p className="font-display text-xl">VELMORA</p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
          <nav className="mt-6 flex gap-2 overflow-x-auto md:mt-8 md:flex-col md:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
                  active === item.label
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="outline"
            size="sm"
            className="mt-6 w-full md:mt-8"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login" });
            }}
          >
            Log Out
          </Button>
        </aside>
        <main className="flex-1 px-5 py-8 md:px-10">{children}</main>
      </div>
    </AdminGuard>
  );
}
