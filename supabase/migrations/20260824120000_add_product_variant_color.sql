-- Add colour to product_variants so ready-made sets can be sold by
-- Colour + Shape + Length + Size, per the VELMORA product model.
-- Nullable text, matching the existing shape/length/size columns:
-- a specific colour+shape+length+size combination only exists if a
-- product_variants row for it exists (admin-controlled availability).
-- No RLS/grant changes needed: existing table-level policies and
-- grants already cover all columns.
ALTER TABLE public.product_variants ADD COLUMN color text;
