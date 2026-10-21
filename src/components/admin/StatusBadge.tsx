import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  confirmed: "secondary",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariant[status] ?? "outline"} className="capitalize">
      {status}
    </Badge>
  );
}
