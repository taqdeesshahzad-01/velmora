import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure pass-through layout for the same reason as admin.tsx: admin.orders.$orderId.tsx
// shares this filename prefix and would otherwise nest inside the orders-list page.
export const Route = createFileRoute("/admin/orders")({
  component: () => <Outlet />,
});
