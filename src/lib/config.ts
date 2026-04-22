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

// Stripe
export const STRIPE_PUBLISHABLE_KEY = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

// RoEx API
// Provided key: AIzaSyB4APe-Ll9TCjvKyouegkbaQoXQ41R9ITg
export const ROEX_API_KEY =
  (import.meta.env.VITE_ROEX_API_KEY as string | undefined) ||
  "AIzaSyB4APe-Ll9TCjvKyouegkbaQoXQ41R9ITg";
export const ROEX_API_URL =
  (import.meta.env.VITE_ROEX_API_URL as string | undefined) ||
  "https://tonn-api.roexaudio.com/v1";

// Recoupable API
export const RECOUPABLE_API_KEY = import.meta.env.VITE_RECOUPABLE_API_KEY as
  | string
  | undefined;
export const RECOUPABLE_API_URL =
  (import.meta.env.VITE_RECOUPABLE_API_URL as string | undefined) ||
  "https://api.recoupable.com/v1";

// ONCE API
export const ONCE_API_KEY = import.meta.env.VITE_ONCE_API_KEY as
  | string
  | undefined;
export const ONCE_API_URL =
  (import.meta.env.VITE_ONCE_API_URL as string | undefined) ||
  "https://api.once.co/v1";

export const mailtoHref = `mailto:${CONTACT_EMAIL}`;

// Productized offer prices (cents for Stripe)
export const PRICES = {
  mixAnalysis: 5000, // $50.00
  auditCall: 15000, // $150.00
  marketingPackage: 50000, // $500.00
} as const;
