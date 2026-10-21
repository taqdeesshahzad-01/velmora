import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listInventory, updateStock } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [{ title: "Inventory | VELMORA Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminInventory,
});

const LOW_STOCK_THRESHOLD = 5;

type VariantRow = Awaited<ReturnType<typeof listInventory>>[number];

function AdminInventory() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: () => listInventory(),
  });

  return (
    <AdminShell active="Inventory">
      <h1 className="font-display text-2xl">Inventory</h1>
      <div className="mt-6 card-soft overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="p-5 text-sm text-destructive">Couldn't load inventory.</p>
        ) : !data || data.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No variants found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Colour</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((v) => (
                <InventoryRow key={v.id} variant={v} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminShell>
  );
}

function InventoryRow({ variant }: { variant: VariantRow }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(String(variant.stock_quantity));
  const [saving, setSaving] = useState(false);
  const isLow = variant.stock_quantity <= LOW_STOCK_THRESHOLD;

  async function handleSave() {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      toast("Invalid stock value", { description: "Stock must be a whole number, 0 or greater." });
      setValue(String(variant.stock_quantity));
      return;
    }
    setSaving(true);
    try {
      await updateStock({ data: { variantId: variant.id, stock: parsed } });
      await queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast("Stock updated", {
        description: `${variant.products?.name ?? "Variant"}: ${parsed} in stock.`,
      });
    } catch (e) {
      toast("Couldn't update stock", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
      setValue(String(variant.stock_quantity));
    } finally {
      setSaving(false);
    }
  }

  return (
    <TableRow>
      <TableCell>{variant.products?.name}</TableCell>
      <TableCell>{variant.color ?? "—"}</TableCell>
      <TableCell>{variant.shape ?? "—"}</TableCell>
      <TableCell>{variant.length ?? "—"}</TableCell>
      <TableCell>{variant.size ?? "—"}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-9 w-20"
            disabled={saving}
          />
          {isLow && <Badge variant="destructive">Low</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={saving || value === String(variant.stock_quantity)}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
