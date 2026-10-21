# VELMORA

**Premium E-Commerce Storefront & Admin Panel**

> **Portfolio demonstration only.** VELMORA is not a real business and does not accept or fulfil real orders. See the [Demo Disclaimer](#demo-disclaimer).

## Project Overview

VELMORA is a full-stack portfolio project that demonstrates a modern e-commerce workflow for a press-on nail brand. It covers the whole path from browsing to fulfilment: a product catalogue with variants, a persistent custom cart, a validated Cash on Delivery checkout with server-side order creation, and a secure admin dashboard for managing orders, products and inventory.

## Tech Stack

- **React 19** and **TypeScript**
- **Vite** for development and builds
- **TanStack Router / TanStack Start** for file-based routing and server functions, with **TanStack Query** for data fetching
- **Nitro** as the server build layer
- **Supabase**
  - **Postgres** with row-level security
  - **Auth** for admin sign-in
  - **Storage** for product images
- **Tailwind CSS v4** and **shadcn/ui** for styling and components

## Key Features

### Storefront

- Product catalogue with search and filters (shape, length, colour, price) and collection links
- Variant selection (colour, shape, length, size) with live stock status; unavailable combinations cannot be added
- Cart that persists across page reloads
- Cash on Delivery checkout with field-level validation, duplicate-submit protection and clear loading, success and error states
- Orders are created on the server, which validates stock and decrements inventory
- Responsive layout checked from 375 px to 1440 px, with visible keyboard focus and labelled form fields

### Admin Dashboard

- Sign-in with Supabase Auth; admin routes redirect to the login page when signed out
- Every admin data call is authorised on the server, so the client-side redirect is a convenience and not the security boundary
- Dashboard with order counts, pending orders, revenue and low-stock alerts
- Order management: search and filter, view order details, and update order status (pending, confirmed, processing, shipped, delivered, cancelled) with a confirmation step
- Product management: edit name, description, category, price, and the active and featured flags
- Inventory management: update stock per variant, with low-stock indicators

## Environment Variables

Create a `.env` file in the project root (it is git-ignored) with these five variables. **Never commit real values.**

| Variable                        | Used by                  | Notes                                           |
| ------------------------------- | ------------------------ | ----------------------------------------------- |
| `VITE_SUPABASE_URL`             | Browser                  | Supabase project URL                            |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser                  | Public (publishable) key                        |
| `SUPABASE_URL`                  | Server                   | Supabase project URL                            |
| `SUPABASE_PUBLISHABLE_KEY`      | Server                   | Public (publishable) key                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only              | Secret. Never prefix with `VITE_`; never expose |

The service-role key is read only inside server functions and must never reach the client bundle.

## Local Development

1. Clone the repository and move into the folder.

   ```bash
   git clone https://github.com/taqdeesshahzad-01/velmora.git
   cd velmora
   ```

2. Install dependencies.

   ```bash
   bun install
   ```

3. Create `.env` with the variables listed above, using your own Supabase project. The database schema is in `supabase/migrations/`.

4. Start the development server and open the local URL it prints.

   ```bash
   bun run dev
   ```

Other commands: `bun run build` (production build) and `bun run lint`.

## Demo Disclaimer

VELMORA is a **portfolio demonstration project, not a real business**. `DEMO_MODE` is **active** (set in `src/lib/utils.ts`), so the site shows demo notices, and any order placed is a test order that will not be fulfilled. Product names, prices and stock are sample data. Contact details, delivery terms and returns policies have intentionally not been published.
