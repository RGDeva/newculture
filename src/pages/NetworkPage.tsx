import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, X, ExternalLink, Instagram, Globe,
  MapPin as MapPinIcon, List, Map, Star, Zap, Phone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { mailtoHref } from "@/lib/config";
import {
  CATEGORY_COLORS, CATEGORY_LABELS,
  type MapPin as CreatorPin, type PinCategory,
} from "@/components/ui/wireframe-dotted-globe";
import { CSV_STUDIO_PINS } from "@/data/csv-studios";
import SearchComponent from "@/components/ui/animated-glowing-search-bar";
import { AdvancedMap, type MapMarker } from "@/components/ui/interactive-map";

// ── Provider Application Section ─────────────────────────────────────────
function ProviderApplicationSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    portfolio: "",
    services: [] as string[],
    bio: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ROLES = ["Studio", "Producer", "Engineer", "Videographer", "DJ", "Creative"];
  const SERVICES = [
    "Recording",
    "Mixing",
    "Mastering",
    "Production",
    "Beat Making",
    "Music Videos",
    "Content Creation",
    "Live Performance",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.role) return;
    setSubmitting(true);
    try {
      if (supabase) {
        await supabase.from("provider_applications").insert({
          name: form.name,
          email: form.email,
          role: form.role,
          location: form.location || null,
          portfolio_url: form.portfolio || null,
          services: form.services,
          bio: form.bio || null,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      }
      const existing = JSON.parse(localStorage.getItem("nc_provider_apps") || "[]");
      existing.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("nc_provider_apps", JSON.stringify(existing));
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-foreground bg-foreground/5 p-8 text-center">
        <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-foreground">APPLICATION RECEIVED</p>
        <h3 className="mb-3 font-display text-xl font-bold text-foreground">Thanks for applying.</h3>
        <p className="mx-auto max-w-md font-mono text-xs text-muted-foreground">
          We review every application personally. If there's a fit, we'll reach out within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card/20 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">PROVIDERS</p>
          <h3 className="font-display text-xl font-bold text-foreground">Join the Network</h3>
          <p className="mt-2 max-w-md font-mono text-xs text-muted-foreground">
            Studios, engineers, producers, and creatives — apply to be listed in our curated directory.
            Free, but selective.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Name / Business Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-b border-border bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-foreground"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-b border-border bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-foreground"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            placeholder="Location (City, State)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border-b border-border bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-foreground"
          />
          <input
            type="url"
            placeholder="Portfolio / Website URL"
            value={form.portfolio}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            className="border-b border-border bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-foreground"
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">ROLE</p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.12em] transition-all ${
                  form.role === r
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">SERVICES OFFERED</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    services: form.services.includes(s)
                      ? form.services.filter((x) => x !== s)
                      : [...form.services, s],
                  })
                }
                className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.12em] transition-all ${
                  form.services.includes(s)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          placeholder="Short bio / credentials (optional)"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-foreground"
        />

        <div className="flex items-center justify-between pt-2">
          <p className="font-mono text-[9px] text-muted-foreground/50">
            By applying, you agree to be contacted about your listing.
          </p>
          <button
            type="submit"
            disabled={submitting || !form.name || !form.email.includes("@") || !form.role}
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
          >
            {submitting ? "SUBMITTING…" : "APPLY TO JOIN"}
          </button>
        </div>
      </form>
    </div>
  );
}

const RECENT_ACTIVITY = [
  { actor: "Kael Rivers",      action: "posted a new track",              time: "2m ago"  },
  { actor: "Capitol Studios",  action: "updated availability",            time: "5m ago"  },
  { actor: "Marco Voss",       action: "collaborated with Nova Saint",    time: "18m ago" },
  { actor: "88 Keys Lab",      action: "joined the network",              time: "32m ago" },
  { actor: "Lens & Lyte",      action: "completed a project",            time: "1h ago"  },
  { actor: "DJ Phantom",       action: "booked a studio session",         time: "2h ago"  },
  { actor: "YUNG HVNK",        action: "released a new single",           time: "3h ago"  },
  { actor: "Cipher Audio",     action: "accepted a mixing gig",           time: "4h ago"  },
];

const SEED_NETWORK: CreatorPin[] = [
  { id:"n-s1",  name:"Capitol Studios",       lat:34.1017, lng:-118.3265, city:"Los Angeles", state:"CA", category:"studio",       rating:4.8, reviewCount:312, website:"https://capitolstudios.com",      genres:["Pop","Rock","Orchestral"] },
  { id:"n-s2",  name:"Sunset Sound",          lat:34.0981, lng:-118.3368, city:"Hollywood",   state:"CA", category:"studio",       rating:4.7, reviewCount:198 },
  { id:"n-s3",  name:"Electric Lady Studios", lat:40.7336, lng:-74.0027,  city:"New York",    state:"NY", category:"studio",       rating:4.9, reviewCount:340, website:"https://electricladystudios.com" },
  { id:"n-s4",  name:"Quad Recording Studios",lat:40.7549, lng:-73.9919,  city:"New York",    state:"NY", category:"studio",       rating:4.6, reviewCount:89 },
  { id:"n-s5",  name:"STAX Recording Studio", lat:35.1175, lng:-90.0334,  city:"Memphis",     state:"TN", category:"studio",       rating:4.8, reviewCount:156, genres:["Soul","R&B","Blues"] },
  { id:"n-a1",  name:"Kael Rivers",           lat:34.0522, lng:-118.2437, city:"Los Angeles", state:"CA", category:"artist",       bio:"Vocalist & songwriter blending soul and alternative R&B.", genres:["R&B","Soul","Alternative"] },
  { id:"n-a2",  name:"Nova Saint",            lat:33.7490, lng:-84.3880,  city:"Atlanta",     state:"GA", category:"artist",       bio:"Neo-soul and afrobeats fusion artist.", genres:["Neo-Soul","Afrobeats","R&B"] },
  { id:"n-a3",  name:"YUNG HVNK",            lat:40.6782, lng:-73.9442,  city:"Brooklyn",    state:"NY", category:"artist",       bio:"Brooklyn drill & trap artist.", genres:["Drill","Trap","Hip-Hop"] },
  { id:"n-a4",  name:"Soleil Cruz",           lat:25.7617, lng:-80.1918,  city:"Miami",       state:"FL", category:"artist",       bio:"Miami-based reggaeton and Latin pop artist.", genres:["Reggaeton","Latin Pop"] },
  { id:"n-a5",  name:"Shade Element",         lat:40.7128, lng:-74.0060,  city:"New York",    state:"NY", category:"artist",       bio:"Experimental hip-hop producer and MC.", genres:["Hip-Hop","Experimental"] },
  { id:"n-p1",  name:"Marco Voss",            lat:25.7617, lng:-80.1918,  city:"Miami",       state:"FL", category:"producer",     bio:"Miami-based producer specializing in trap and pop crossover.", genres:["Trap","Pop","Electronic"] },
  { id:"n-p2",  name:"DSTL Beats",            lat:33.4484, lng:-112.0740, city:"Phoenix",     state:"AZ", category:"producer",     bio:"West Coast influenced boom-bap and cloud rap.", genres:["Boom-Bap","Cloud Rap"] },
  { id:"n-p3",  name:"Juno Park",             lat:34.0522, lng:-118.2437, city:"Los Angeles", state:"CA", category:"producer",     bio:"K-pop and alternative pop crossover production.", genres:["K-Pop","Alt-Pop","Synth"] },
  { id:"n-p4",  name:"88 Keys Lab",           lat:41.8781, lng:-87.6298,  city:"Chicago",     state:"IL", category:"producer",     bio:"Chicago producer rooted in soul samples and jazz chords.", genres:["Soul","Jazz","Hip-Hop"] },
  { id:"n-e1",  name:"Terry Mixdown",         lat:36.1627, lng:-86.7816,  city:"Nashville",   state:"TN", category:"engineer",     bio:"Grammy-affiliated mix engineer. Country, Americana, and pop.", genres:["Country","Americana","Pop"] },
  { id:"n-e2",  name:"Cipher Audio",          lat:34.0522, lng:-118.2437, city:"Los Angeles", state:"CA", category:"engineer",     bio:"Mixing and mastering for independent hip-hop and R&B releases.", genres:["Hip-Hop","R&B"] },
  { id:"n-e3",  name:"Flux Mastering",        lat:40.7128, lng:-74.0060,  city:"New York",    state:"NY", category:"engineer",     bio:"NYC-based mastering studio. Clients across all major labels.", genres:["All Genres"] },
  { id:"n-vg1", name:"Lens & Lyte",           lat:34.0522, lng:-118.2437, city:"Los Angeles", state:"CA", category:"videographer", bio:"Music video director. Cinematic storytelling for R&B and hip-hop.", genres:["Music Video","Short Film"] },
  { id:"n-vg2", name:"StillFrame Creative",   lat:40.6782, lng:-73.9442,  city:"Brooklyn",    state:"NY", category:"videographer", bio:"Documentary-style artist content and live performance shoots." },
  { id:"n-dj1", name:"DJ Phantom",            lat:36.1699, lng:-115.1398, city:"Las Vegas",   state:"NV", category:"dj",           bio:"Las Vegas residency DJ. Open format, EDM, and hip-hop blends.", genres:["EDM","Hip-Hop","Open Format"] },
  { id:"n-dj2", name:"Selector Blaze",        lat:25.7617, lng:-80.1918,  city:"Miami",       state:"FL", category:"dj",           bio:"Afrobeats and dancehall selector. Miami club circuit.", genres:["Afrobeats","Dancehall","Soca"] },
  { id:"n-ph1", name:"Studio Visions NYC",    lat:40.7128, lng:-74.0060,  city:"New York",    state:"NY", category:"photographer", bio:"Press photography, album covers, and editorial shoots.", genres:["Editorial","Press","Album Art"] },
  { id:"n-ph2", name:"Golden Hour Media",     lat:34.0522, lng:-118.2437, city:"Los Angeles", state:"CA", category:"photographer", bio:"Celebrity and artist lifestyle photography. LA-based.", genres:["Lifestyle","Celebrity","Editorial"] },
  { id:"n-m1",  name:"Zadie Luxe",            lat:34.0195, lng:-118.4912, city:"Los Angeles", state:"CA", category:"model",        bio:"Commercial and editorial model. Music video talent." },
  { id:"n-m2",  name:"Remi Okafor",           lat:40.7128, lng:-74.0060,  city:"New York",    state:"NY", category:"model",        bio:"Fashion and music editorial model. NYC-based." },
];

const SEED_NAMES = new Set(SEED_NETWORK.map((p) => p.name.toLowerCase()));
const ALL_NETWORK: CreatorPin[] = [
  ...SEED_NETWORK,
  ...CSV_STUDIO_PINS.filter((p) => !SEED_NAMES.has(p.name.toLowerCase())),
];

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as PinCategory[];
const US_STATES = Array.from(new Set(ALL_NETWORK.map((p) => p.state).filter(Boolean))).sort();

// ── Credibility score bar ─────────────────────────────────────────────────
function CredScore({ creator }: { creator: CreatorPin }) {
  const score = Math.min(100,
    (creator.rating ? 30 : 0) +
    (creator.bio ? 15 : 0) +
    (creator.genres?.length ? 15 : 0) +
    (creator.website ? 10 : 0) +
    (creator.instagram ? 10 : 0) +
    (creator.phone ? 5 : 0) +
    (creator.reviewCount ? Math.min(15, Math.floor(creator.reviewCount / 20)) : 0)
  );
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#64748b";
  return (
    <div className="flex items-center gap-1.5" title={`Credibility: ${score}/100`}>
      <div className="h-1 w-10 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-[8px]" style={{ color }}>{score}</span>
    </div>
  );
}

// ── Profile card (grid view) ──────────────────────────────────────────────
function CreatorGridCard({ creator, onClick }: { creator: CreatorPin; onClick: () => void }) {
  const color = CATEGORY_COLORS[creator.category] ?? "#fff";
  const recentAct = RECENT_ACTIVITY.find(a => a.actor === creator.name);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex cursor-pointer flex-col border border-border bg-background transition-all hover:border-foreground/40 hover:bg-card"
      onClick={onClick}
    >
      <div className="h-0.5 w-full" style={{ background: color }} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[8px] tracking-[0.2em]" style={{ color }}>
                {CATEGORY_LABELS[creator.category].toUpperCase()}
              </span>
              {recentAct && (
                <span className="ml-1 flex items-center gap-0.5 font-mono text-[7px] text-[#22c55e]">
                  <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-[#22c55e]" />
                  ACTIVE
                </span>
              )}
            </div>
            <p className="truncate font-mono text-[11px] font-bold leading-tight text-foreground">{creator.name}</p>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-[9px] text-muted-foreground">
              <MapPinIcon size={8} /> {creator.city}{creator.state ? `, ${creator.state}` : ""}
            </p>
          </div>
          {creator.rating !== undefined && (
            <span className="ml-2 flex flex-shrink-0 items-center gap-0.5 font-mono text-[9px] text-yellow-400">
              <Star size={8} fill="currentColor" /> {creator.rating.toFixed(1)}
            </span>
          )}
        </div>

        {creator.bio && (
          <p className="mb-3 line-clamp-2 font-mono text-[9px] leading-relaxed text-muted-foreground">
            {creator.bio}
          </p>
        )}

        {creator.genres && creator.genres.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {creator.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="border px-1.5 py-0.5 font-mono text-[7px] text-muted-foreground/70"
                style={{ borderColor: color + "30" }}
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {recentAct && (
          <div className="mb-3 flex items-center gap-1.5 border-l-2 pl-2" style={{ borderColor: "#22c55e60" }}>
            <Zap size={8} className="flex-shrink-0 text-[#22c55e]" />
            <p className="truncate font-mono text-[8px] text-muted-foreground/70">
              {recentAct.action}{" "}
              <span className="text-muted-foreground/40">{recentAct.time}</span>
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
          <CredScore creator={creator} />
          <span className="font-mono text-[8px] text-muted-foreground/40 transition-colors group-hover:text-muted-foreground">
            VIEW →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Row (list view) ───────────────────────────────────────────────────────
function CreatorRow({ creator, onClick }: { creator: CreatorPin; onClick: () => void }) {
  const color = CATEGORY_COLORS[creator.category] ?? "#fff";
  const isRecent = RECENT_ACTIVITY.some(a => a.actor === creator.name);
  return (
    <div
      className="flex cursor-pointer items-center gap-4 border-b border-border px-5 py-3.5 transition-colors hover:bg-card"
      onClick={onClick}
    >
      <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-mono text-[11px] font-bold text-foreground">{creator.name}</p>
          {isRecent && <span className="h-1 w-1 flex-shrink-0 animate-pulse rounded-full bg-[#22c55e]" />}
        </div>
        <p className="font-mono text-[9px] text-muted-foreground">
          {creator.city}{creator.state ? `, ${creator.state}` : ""}
          {creator.genres && creator.genres.length > 0 && (
            <span className="ml-2 opacity-60">· {creator.genres.slice(0, 2).join(", ")}</span>
          )}
        </p>
      </div>
      <div className="hidden flex-shrink-0 sm:block">
        <span
          className="border px-2 py-0.5 font-mono text-[8px]"
          style={{ color, borderColor: color + "40" }}
        >
          {CATEGORY_LABELS[creator.category].toUpperCase()}
        </span>
      </div>
      {creator.rating !== undefined && (
        <span className="hidden flex-shrink-0 items-center gap-0.5 font-mono text-[9px] text-yellow-400 md:flex">
          <Star size={8} fill="currentColor" /> {creator.rating.toFixed(1)}
        </span>
      )}
      <CredScore creator={creator} />
      <ExternalLink size={11} className="flex-shrink-0 text-muted-foreground/30" />
    </div>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────────
function CreatorModal({ creator, onClose }: { creator: CreatorPin; onClose: () => void }) {
  const color = CATEGORY_COLORS[creator.category] ?? "#fff";
  const recentAct = RECENT_ACTIVITY.find(a => a.actor === creator.name);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="w-full max-w-md border border-border bg-background"
      >
        <div className="h-1 w-full" style={{ background: color }} />
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color }}>
                {CATEGORY_LABELS[creator.category].toUpperCase()}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{creator.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <MapPinIcon size={9} /> {creator.city}{creator.state ? `, ${creator.state}` : ""}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          {recentAct && (
            <div className="flex items-center gap-2 border border-[#22c55e30] bg-[#22c55e08] px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
              <p className="font-mono text-[9px] text-[#22c55e]">
                {recentAct.action} · {recentAct.time}
              </p>
            </div>
          )}

          {creator.bio && (
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">{creator.bio}</p>
          )}

          {creator.genres && creator.genres.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/60">GENRES / SPECIALTIES</p>
              <div className="flex flex-wrap gap-1.5">
                {creator.genres.map((g) => (
                  <span key={g} className="border border-border px-2 py-0.5 font-mono text-[8px] text-muted-foreground">{g}</span>
                ))}
              </div>
            </div>
          )}

          {creator.rating !== undefined && (
            <div className="flex items-center gap-3 border-t border-border pt-3">
              <div className="flex items-center gap-1 text-yellow-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={10} fill={i <= Math.round(creator.rating!) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-foreground">{creator.rating.toFixed(1)}</span>
              {creator.reviewCount && (
                <span className="font-mono text-[9px] text-muted-foreground">({creator.reviewCount.toLocaleString()} reviews)</span>
              )}
            </div>
          )}

          <div className="pt-1">
            <p className="mb-2 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/60">CREDIBILITY</p>
            <CredScore creator={creator} />
          </div>

          {creator.phone && (
            <a href={`tel:${creator.phone}`} className="flex items-center gap-2 font-mono text-xs text-foreground hover:underline">
              <Phone size={10} /> {creator.phone}
            </a>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {creator.gmbUrl && (
              <a href={creator.gmbUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <MapPinIcon size={10} /> MAPS
              </a>
            )}
            {creator.website && (
              <a href={creator.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <Globe size={10} /> WEBSITE
              </a>
            )}
            {creator.instagram && (
              <a href={`https://instagram.com/${creator.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-border px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground">
                <Instagram size={10} /> IG
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Activity ticker ───────────────────────────────────────────────────────
function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % RECENT_ACTIVITY.length), 3000);
    return () => clearInterval(id);
  }, []);
  const a = RECENT_ACTIVITY[idx];
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-[#22c55e]" />
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="truncate font-mono text-[9px] text-muted-foreground"
        >
          <span className="text-foreground">{a.actor}</span> {a.action} · {a.time}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function NetworkPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(new Set(ALL_CATEGORIES));
  const [stateFilter, setStateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "state">("name");
  const [displayMode, setDisplayMode] = useState<"grid" | "rows">("grid");
  const [selected, setSelected] = useState<CreatorPin | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const toggleCat = (cat: PinCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size === 1) return prev; next.delete(cat); } else next.add(cat);
      return next;
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_NETWORK
      .filter((p) => {
        if (!activeCategories.has(p.category)) return false;
        if (stateFilter !== "ALL" && p.state !== stateFilter) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          (p.bio ?? "").toLowerCase().includes(q) ||
          (p.genres ?? []).some((g) => g.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[p.category].toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
        if (sortBy === "state") return (a.state ?? "").localeCompare(b.state ?? "");
        return a.name.localeCompare(b.name);
      });
  }, [query, activeCategories, stateFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const categoryCounts = useMemo(() =>
    ALL_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
      acc[cat] = ALL_NETWORK.filter((p) => p.category === cat).length;
      return acc;
    }, {}), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">// REFERENCE DIRECTORY</p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Network</h1>
                <p className="mt-2 max-w-lg font-mono text-xs text-muted-foreground">
                  {ALL_NETWORK.length.toLocaleString()} studios, engineers, producers, and creators we've worked with or reference when scoping client releases.
                </p>
              </div>
              {/* Service CTA rail */}
              <div className="w-full max-w-xs border border-foreground bg-foreground/5 px-4 py-3">
                <p className="mb-1 font-mono text-[9px] tracking-[0.25em] text-foreground">
                  NEED A TEAM BUILT AROUND YOU?
                </p>
                <p className="mb-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  We assemble the right engineers, producers, and providers around each client engagement.
                </p>
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-foreground underline underline-offset-[5px] hover:opacity-70"
                >
                  APPLY →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Controls bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* View toggle: List / Map */}
            <div className="flex gap-0 border border-border">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[9px] tracking-[0.1em] transition-all ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List size={11} /> LIST
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 border-l border-border px-3 py-2 font-mono text-[9px] tracking-[0.1em] transition-all ${viewMode === "map" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Map size={11} /> MAP
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by name, city, genre, role..."
                className="w-full border border-border bg-transparent py-2 pl-9 pr-8 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* State */}
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
              className="border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground focus:border-foreground focus:outline-none"
            >
              <option value="ALL">ALL STATES</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "rating" | "state")}
              className="border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground focus:border-foreground focus:outline-none"
            >
              <option value="name">A–Z</option>
              <option value="rating">TOP RATED</option>
              <option value="state">BY STATE</option>
            </select>

            {/* Grid/Row toggle (list mode only) */}
            {viewMode === "list" && (
              <div className="flex gap-0 border border-border">
                <button
                  onClick={() => setDisplayMode("grid")}
                  className={`px-3 py-2 font-mono text-[9px] transition-all ${displayMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  GRID
                </button>
                <button
                  onClick={() => setDisplayMode("rows")}
                  className={`border-l border-border px-3 py-2 font-mono text-[9px] transition-all ${displayMode === "rows" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  ROWS
                </button>
              </div>
            )}
          </div>

          {/* Role filter chips — always visible */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategories(new Set(ALL_CATEGORIES)); setPage(1); }}
              className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] transition-all ${activeCategories.size === ALL_CATEGORIES.length ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              ALL ({ALL_NETWORK.length})
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className="flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] transition-all"
                style={activeCategories.has(cat)
                  ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat], color: "#000" }
                  : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: activeCategories.has(cat) ? "#000" : CATEGORY_COLORS[cat] }}
                />
                {CATEGORY_LABELS[cat].toUpperCase()}
                <span className="opacity-60">({categoryCounts[cat]})</span>
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] text-muted-foreground">
              {filtered.length.toLocaleString()} RESULTS
              {query && <span className="ml-2 opacity-60">for "{query}"</span>}
            </p>
            {viewMode === "list" && totalPages > 1 && (
              <p className="font-mono text-[9px] text-muted-foreground/50">PAGE {page} / {totalPages}</p>
            )}
          </div>

          {/* MAP VIEW */}
          {viewMode === "map" && (
            <div className="space-y-4">
              <div className="flex justify-center py-2">
                <SearchComponent
                  placeholder="Search the map..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                />
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <AdvancedMap
                  center={[39.8283, -98.5795]}
                  zoom={4}
                  markers={filtered
                    .filter((c) => c.lat && c.lng)
                    .map((c): MapMarker => ({
                      id: c.id,
                      position: [c.lat, c.lng],
                      color: c.category === "artist" ? "red" : c.category === "producer" ? "blue" : c.category === "engineer" ? "green" : c.category === "studio" ? "gold" : c.category === "videographer" ? "violet" : c.category === "dj" ? "orange" : "grey",
                      size: "medium",
                      popup: {
                        title: c.name,
                        content: `${CATEGORY_LABELS[c.category]} · ${c.city}${c.state ? `, ${c.state}` : ""}${c.genres?.length ? " · " + c.genres.slice(0, 2).join(", ") : ""}`,
                      },
                    }))}
                  onMarkerClick={(marker) => {
                    const creator = filtered.find((c) => c.id === marker.id);
                    if (creator) setSelected(creator);
                  }}
                  enableClustering={true}
                  enableSearch={true}
                  enableControls={true}
                  style={{ height: "600px", width: "100%" }}
                />
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <>
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-24 border border-border">
                  <p className="font-mono text-sm text-muted-foreground">No creators match your filters.</p>
                  <button
                    onClick={() => { setQuery(""); setActiveCategories(new Set(ALL_CATEGORIES)); setStateFilter("ALL"); }}
                    className="font-mono text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Clear filters
                  </button>
                </div>
              ) : displayMode === "grid" ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginated.map((c) => (
                    <CreatorGridCard key={c.id} creator={c} onClick={() => setSelected(c)} />
                  ))}
                </div>
              ) : (
                <div className="border border-border">
                  <div className="hidden border-b border-border bg-card px-5 py-2 sm:flex items-center gap-4">
                    <span className="w-2 flex-shrink-0" />
                    <span className="flex-1 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">NAME / LOCATION</span>
                    <span className="hidden w-24 flex-shrink-0 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60 sm:block">ROLE</span>
                    <span className="hidden w-16 flex-shrink-0 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60 md:block">RATING</span>
                    <span className="w-16 flex-shrink-0 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">CRED</span>
                    <span className="w-4 flex-shrink-0" />
                  </div>
                  {paginated.map((c) => (
                    <CreatorRow key={c.id} creator={c} onClick={() => setSelected(c)} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border border-border px-4 py-2 font-mono text-[9px] text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:opacity-30"
                  >
                    ← PREV
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`border px-3 py-2 font-mono text-[9px] transition-all ${p === page ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="border border-border px-4 py-2 font-mono text-[9px] text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:opacity-30"
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Provider Application */}
          <ProviderApplicationSection />

          {/* CTA */}
          <div className="mt-16 border border-border bg-card p-8 text-center">
            <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">WORKING WITH US?</p>
            <h3 className="mb-3 font-display text-2xl font-bold text-foreground">We build your team for you.</h3>
            <p className="mx-auto mb-6 max-w-md font-mono text-xs text-muted-foreground">
              Every client release is matched with the right producers, engineers, and providers from our vetted network. You don't sort through the directory — we do.
            </p>
            <Link to="/apply" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground">
              APPLY →
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <CreatorModal creator={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
