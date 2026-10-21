import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listProducts, updateProduct } from "@/lib/admin.functions";
import { formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Products | VELMORA Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminProducts,
});

type ProductListItem = Awaited<ReturnType<typeof listProducts>>[number];

function AdminProducts() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => listProducts(),
  });

  const filtered = (data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <AdminShell active="Products">
      <h1 className="font-display text-2xl">Products</h1>
      <Input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6 max-w-xs"
      />
      <div className="mt-6 card-soft overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="p-5 text-sm text-destructive">Couldn't load products.</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No products match.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminShell>
  );
}

function ProductRow({ product }: { product: ProductListItem }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [category, setCategory] = useState(product.category ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [active, setActive] = useState(product.active);
  const [featured, setFeatured] = useState(product.featured);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsedPrice = Number(price);
    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast("Check the form", { description: "Name and a positive price are required." });
      return;
    }
    setSaving(true);
    try {
      await updateProduct({
        data: {
          productId: product.id,
          name: name.trim(),
          description: description.trim(),
          category: category.trim(),
          price: parsedPrice,
          active,
          featured,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast("Product updated", { description: name });
      setOpen(false);
    } catch (e) {
      toast("Couldn't save product", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <TableRow>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{formatPKR(Number(product.price))}</TableCell>
      <TableCell className={product.totalStock === 0 ? "font-medium text-destructive" : ""}>
        {product.totalStock}
      </TableCell>
      <TableCell>
        <Badge variant={product.active ? "secondary" : "outline"}>
          {product.active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={product.featured ? "secondary" : "outline"}>
          {product.featured ? "Featured" : "—"}
        </Badge>
      </TableCell>
      <TableCell>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {product.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`name-${product.id}`}>Name</Label>
                <Input
                  id={`name-${product.id}`}
                  className="mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor={`description-${product.id}`}>Description</Label>
                <Textarea
                  id={`description-${product.id}`}
                  rows={3}
                  className="mt-1.5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor={`category-${product.id}`}>Collection / Category</Label>
                <Input
                  id={`category-${product.id}`}
                  className="mt-1.5"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor={`price-${product.id}`}>Price (PKR)</Label>
                <Input
                  id={`price-${product.id}`}
                  type="number"
                  min="0"
                  className="mt-1.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`active-${product.id}`}>Active (visible in shop)</Label>
                <Switch
                  id={`active-${product.id}`}
                  checked={active}
                  onCheckedChange={setActive}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`featured-${product.id}`}>Featured (shown in Featured Sets)</Label>
                <Switch
                  id={`featured-${product.id}`}
                  checked={featured}
                  onCheckedChange={setFeatured}
                  disabled={saving}
                />
              </div>
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
