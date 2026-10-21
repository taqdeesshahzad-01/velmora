import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardSummary } from "@/lib/admin.functions";
import { formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | VELMORA" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => getDashboardSummary(),
  });

  return (
    <AdminShell active="Dashboard">
      <h1 className="font-display text-2xl">Dashboard</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : isError || !data ? (
        <p className="mt-6 text-sm text-destructive">Couldn't load dashboard data.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Orders" value={String(data.totalOrders)} />
            <StatCard label="Pending Orders" value={String(data.pendingOrders)} />
            <StatCard label="Revenue" value={formatPKR(data.revenue)} />
            <StatCard label="Low Stock Variants" value={String(data.lowStockVariants.length)} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-lg">Recent Orders</h2>
            {data.recentOrders.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="mt-3 card-soft overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.customer_name}</TableCell>
                        <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{formatPKR(Number(o.total_price))}</TableCell>
                        <TableCell>
                          <StatusBadge status={o.order_status} />
                        </TableCell>
                        <TableCell>
                          <Link
                            to="/admin/orders/$orderId"
                            params={{ orderId: o.id }}
                            className="inline-block py-2 text-sm text-accent-foreground hover:underline"
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-display text-lg">Low Stock</h2>
            {data.lowStockVariants.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nothing is low on stock right now.</p>
            ) : (
              <div className="mt-3 card-soft overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.lowStockVariants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.products?.name}</TableCell>
                        <TableCell>
                          {[v.color, v.shape, v.length, v.size].filter(Boolean).join(" · ")}
                        </TableCell>
                        <TableCell
                          className={v.stock_quantity === 0 ? "font-medium text-destructive" : ""}
                        >
                          {v.stock_quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
