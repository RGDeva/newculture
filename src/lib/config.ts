// ── Runtime config ────────────────────────────────────────────────────────
// Values come from Vite env vars; sensible placeholders otherwise.
// Set these in Vercel → Project → Settings → Environment Variables.

export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ||
  "hello@newculture.co";

export const CAL_STRATEGY_URL =
  (import.meta.env.VITE_CAL_URL as string | undefined) ||
  "https://cal.com/newculture/strategy";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as
  | string
  | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

// Admin page password — set VITE_ADMIN_PASSWORD in Vercel.
// Fallback is only for local dev; change in prod.
export const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "newculture";

export const mailtoHref = `mailto:${CONTACT_EMAIL}`;
