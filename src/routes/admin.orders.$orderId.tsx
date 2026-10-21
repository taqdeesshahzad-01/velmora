import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getOrderDetail, updateOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/lib/admin.functions";
import { formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/$orderId")({
  head: () => ({
    meta: [{ title: "Order | VELMORA Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminOrderDetail,
});

function AdminOrderDetail() {
  const { orderId } = Route.useParams();
  const queryClient = useQueryClient();
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getOrderDetail({ data: { orderId } }),
  });

  async function confirmStatusChange() {
    if (!pendingStatus || !order) return;
    setSaving(true);
    try {
      await updateOrderStatus({ data: { orderId, status: pendingStatus } });
      await queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast("Status updated", { description: `Order marked as ${pendingStatus}.` });
    } catch (e) {
      toast("Couldn't update status", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setSaving(false);
      setPendingStatus(null);
    }
  }

  return (
    <AdminShell active="Orders">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError || !order ? (
        <p className="text-sm text-destructive">Couldn't load this order.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl">Order #{order.id.slice(0, 8)}</h1>
            <StatusBadge status={order.order_status} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="card-soft p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Customer</h2>
              <p className="mt-2 text-sm">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              {order.customer_email && (
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              )}

              <h2 className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Shipping Address
              </h2>
              <p className="mt-2 text-sm">{order.shipping_address}</p>
              {order.city && <p className="text-sm text-muted-foreground">{order.city}</p>}

              {order.notes && (
                <>
                  <h2 className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Notes
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
                </>
              )}

              <h2 className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Payment
              </h2>
              <p className="mt-2 text-sm">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="card-soft p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Items</h2>
              <div className="mt-3 space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {item.product_variants?.products?.name ?? "Unknown product"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {[
                          item.product_variants?.color,
                          item.product_variants?.shape,
                          item.product_variants?.length,
                          item.product_variants?.size,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="text-muted-foreground">
                        Qty {item.quantity} · {formatPKR(Number(item.price))}
                      </p>
                    </div>
                    <p className="font-medium">{formatPKR(Number(item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-xl">{formatPKR(Number(order.total_price))}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 card-soft p-6">
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Update Status
            </h2>
            <div className="mt-3">
              <Select
                value={pendingStatus ?? order.order_status}
                onValueChange={(v) => setPendingStatus(v as OrderStatus)}
                disabled={saving}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AlertDialog
              open={!!pendingStatus && pendingStatus !== order.order_status}
              onOpenChange={(open) => !open && setPendingStatus(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change order status?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Mark this order as "{pendingStatus}"? This updates the order record immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmStatusChange} disabled={saving}>
                    {saving ? "Saving…" : "Confirm"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </AdminShell>
  );
}
