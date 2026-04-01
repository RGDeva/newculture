import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, DollarSign, Mic2, Zap, ChevronRight, ArrowUpRight,
  Search, X, Filter, Clock, Tag, Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Types ──────────────────────────────────────────────────────────────────
type OppType = "featured" | "ar" | "paid" | "bounty";

interface Opportunity {
  id: string;
  type: OppType;
  title: string;
  company?: string;
  budget?: string;
  upside?: string;
  description: string;
  tags: string[];
  deadline?: string;
  slots?: number;
  featured?: boolean;
  new?: boolean;
}

// ── Seed Data ──────────────────────────────────────────────────────────────
const OPPORTUNITIES: Opportunity[] = [
  // Featured
  {
    id: "f1", type: "featured", featured: true,
    title: "NewCulture Artist Development Program",
    company: "NewCulture OS",
    budget: "Fully Funded",
    upside: "Label intro + distribution deal",
    description: "12-week intensive program for independent artists ready to scale. Includes weekly mentorship, studio access, release strategy, and direct introductions to A&R contacts at mid-major labels.",
    tags: ["All Genres", "Artist", "Development"],
    deadline: "Rolling",
    slots: 8,
  },
  {
    id: "f2", type: "featured", featured: true,
    title: "Sync Licensing — Film & TV Placement",
    company: "NewCulture Publishing",
    budget: "$500–$5,000 per sync",
    upside: "Backend royalties",
    description: "We're actively pitching our catalog for film, TV, and ad placements. Submit your best instrumental or vocal tracks for consideration. Selected tracks earn upfront sync fees plus backend performance royalties.",
    tags: ["Sync", "Instrumental", "Vocal", "All Genres"],
    deadline: "Ongoing",
  },
  // A&R / Deals
  {
    id: "ar1", type: "ar",
    title: "R&B / Pop Artist — Label Submission",
    company: "Atlantic Records (via NewCulture)",
    budget: "Deal TBD",
    upside: "360 deal or licensing offer",
    description: "A&R team actively searching for R&B/Pop crossover artists with strong streaming numbers (10k+ monthly listeners). Submit via the portal. Shortlisted artists will be contacted within 30 days.",
    tags: ["R&B", "Pop", "Artist", "Streaming"],
    deadline: "Apr 30, 2026",
    new: true,
  },
  {
    id: "ar2", type: "ar",
    title: "Hip-Hop Producer — Publishing Deal",
    company: "Sony Music Publishing",
    budget: "Advance: $10,000–$50,000",
    upside: "Co-publishing deal",
    description: "Looking for established hip-hop producers with proven placements or emerging talent with strong catalog. Must have at least 5 original beats ready to pitch. Publishing advance negotiable based on catalog quality.",
    tags: ["Hip-Hop", "Trap", "Producer", "Publishing"],
    deadline: "May 15, 2026",
  },
  {
    id: "ar3", type: "ar",
    title: "Independent Artist — Distribution & Marketing Campaign",
    company: "EMPIRE Distribution",
    budget: "Marketing budget provided",
    upside: "Distribution + promo campaign",
    description: "EMPIRE is looking for independent artists ready to release a full project. Successful applicants receive a distribution deal plus marketing budget for press, playlisting, and social media campaigns.",
    tags: ["All Genres", "Artist", "Distribution"],
    deadline: "Rolling",
  },
  {
    id: "ar4", type: "ar",
    title: "Latin Urban Artist — Showcase Opportunity",
    company: "Universal Music Latino",
    budget: "Performance fee + travel",
    upside: "Label meeting post-showcase",
    description: "Universal Music Latino is hosting a private showcase for unsigned Latin urban artists. Selected performers will receive performance fees, travel coverage, and guaranteed label meetings afterward.",
    tags: ["Latin", "Reggaeton", "Urban", "Artist"],
    deadline: "Apr 20, 2026",
    slots: 12,
    new: true,
  },
  // Paid Work
  {
    id: "pw1", type: "paid",
    title: "Mix & Master Engineer — 3-Track EP",
    company: "Independent Artist",
    budget: "$600–$900",
    description: "Indie pop/R&B artist seeking experienced mix and master engineer for 3-track EP. Looking for clean, radio-ready sound. Reference tracks provided. Turnaround within 7 business days.",
    tags: ["Mix", "Master", "Engineer", "Pop", "R&B"],
    deadline: "ASAP",
    new: true,
  },
  {
    id: "pw2", type: "paid",
    title: "Music Video Director — Hip-Hop Single",
    company: "Independent Label",
    budget: "$1,500–$3,000",
    description: "Small independent label needs a music video director for a hip-hop single. Strong narrative or cinematic style preferred. NYC or LA area. Must have reel and 2+ prior music video credits.",
    tags: ["Videographer", "Director", "Hip-Hop", "NYC", "LA"],
    deadline: "May 1, 2026",
  },
  {
    id: "pw3", type: "paid",
    title: "Session Guitarist — Studio Recording",
    company: "Nashville Session Works",
    budget: "$150–$300/session",
    description: "Nashville-based studio seeking experienced session guitarists for country and Americana projects. Union and non-union welcome. Must be able to read charts and work in a fast-paced environment.",
    tags: ["Session", "Guitar", "Country", "Nashville"],
    deadline: "Ongoing",
  },
  {
    id: "pw4", type: "paid",
    title: "Graphic Designer — Album Artwork",
    company: "Independent Artists",
    budget: "$200–$800",
    description: "Multiple independent artists seeking album and single cover artwork. Must have strong typography skills and dark/editorial aesthetic. Provide portfolio. 5–7 day turnaround expected per project.",
    tags: ["Design", "Artwork", "Cover Art", "Typography"],
    deadline: "Ongoing",
  },
  {
    id: "pw5", type: "paid",
    title: "Audio Engineer — Live Sound for Tour",
    company: "Mid-Size Touring Act",
    budget: "$250–$400/night",
    description: "Regional touring act (100–500 cap venues) seeking front-of-house engineer for 6-week spring tour. Experience with live hip-hop/R&B setups required. Must own or rent IEM system.",
    tags: ["Live Sound", "FOH", "Tour", "Engineer"],
    deadline: "Apr 25, 2026",
    slots: 1,
    new: true,
  },
  // Bounties
  {
    id: "b1", type: "bounty",
    title: "Need Mix/Master for Trap Single",
    company: "Independent Artist",
    budget: "$250–$350",
    description: "Trap/drill single needs professional mix and master. 808s-heavy, high-energy. Stems provided in Pro Tools format. Quick turnaround needed — 72 hours max. Drop link to recent work.",
    tags: ["Mix", "Master", "Trap", "Drill", "Quick Turnaround"],
    deadline: "72 hrs",
    new: true,
  },
  {
    id: "b2", type: "bounty",
    title: "Looking for Producer — R&B EP (5 tracks)",
    company: "Independent Artist",
    budget: "$1,000–$2,000 total",
    description: "Female R&B vocalist building debut EP. Need producer with strong melodic sensibility and experience in the 2020s R&B/neo-soul sound. References: Summer Walker, SZA. Open to co-writing.",
    tags: ["Producer", "R&B", "Neo-Soul", "EP", "Co-Write"],
    deadline: "Rolling",
  },
  {
    id: "b3", type: "bounty",
    title: "Vocalist for Afrobeats Collab",
    company: "Producer / Artist",
    budget: "$200 + 15% royalty share",
    description: "Established Afrobeats producer looking for a featured vocalist for a track targeting DSP playlist placement. Bring your own melody and topline. Full credits and royalty split included.",
    tags: ["Vocalist", "Afrobeats", "Collab", "Royalty Share"],
    deadline: "Rolling",
    new: true,
  },
  {
    id: "b4", type: "bounty",
    title: "Press Photo Shoot — NYC",
    company: "Independent Artist",
    budget: "$300–$500",
    description: "Brooklyn-based hip-hop artist needs editorial press photos for upcoming album campaign. Dark, cinematic aesthetic. Need 3–5 final edited shots with licensing for editorial use. NYC availability required.",
    tags: ["Photography", "Press", "NYC", "Hip-Hop", "Editorial"],
    deadline: "May 5, 2026",
  },
  {
    id: "b5", type: "bounty",
    title: "Transcribe & Chart 12 Songs — Session Band",
    company: "Live Band",
    budget: "$400 flat",
    description: "Chicago-based live band needs chord charts and lead sheets for 12 original songs for an upcoming recording session. Songs are in the R&B/funk/gospel vein. 1-week turnaround.",
    tags: ["Transcription", "Charts", "R&B", "Gospel", "Chicago"],
    deadline: "Apr 28, 2026",
  },
];

// ── Constants ──────────────────────────────────────────────────────────────
const TYPE_META: Record<OppType, { label: string; color: string; icon: React.ReactNode }> = {
  featured: { label: "FEATURED", color: "#f59e0b", icon: <Star size={10} fill="currentColor" /> },
  ar:       { label: "A&R / DEAL", color: "#a855f7", icon: <Mic2 size={10} /> },
  paid:     { label: "PAID WORK", color: "#22c55e", icon: <DollarSign size={10} /> },
  bounty:   { label: "BOUNTY", color: "#06b6d4", icon: <Zap size={10} /> },
};

const ALL_TYPES: OppType[] = ["featured", "ar", "paid", "bounty"];

// ── Activity Feed ─────────────────────────────────────────────────────────
const ACTIVITY = [
  "Artist applied to Atlantic Records A&R submission",
  "New bounty posted: \"Need trap mix/master — $300\"",
  "Studio session booked at Capitol Studios",
  "Producer matched with R&B vocalist for EP project",
  "New sync licensing opportunity added",
  "5 new opportunities posted this week",
];

function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  useState(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % ACTIVITY.length), 3500) as unknown as void;
    return id;
  });
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <span className="flex-shrink-0 inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-[9px] text-muted-foreground truncate"
        >
          {ACTIVITY[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Opportunity Card ──────────────────────────────────────────────────────
function OppCard({ opp, onClick }: { opp: Opportunity; onClick: () => void }) {
  const meta = TYPE_META[opp.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex cursor-pointer flex-col border border-border bg-background p-6 transition-all hover:border-foreground/40 hover:bg-card"
      onClick={onClick}
    >
      {opp.featured && (
        <div className="absolute right-4 top-4">
          <span className="border px-2 py-0.5 font-mono text-[8px] tracking-[0.2em]"
            style={{ color: "#f59e0b", borderColor: "#f59e0b40" }}>FEATURED</span>
        </div>
      )}
      {opp.new && !opp.featured && (
        <div className="absolute right-4 top-4">
          <span className="border border-[#22c55e40] px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-[#22c55e]">NEW</span>
        </div>
      )}

      {/* Type badge */}
      <div className="mb-4 flex items-center gap-1.5" style={{ color: meta.color }}>
        {meta.icon}
        <span className="font-mono text-[8px] tracking-[0.25em]">{meta.label}</span>
      </div>

      <h3 className="mb-1 font-mono text-sm font-bold leading-snug text-foreground pr-16">{opp.title}</h3>
      {opp.company && (
        <p className="mb-3 font-mono text-[9px] text-muted-foreground">{opp.company}</p>
      )}

      <p className="mb-4 flex-1 font-mono text-[10px] leading-relaxed text-muted-foreground line-clamp-3">
        {opp.description}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1">
        {opp.tags.slice(0, 4).map((t) => (
          <span key={t} className="border border-border px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground/60">{t}</span>
        ))}
      </div>

      {/* Budget / meta row */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3">
          {opp.budget && (
            <span className="font-mono text-[10px] font-bold" style={{ color: meta.color }}>
              {opp.budget}
            </span>
          )}
          {opp.deadline && (
            <span className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground/50">
              <Clock size={8} /> {opp.deadline}
            </span>
          )}
          {opp.slots && (
            <span className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground/50">
              <Users size={8} /> {opp.slots} slots
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground transition-colors group-hover:text-foreground">
          APPLY <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────
function OppModal({ opp, onClose }: { opp: Opportunity; onClose: () => void }) {
  const meta = TYPE_META[opp.type];
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
        className="w-full max-w-lg border border-border bg-background"
      >
        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: meta.color }} />

        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2" style={{ color: meta.color }}>
              {meta.icon}
              <span className="font-mono text-[8px] tracking-[0.25em]">{meta.label}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">{opp.title}</h2>
            {opp.company && <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{opp.company}</p>}
          </div>
          <button onClick={onClose} className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Budget / upside */}
          {(opp.budget || opp.upside) && (
            <div className="grid grid-cols-2 gap-3">
              {opp.budget && (
                <div className="border border-border p-3">
                  <p className="mb-1 font-mono text-[7px] tracking-[0.3em] text-muted-foreground/60">BUDGET / RATE</p>
                  <p className="font-mono text-sm font-bold" style={{ color: meta.color }}>{opp.budget}</p>
                </div>
              )}
              {opp.upside && (
                <div className="border border-border p-3">
                  <p className="mb-1 font-mono text-[7px] tracking-[0.3em] text-muted-foreground/60">UPSIDE</p>
                  <p className="font-mono text-xs text-foreground">{opp.upside}</p>
                </div>
              )}
            </div>
          )}

          <p className="font-mono text-xs leading-relaxed text-muted-foreground">{opp.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {opp.tags.map((t) => (
              <span key={t} className="border border-border px-2 py-0.5 font-mono text-[8px] text-muted-foreground">{t}</span>
            ))}
          </div>

          {(opp.deadline || opp.slots) && (
            <div className="flex items-center gap-4 border-t border-border pt-3">
              {opp.deadline && (
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                  <Clock size={9} /> DEADLINE: {opp.deadline}
                </span>
              )}
              {opp.slots && (
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                  <Users size={9} /> {opp.slots} SLOTS AVAILABLE
                </span>
              )}
            </div>
          )}

          <button
            className="w-full border py-3 font-mono text-xs tracking-[0.2em] text-background transition-all hover:opacity-90"
            style={{ background: meta.color, borderColor: meta.color }}
          >
            APPLY / SUBMIT
          </button>
          <p className="text-center font-mono text-[8px] text-muted-foreground/40">
            Applications reviewed by the NewCulture team within 5–10 business days
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function OpportunitiesPage() {
  const [activeTypes, setActiveTypes] = useState<Set<OppType>>(new Set(ALL_TYPES));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (t: OppType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size === 1) return prev; next.delete(t); } else next.add(t);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OPPORTUNITIES.filter((o) => {
      if (!activeTypes.has(o.type)) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        (o.company ?? "").toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeTypes, query]);

  const grouped = useMemo(() => {
    return ALL_TYPES.reduce<Record<OppType, Opportunity[]>>((acc, t) => {
      acc[t] = filtered.filter((o) => o.type === t);
      return acc;
    }, { featured: [], ar: [], paid: [], bounty: [] });
  }, [filtered]);

  const sectionTitles: Record<OppType, string> = {
    featured: "Featured Opportunities",
    ar: "A&R / Deals",
    paid: "Paid Work",
    bounty: "Bounties",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">// OPPORTUNITY MARKETPLACE</p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Opportunities</h1>
                <p className="mt-3 max-w-xl font-mono text-xs text-muted-foreground">
                  A&R submissions, paid creative work, and task bounties — the engine of the NewCulture economy.
                </p>
              </div>
              {/* Live activity ticker */}
              <div className="flex max-w-xs flex-col gap-2 border border-border bg-card px-4 py-3">
                <p className="font-mono text-[7px] tracking-[0.3em] text-muted-foreground/50">LIVE ACTIVITY</p>
                <ActivityTicker />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Search + filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities, skills, genres..."
                className="w-full border border-border bg-transparent py-2.5 pl-9 pr-9 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border px-3 py-2.5 font-mono text-xs transition-all ${showFilters ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              <Filter size={12} /> FILTER
            </button>
            <p className="font-mono text-[10px] text-muted-foreground sm:ml-auto">
              {filtered.length} opportunities
            </p>
          </div>

          {/* Type filter chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 py-2">
                  {ALL_TYPES.map((t) => {
                    const meta = TYPE_META[t];
                    const active = activeTypes.has(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className="flex items-center gap-2 border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] transition-all"
                        style={active
                          ? { background: meta.color, borderColor: meta.color, color: "#000" }
                          : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                      >
                        <span style={{ color: active ? "#000" : meta.color }}>{meta.icon}</span>
                        {meta.label}
                        <span className="opacity-60">({OPPORTUNITIES.filter(o => o.type === t).length})</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sections */}
          <div className="space-y-12">
            {ALL_TYPES.map((type) => {
              const items = grouped[type];
              if (items.length === 0) return null;
              const meta = TYPE_META[type];
              return (
                <div key={type}>
                  <div className="mb-6 flex items-center gap-3">
                    <span style={{ color: meta.color }}>{meta.icon}</span>
                    <h2 className="font-display text-2xl font-bold text-foreground">{sectionTitles[type]}</h2>
                    <span className="ml-1 font-mono text-[10px] text-muted-foreground/50">({items.length})</span>
                    <div className="ml-4 flex-1 border-t border-border" />
                  </div>
                  <div className={`grid gap-4 ${type === "featured" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                    {items.map((opp) => (
                      <OppCard key={opp.id} opp={opp} onClick={() => setSelected(opp)} />
                    ))}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-24">
                <p className="font-mono text-sm text-muted-foreground">No opportunities match your search.</p>
                <button onClick={() => { setQuery(""); setActiveTypes(new Set(ALL_TYPES)); }}
                  className="font-mono text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Post a bounty CTA */}
          <div className="mt-16 border border-border bg-card p-8 text-center">
            <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">HAVE A TASK OR PROJECT?</p>
            <h3 className="mb-3 font-display text-2xl font-bold text-foreground">Post a Bounty</h3>
            <p className="mx-auto mb-6 max-w-md font-mono text-xs text-muted-foreground">
              Need a mix, a video, a beat, or something else? Post a bounty and get matched with vetted creators in the network.
            </p>
            <button className="border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground">
              POST A BOUNTY →
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <OppModal opp={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
