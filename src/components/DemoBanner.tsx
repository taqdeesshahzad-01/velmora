import { DEMO_MODE } from "@/lib/utils";

export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div className="bg-foreground px-4 py-2 text-center text-[0.8125rem] leading-snug text-background">
      Portfolio demo — VELMORA is not accepting real orders yet.
    </div>
  );
}
