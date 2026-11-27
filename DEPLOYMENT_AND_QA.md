# VELMORA — Deployment & Manual QA Notes

Live demo: <https://velmora-red.vercel.app> · `DEMO_MODE` is `true` in `src/lib/utils.ts` and must stay on for the portfolio deployment.

## 1. Status of earlier content fixes

Checked against the live site on the day this file was updated:

- Rose Blush uses an image stored in the project's own Supabase `product-images` bucket (it previously hot-linked another retailer's image).
- Rose Blush and Ethereal Blush descriptions no longer contain the unsupported "handmade" claim or the stray text.

Still for the owner to confirm: Midnight Plum's "magnetic velvet … cat-eye finish" and Cloud Pearl's "luminous glazed finish" wording match the products shown.

## 2. Admin access — do this before sharing the link widely

The server treats **any valid Supabase Auth session** as an administrator; there is no separate admin role or allow-list (see `src/integrations/supabase/auth-middleware.ts` and `src/lib/admin.functions.ts`). Admin safety therefore depends on who can obtain a session.

- In the Supabase dashboard, go to **Authentication → Sign In / Providers** and turn **off** "Allow new users to sign up". Create the admin user manually instead.
- Verify afterwards: `GET <SUPABASE_URL>/auth/v1/settings` (with the public key) should report `"disable_signup": true`.
- Optional hardening (code change, not yet made): check the signed-in user's id or email against an allow-list (for example an `ADMIN_EMAILS` server variable) inside the admin server functions.

## 3. Signed-in admin checklist (about 10 minutes)

Use a desktop browser, then repeat steps 2–6 once at 375 px (DevTools device mode).

1. Open `/admin` signed out → you land on `/admin/login`. Sign in → dashboard loads, with no public nav, footer or demo banner.
2. **Dashboard:** counts, Recent Orders and Low Stock render. "View" opens an order.
3. **Orders:** search by name or phone and filter by status. Open an order and check items, address and "Cash on Delivery". Change the status → confirm dialog → Confirm → toast, badge updates. Set it back afterwards.
4. **Products:** search. Edit → the dialog fits the screen and scrolls if needed. Change a description, Save → toast; reload the storefront product page and confirm the text changed.
5. **Inventory:** change one variant's stock (for example 12 → 11) → Save → toast; the "Low" badge appears at 5 or fewer. Check the storefront stock badge; set stock to 0 and confirm the combination shows unavailable and Add to Cart is disabled; then restore the value.
6. **Log Out** → you land on login; visiting `/admin/orders` redirects back to login.

## 4. One end-to-end test order (storefront → admin)

This creates one real row and decrements stock. Do it once, deliberately, and clean up after.

1. Note the stock of one variant in Admin → Inventory (for example Cloud Pearl, Pearl Ivory · Almond · Medium · XS = N).
2. Storefront: open that product, pick exactly that combination, Add to Cart, Checkout.
3. Submit empty → field errors appear; then use obviously fake data (name "TEST ORDER", phone `03000000000`, address "Test only").
4. Place Order once (no double-click). The confirmation shows the order number, "Cash on Delivery" and the demo disclaimer; the bag is empty.
5. Admin → Orders: the order is present, Pending, total correct; the item and variant are right.
6. Admin → Inventory: that variant is now N − 1.
7. Cleanup: set the order to Cancelled and restore the variant's stock to N by hand (cancelling does not restore stock). To remove the row, delete it in the Supabase table editor.

## 5. Deployment (Vercel)

The repository deploys to Vercel from `main`. `vite.config.ts` pins the Nitro preset to `vercel`, so `npm run build` writes Vercel's Build Output to `.vercel/output` (git-ignored).

1. Apply the migrations in `supabase/migrations/` to the Supabase project.
2. In Vercel, set these environment variables (names only; never commit values):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — server only; must **not** have a `VITE_` prefix
3. Install command `npm install`, build command `npm run build` (the defaults for this repo).
4. In Supabase Auth settings, add the deployed URL to the allowed site / redirect URLs, and apply §2.
5. Smoke test the live URL: home, shop, one product, bag, checkout validation, the `/admin` redirect, then §3.
6. Confirm the demo banner and footer note are visible.

## 6. Remaining items

- Disable public sign-ups (§2).
- Signed-in admin flows and one end-to-end order have not been verified in the deployed environment (§3, §4).
- Sample data: stock quantities are test inventory.

## 7. Business decisions before accepting real orders

Contact details and social links; delivery areas, charges and timing; returns and exchange policy; the About story; what is in the box and any care or application guidance; real stock quantities and final prices; then set `DEMO_MODE = false`.
