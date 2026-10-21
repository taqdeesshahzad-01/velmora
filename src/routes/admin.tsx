import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure pass-through layout: TanStack Router nests every /admin/* route under
// this file because of the shared filename prefix. It intentionally has no
// guard/chrome of its own — /admin/login must render unguarded, and every
// other /admin/* page wraps itself in <AdminShell> (which includes the guard).
export const Route = createFileRoute("/admin")({
  component: () => <Outlet />,
});
