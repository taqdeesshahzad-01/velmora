# VELMORA — CLAUDE.md

Press-on nail ecommerce site. Lovable-generated codebase — treat existing structure as authoritative.

## Stack

- React 19 + TypeScript, Vite, TanStack Start/Router (file-based routes in `src/routes`)
- TanStack Query for all data fetching
- Supabase (`@supabase/supabase-js`) — Postgres + RLS
- Tailwind CSS v4 + shadcn/ui components (`src/components/ui`)
- Package manager: **bun** (`bun.lock` is the lockfile — do not generate a `package-lock.json`/`yarn.lock`)

## Structure

- `src/routes/` — file-based routes (`index.tsx`, `shop.tsx`, `product.$slug.tsx`, `about.tsx`, `contact.tsx`, `faq.tsx`, `__root.tsx`). Route tree is generated into `src/routeTree.gen.ts` — never hand-edit it.
- `src/lib/products.ts` — all product data fetching (`fetchProducts`, `fetchProductBySlug`) and their `queryOptions`. This is the **only** place product-fetching logic should live.
- `src/lib/cart.tsx` — cart context/provider (localStorage-backed). Single cart implementation; do not create a second one.
- `src/data/products.ts` — shared `Product` type and static marketing content (collections, placeholder image). Not the database.
- `src/components/` — shared UI (`Navbar`, `Footer`, `ProductCard`, `CartSheet`, etc.); `src/components/ui/` is shadcn primitives.
- `src/integrations/supabase/client.ts` — auto-generated Supabase client. Do not edit by hand.
- `supabase/migrations/` — schema history (`products`, `product_images`, `product_variants`, `orders`, `order_items`, all RLS-protected).

## Supabase

- Client reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (browser) or `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (SSR) from env. Never hardcode credentials in source.
- Only the anon/publishable key is used client-side. **Never** add the service-role/secret key to any client-reachable code, route, or component.
- Public reads are gated by RLS policies scoped to `active = true` products. Any new query must go through `src/lib/products.ts`, not ad-hoc `supabase.from(...)` calls scattered in components.

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server (`vite dev`)
- `bun run build` — production build (`vite build`)
- `bun run lint` — ESLint
- `bun run format` — Prettier write

No test suite currently exists. After any change, at minimum run `bun run build` (or `bun run lint` for smaller edits) as the relevant verification.

## Rules

- Do not rebuild or replace working functionality — extend it.
- Read the relevant existing file(s) before modifying them.
- Make the smallest change that satisfies the request.
- Reuse existing dependencies, components, and query patterns; don't add new libraries for something already solvable with what's installed.
- Never install a new package without explicit approval first.
- Do not introduce paid services or APIs.
- Do not change visual/design language (Tailwind theme, shadcn styles, layout) unless explicitly asked.
- Do not modify `supabase/migrations/` or the schema without explicit approval.
- Never expose Supabase service-role/secret keys, or any secret, in client-side code.
- Do not make unrelated changes, refactors, or "improvements" while doing a task.
- After making changes, run the most relevant verification command above before reporting done.
- Responses should be concise and direct.
