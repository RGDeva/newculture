import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Download,
  Lock,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { ADMIN_PASSWORD } from "@/lib/config";

type Tier = "strong" | "mid" | "light";
type Status = "new" | "reviewing" | "booked" | "archived";

interface Application {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  artist_name: string;
  role: string;
  music_links: string[];
  stage: string;
  target_release_date: string | null;
  support_areas: string[];
  engagement: string;
  assets: string;
  timeframe: string;
  bottleneck: string;
  budget: string;
  ready_thirty_days: boolean;
  notes: string | null;
  score: number;
  tier: Tier;
  offer: string | null;
  interest: string | null;
  status: Status;
  reviewer_notes: string | null;
}

const TIER_META: Record<Tier, { label: string; color: string; icon: typeof Sparkles }> = {
  strong: { label: "STRONG", color: "#22c55e", icon: Sparkles },
  mid: { label: "MID", color: "#f59e0b", icon: CheckCircle2 },
  light: { label: "LIGHT", color: "#a855f7", icon: Compass },
};

const STATUS_OPTIONS: Status[] = ["new", "reviewing", "booked", "archived"];

// ── Gate ──────────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem("nc_admin", "1");
      onUnlock();
    } else {
      setErr("Incorrect password.");
    }
  };
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form
        onSubmit={handle}
        className="w-full max-w-sm border border-border bg-card/40 p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <Lock size={14} className="text-foreground" />
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            ADMIN
          </p>
        </div>
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
          Applications
        </h1>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mb-4 w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
        />
        {err && (
          <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-destructive">
            {err}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-between border border-foreground bg-foreground px-4 py-3 font-mono text-[11px] tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground"
        >
          UNLOCK <ArrowRight size={12} />
        </button>
      </form>
    </div>
  );
}

// ── Detail drawer ─────────────────────────────────────────────────────────
function Detail({
  app,
  onClose,
  onUpdate,
}: {
  app: Application;
  onClose: () => void;
  onUpdate: (patch: Partial<Application>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-end bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-background p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="border px-2 py-0.5 font-mono text-[9px] tracking-[0.2em]"
                style={{ color: TIER_META[app.tier].color, borderColor: TIER_META[app.tier].color }}
              >
                {TIER_META[app.tier].label} · SCORE {app.score}
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                {new Date(app.created_at).toLocaleString()}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {app.artist_name}
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              {app.full_name} · {app.email} · {app.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ status: s })}
              className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] transition-all ${
                app.status === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-6 font-mono text-xs">
          <Row label="MUSIC LINKS">
            {app.music_links.map((l) => (
              <a
                key={l}
                href={l}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-foreground underline underline-offset-[3px] hover:opacity-70"
              >
                {l}
              </a>
            ))}
          </Row>
          <Row label="STAGE">{app.stage}</Row>
          <Row label="TARGET RELEASE">{app.target_release_date || "—"}</Row>
          <Row label="SUPPORT AREAS">
            <div className="flex flex-wrap gap-1.5">
              {app.support_areas.map((s) => (
                <span
                  key={s}
                  className="border border-border px-2 py-0.5 text-[10px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </Row>
          <Row label="ENGAGEMENT">{app.engagement}</Row>
          <Row label="ASSETS">{app.assets}</Row>
          <Row label="TIMEFRAME">{app.timeframe}</Row>
          <Row label="BUDGET">{app.budget}</Row>
          <Row label="READY 30 DAYS">{app.ready_thirty_days ? "Yes" : "No"}</Row>
          <Row label="BOTTLENECK">
            <p className="leading-relaxed text-foreground">{app.bottleneck}</p>
          </Row>
          {app.notes && (
            <Row label="NOTES">
              <p className="leading-relaxed text-foreground">{app.notes}</p>
            </Row>
          )}
          {app.offer && <Row label="OFFER">{app.offer}</Row>}
          {app.interest && <Row label="INTEREST">{app.interest}</Row>}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
            REVIEWER NOTES
          </p>
          <textarea
            defaultValue={app.reviewer_notes ?? ""}
            onBlur={(e) => onUpdate({ reviewer_notes: e.target.value })}
            rows={4}
            placeholder="Private notes for the team…"
            className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
          />
        </div>

        <div className="mt-8 flex gap-3">
          <a
            href={`mailto:${app.email}?subject=Your%20NewCulture%20application`}
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            REPLY BY EMAIL <ArrowRight size={12} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-border pb-3">
      <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60">
        {label}
      </p>
      <div className="text-foreground">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdminApplicationsPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("nc_admin") === "1",
  );
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);

  const loadApps = async () => {
    if (!supabase) {
      // Fallback: read from localStorage
      try {
        const local = JSON.parse(localStorage.getItem("nc_applications") || "[]");
        const mapped: Application[] = local.map((a: any, i: number) => ({
          id: `local-${i}`,
          created_at: a.submittedAt ?? new Date().toISOString(),
          full_name: a.fullName,
          email: a.email,
          artist_name: a.artistName,
          role: a.role ?? "—",
          music_links: a.musicLinks ?? [],
          stage: a.stage ?? "—",
          target_release_date: a.targetReleaseDate || null,
          support_areas: a.supportAreas ?? [],
          engagement: a.engagement ?? "—",
          assets: a.assets ?? "—",
          timeframe: a.timeframe ?? "—",
          bottleneck: a.bottleneck ?? "",
          budget: a.budget ?? "—",
          ready_thirty_days: !!a.readyThirtyDays,
          notes: a.notes ?? null,
          score: a._score ?? 0,
          tier: (a._tier as Tier) ?? "light",
          offer: a.offer ?? null,
          interest: null,
          status: "new",
          reviewer_notes: null,
        }));
        setApps(mapped.reverse());
        setError(
          "Showing local backup — Supabase is not configured. Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to load production data.",
        );
      } catch {
        setApps([]);
      }
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (err) {
      setError(err.message);
    } else {
      setApps((data as Application[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (unlocked) loadApps();
  }, [unlocked]);

  const handleUpdate = async (id: string, patch: Partial<Application>) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? ({ ...a, ...patch } as Application) : a)),
    );
    if (selected?.id === id) setSelected({ ...selected, ...patch } as Application);
    if (supabase && !id.startsWith("local-")) {
      await supabase.from("applications").update(patch).eq("id", id);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      if (tierFilter !== "all" && a.tier !== tierFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.artist_name.toLowerCase().includes(q) ||
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.bottleneck.toLowerCase().includes(q)
      );
    });
  }, [apps, tierFilter, statusFilter, query]);

  const exportCsv = () => {
    const rows = [
      [
        "created_at",
        "tier",
        "score",
        "status",
        "full_name",
        "email",
        "artist_name",
        "role",
        "stage",
        "budget",
        "ready_30",
        "engagement",
        "timeframe",
      ],
      ...filtered.map((a) => [
        a.created_at,
        a.tier,
        a.score,
        a.status,
        a.full_name,
        a.email,
        a.artist_name,
        a.role,
        a.stage,
        a.budget,
        a.ready_thirty_days ? "yes" : "no",
        a.engagement,
        a.timeframe,
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((v) => {
            const s = String(v ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nc-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border px-6 py-10">
          <div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // ADMIN · APPLICATIONS
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Inbox
              </h1>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {apps.length} total · {apps.filter((a) => a.status === "new").length}{" "}
                new
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadApps}
                disabled={loading}
                className="border border-border px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:opacity-50"
              >
                {loading ? "LOADING…" : "REFRESH"}
              </button>
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground"
              >
                <Download size={11} /> EXPORT CSV
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {error && (
            <div className="mb-6 border border-dashed border-border bg-card/40 px-5 py-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search artist, email, or bottleneck…"
                className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "strong", "mid", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] transition-all ${
                    tierFilter === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", ...STATUS_OPTIONS] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as Status | "all")}
                  className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] transition-all ${
                    statusFilter === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-border">
            <div className="hidden grid-cols-[90px_1fr_180px_120px_90px_110px_90px] gap-4 border-b border-border bg-card/30 px-5 py-3 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/70 md:grid">
              <span>TIER</span>
              <span>ARTIST / EMAIL</span>
              <span>ROLE · STAGE</span>
              <span>BUDGET</span>
              <span>READY 30</span>
              <span>STATUS</span>
              <span>DATE</span>
            </div>
            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center font-mono text-[11px] text-muted-foreground">
                No applications match your filters.
              </div>
            )}
            {filtered.map((a) => {
              const Tier = TIER_META[a.tier].icon;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="grid w-full grid-cols-1 gap-2 border-b border-border px-5 py-4 text-left font-mono text-xs text-foreground transition-colors hover:bg-card/40 md:grid-cols-[90px_1fr_180px_120px_90px_110px_90px] md:gap-4 md:text-[11px]"
                >
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{ color: TIER_META[a.tier].color }}
                  >
                    <Tier size={10} strokeWidth={1.5} />
                    {TIER_META[a.tier].label}
                    <span className="text-muted-foreground/50">· {a.score}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{a.artist_name}</span>
                    <span className="block truncate text-muted-foreground/60">
                      {a.email}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {a.role} · {a.stage}
                  </span>
                  <span className="text-muted-foreground">{a.budget}</span>
                  <span className="text-muted-foreground">
                    {a.ready_thirty_days ? "yes" : "no"}
                  </span>
                  <span className="text-muted-foreground">{a.status}</span>
                  <span className="text-muted-foreground/60">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selected && (
        <Detail
          app={selected}
          onClose={() => setSelected(null)}
          onUpdate={(patch) => handleUpdate(selected.id, patch)}
        />
      )}

      <Footer />
    </div>
  );
}
