import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Prices are stored in PKR (see products.price in Supabase). Formatting only —
// does not convert or invent a pricing system.
export function formatPKR(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-US")}`;
}

// Portfolio/demo flag. While true, the storefront states that orders are test orders
// and will not be fulfilled. Set to false once VELMORA is ready to accept real orders
// and the business details (contact, delivery, returns) have been confirmed.
export const DEMO_MODE = true;
