import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listOrders, ORDER_STATUSES, type OrderStatus } from "@/lib/admin.functions";
import { formatPKR } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({
    meta: [{ title: "Orders | VELMORA Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminOrders,
});

function AdminOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "orders", search, status],
    queryFn: () =>
      listOrders({
        data: {
          search: search || undefined,
          status: status === "all" ? undefined : (status as OrderStatus),
        },
      }),
  });

  return (
    <AdminShell active="Orders">
      <h1 className="font-display text-2xl">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 card-soft overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="p-5 text-sm text-destructive">Couldn't load orders.</p>
        ) : !data || data.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No orders match.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.customer_name}</TableCell>
                  <TableCell>{o.customer_phone}</TableCell>
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
        )}
      </div>
    </AdminShell>
  );
}
