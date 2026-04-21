# NewCulture — Ops

## Environment variables

All `VITE_*` vars are read at build time. Set them in:
- Local dev: `.env.local` (copy from `.env.example`)
- Production: Vercel → Project → Settings → Environment Variables → Production

| Variable | Purpose | Required |
|---|---|---|
| `VITE_CONTACT_EMAIL` | Powers every "Get in touch" mailto across the site | No (defaults to `hello@newculture.co`) |
| `VITE_CAL_URL` | Strong-fit booking link on `/apply` success | No (defaults to `cal.com/newculture/strategy`) |
| `VITE_SUPABASE_URL` | Supabase project URL | **Yes for prod lead capture** |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | **Yes for prod lead capture** |
| `VITE_ADMIN_PASSWORD` | Gate for `/admin/applications` | **Yes for prod** |

If Supabase env vars are absent, `/apply` still works but only writes to
`localStorage` and the admin page will show local-backup data.

## Supabase setup (one-time)

1. Create a new Supabase project.
2. Project → SQL editor → paste the contents of
   `supabase/migrations/0001_applications.sql` and run it.
3. Project → Settings → API → copy the **Project URL** and the **anon/public**
   key into Vercel env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Redeploy (Vercel → Deployments → Redeploy latest).
5. The `/apply` form will start writing directly to the `applications` table.

### Reading applications

The public anon key can **insert** but **cannot read** thanks to RLS policies
in the migration. Two options for reading:

- **Admin UI** (built-in): visit `/admin/applications` in prod, enter
  `VITE_ADMIN_PASSWORD`. You'll see a live-filtered inbox with CSV export,
  reviewer notes, and status flags (`new → reviewing → booked → archived`).
  *Note: for the admin UI to actually pull from Supabase, the anon key needs
  read access. To enable that quickly for early-stage use, edit the RLS
  policy in Supabase to allow `select` for `anon` — or swap the admin page
  to a Supabase service-role key in a future iteration.*
- **Supabase dashboard**: Project → Table editor → `applications`. Always
  works regardless of RLS because you're using the service role.
- **Weekly CSV export**: Admin UI → `EXPORT CSV`.

## Site routes (production)

| Path | Purpose |
|---|---|
| `/` | Marketing home. Hero, 3-offer teaser, tools strip, final CTA |
| `/services` | Full offer detail + in-flight case studies |
| `/apply` | Rigorous qualifying intake with tier-based routing |
| `/tools` | Authority surface: recommended stack, directory |
| `/network` | Reference directory of studios + creators |
| `/projects` | Mock client portal (internal demo) |
| `/admin/applications` | Password-gated ops inbox |

## CTA standardization

- **Primary** (solid button): `APPLY` → `/apply`
- **Secondary** (underline): `GET IN TOUCH` → `mailto:$VITE_CONTACT_EMAIL`
- **Strong-fit follow-up** (only on `/apply` success): `BOOK A STRATEGY CALL`
  → `$VITE_CAL_URL`

## Qualification scoring (at `src/pages/ApplyPage.tsx`)

```
score = budgetPoints(0..4)
      + (readyIn30Days ? 1 : 0)
      + (timeframe in {immediate, long-term} ? 1 : 0)
      + (advancedStage OR assets in {some, full} ? 1 : 0)
      + (engagement in {done-for-you, both} ? 1 : 0)

Strong  ≥ 6  → book strategy call (Cal.com)
Mid     3–5  → 48-hour review state
Light   < 3  → Blueprint + get-in-touch escape hatch
```
