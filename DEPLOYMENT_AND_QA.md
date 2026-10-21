# VELMORA — Manual QA & Deployment Handoff (portfolio demo)

`DEMO_MODE` stays `true` in `src/lib/utils.ts`. Do not change it for the portfolio deployment.

## 1. Data fixes to run yourself (Supabase SQL editor)

These change production data, so they have not been run for you.

**Rose Blush description** (removes the unsupported "handmade" claim):

```sql
update products
set description = 'A soft, elegant nude set for everyday wear.'
where slug = 'rose-blush';
```

**Ethereal Blush description** (stray trailing "blush." typo):

```sql
update products
set description = 'Sheer blush nails illuminated with a diffused pink aura for a soft, feminine finish.'
where slug = 'ethereal-blush';
```

**Rose Blush image** — only after you have an approved image (see §2). Update the existing row; do not insert a second one:

```sql
update product_images
set image_url = 'https://rmhomiuaimjlafqglzaq.supabase.co/storage/v1/object/public/product-images/products/rose-blush/hero.jpeg'
where product_id = (select id from products where slug = 'rose-blush');
```

Check that exactly one row was updated. If Rose Blush has more than one image row, restrict by `display_order = 0`.

## 2. Image needed for Rose Blush

No approved image exists locally. The six images in `Downloads\Velmora Images` are already in use by the other six products.

Needed: one photo of a nude / soft-beige press-on set that you own or are licensed to use, matching the other products' format.
- Same format as the other six: JPEG, portrait (about 4:5), roughly 1600 px on the long side.
- Upload it to the `product-images` bucket at `products/rose-blush/hero.jpeg`, then run the image SQL above.

Until then Rose Blush still loads its photo from another retailer's server (`redaspenlove.com`). That is the main blocker for a public portfolio link. Quick stopgap if you can't get a photo in time: set Rose Blush `active = false` in Admin → Products so it isn't shown.

## 3. Other product wording for you to confirm (not changed)

- Midnight Plum: "magnetic velvet … cat-eye finish". Confirm this is accurate for the product you are showing.
- Cloud Pearl: "luminous glazed finish". Confirm.
- The repo `README.md` still carries the original brief ("Handmade", "Reusable", "Salon Quality"). It is not shown on the site; edit it if the repo will be public.

## 4. Signed-in admin checklist (about 10 minutes)

Use a desktop browser, then repeat steps 2–6 once at 375 px (DevTools device mode).

1. Open `/admin` signed out → you land on `/admin/login`. Sign in with the admin account → dashboard loads, with no public nav, footer or demo banner.
2. **Dashboard:** counts, Recent Orders and Low Stock render. "View" opens an order.
3. **Orders:** search by name or phone and filter by status. Open an order and check items, address and "Cash on Delivery". Change the status → confirm dialog → Confirm → toast, then the badge updates and the list reflects it. Set it back afterwards.
4. **Products:** search. Click Edit → dialog fits the screen and scrolls if needed. Change a description, Save → toast. Reload the storefront product page and confirm the text changed.
5. **Inventory:** change one variant's stock (e.g. 12 → 11) → Save → toast, "Low" badge behaves at 5 or fewer. Open that product on the storefront and confirm the stock badge updates; set stock to 0 and confirm the combination shows unavailable and Add to Cart is disabled; then restore the value.
6. **Log Out** → you land on login; visiting `/admin/orders` redirects back to login.

## 5. One end-to-end test order (storefront → admin)

Creates one real row and decrements stock. Do it once, deliberately, and clean up after.

1. Note the stock of one variant in Admin → Inventory (e.g. Cloud Pearl, Pearl Ivory · Almond · Medium · XS = N).
2. Storefront: open that product, pick exactly that combination, Add to Cart, Checkout.
3. Submit empty → three field errors appear; fix them. Use obviously fake data, e.g. name "TEST ORDER", phone `03000000000`, address "Test only".
4. Place Order once, and don't double-click. Confirmation shows the order number, "Cash on Delivery" and the demo disclaimer; the bag is empty.
5. Admin → Orders: the order is present, Pending, total correct. Open it and check the item and variant.
6. Admin → Inventory: that variant is now N − 1.
7. Cleanup: set the order to Cancelled, and restore the variant's stock to N. (There is no stock restore on cancel, so restore it by hand.) If you want the row gone, delete it in the Supabase table editor.

## 6. Deployment steps

The repo is TanStack Start with a Nitro build whose default target is Cloudflare. No host-specific config (wrangler, vercel, netlify) is committed, so pick a host and confirm the Nitro preset for it. The build runs, but I have not deployed or tested a deployed build.

1. Confirm migrations are applied in Supabase, including `20260824120000_add_product_variant_color.sql`.
2. Run the SQL in §1 (and the image upload, once you have the image).
3. Set environment variables on the host (names only):
   - Client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Server: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
   - **Server only, never `VITE_`-prefixed:** `SUPABASE_SERVICE_ROLE_KEY`
4. `npm run build`, deploy the output for your host's Nitro preset.
5. In Supabase Auth settings, add the deployed URL to the allowed site / redirect URLs.
6. Smoke test the live URL: home, shop, one product, bag, checkout validation, `/admin` redirect, then §4.
7. Confirm the demo banner and footer note show on the live site.

## 7. Remaining blockers (portfolio demo)

- Rose Blush image hosted by another retailer; needs an owned or licensed image (§2).
- Rose Blush "handmade" description in the database until you run §1.
- Signed-in admin and one real order have not been tested by me (§4, §5).
- Deployment target and its Nitro preset not chosen; deployed behaviour untested.

## 8. Business decisions before real orders

Contact details and social links; delivery areas, charges and timing; returns / exchange policy; About story; what is in the box and any care or application guidance; real stock quantities and final prices; then set `DEMO_MODE = false`.
