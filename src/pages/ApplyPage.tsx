import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Form shape (Supabase-ready) ───────────────────────────────────────────
type ReleaseStage =
  | "writing"
  | "recording"
  | "mixing"
  | "mastered-unreleased"
  | "released-no-traction";

type BudgetRange =
  | "under-1k"
  | "1k-5k"
  | "5k-15k"
  | "15k-plus"
  | "scope-it";

const GOAL_OPTIONS = [
  "Finish the song",
  "Package & distribute",
  "Run paid rollout",
  "Build direct-to-fan",
  "Grow audience",
  "Sustainable income",
] as const;

type Goal = (typeof GOAL_OPTIONS)[number];

interface ApplicationPayload {
  offer?: string | null;
  artistName: string;
  email: string;
  location: string;
  primaryMusicLink: string;
  genre: string;
  stage: ReleaseStage | "";
  bottleneck: string;
  goals: Goal[];
  needMixMaster: boolean;
  needRollout: boolean;
  needD2F: boolean;
  budget: BudgetRange | "";
  notes: string;
  submittedAt: string;
}

const STAGE_OPTIONS: { value: ReleaseStage; label: string }[] = [
  { value: "writing", label: "Writing" },
  { value: "recording", label: "Recording" },
  { value: "mixing", label: "Mixing" },
  { value: "mastered-unreleased", label: "Mastered, unreleased" },
  { value: "released-no-traction", label: "Released, no traction" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under-1k", label: "Under $1k" },
  { value: "1k-5k", label: "$1k – $5k" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-plus", label: "$15k+" },
  { value: "scope-it", label: "Let's scope it together" },
];

// ── Input primitives (match brutalist aesthetic) ─────────────────────────
function FieldLabel({ step, label, required }: { step: string; label: string; required?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
        {step} / {label}
      </p>
      {required && (
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
          REQUIRED
        </span>
      )}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-foreground"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-foreground"
    />
  );
}

function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  multi,
}: {
  options: { value: T; label: string }[] | readonly T[];
  value: T | T[] | null;
  onChange: (v: T) => void;
  multi?: boolean;
}) {
  const isSelected = (v: T) => (multi ? (value as T[])?.includes(v) : value === v);
  const normalized =
    typeof options[0] === "string"
      ? (options as readonly T[]).map((v) => ({ value: v, label: v as string }))
      : (options as { value: T; label: string }[]);
  return (
    <div className="flex flex-wrap gap-2">
      {normalized.map((o) => {
        const selected = isSelected(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`border px-3 py-2 font-mono text-[11px] tracking-[0.15em] transition-all ${
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {o.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3">
      <p className="font-mono text-sm text-foreground">{label}</p>
      <div className="flex gap-2">
        {[
          { v: true, l: "YES" },
          { v: false, l: "NO" },
        ].map((o) => (
          <button
            key={o.l}
            type="button"
            onClick={() => onChange(o.v)}
            className={`border px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-all ${
              value === o.v
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const [searchParams] = useSearchParams();
  const preselectedOffer = searchParams.get("offer");
  const interest = searchParams.get("interest");

  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<ApplicationPayload>({
    offer: preselectedOffer,
    artistName: "",
    email: "",
    location: "",
    primaryMusicLink: "",
    genre: "",
    stage: "",
    bottleneck: "",
    goals: [],
    needMixMaster: false,
    needRollout: false,
    needD2F: false,
    budget: "",
    notes: interest ? `Interested in: ${interest}` : "",
    submittedAt: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [submitted]);

  const toggleGoal = (g: Goal) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(g)
        ? prev.goals.filter((x) => x !== g)
        : [...prev.goals, g],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ApplicationPayload = {
      ...data,
      submittedAt: new Date().toISOString(),
    };
    // Supabase-ready mock: persist in localStorage for now.
    try {
      const key = "nc_applications";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(payload);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <section className="border-b border-border px-6 py-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl"
            >
              <div className="mb-8 flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="text-foreground"
                  strokeWidth={1.5}
                />
                <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                  // APPLICATION RECEIVED
                </p>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                We'll be in touch within 48 hours.
              </h1>
              <p className="mb-10 font-mono text-sm leading-relaxed text-muted-foreground">
                Every application is reviewed by our team personally. Expect a
                response from us with one of two things:
              </p>
              <ul className="mb-12 space-y-4 border-l border-border pl-6">
                <li className="font-mono text-sm leading-relaxed text-foreground">
                  → A release-review call booking link
                </li>
                <li className="font-mono text-sm leading-relaxed text-foreground">
                  → A direct email from our team with a scoped recommendation
                </li>
              </ul>
              <div className="border border-border bg-card/40 p-6">
                <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                  WHILE YOU WAIT
                </p>
                <p className="mb-4 font-mono text-sm leading-relaxed text-muted-foreground">
                  Have a look at the operating stack we use with clients — the
                  providers, tools, and systems we deploy for every release.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/tools"
                    className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
                  >
                    EXPLORE OUR STACK <ArrowRight size={12} />
                  </Link>
                  <Link
                    to="/"
                    className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground self-center"
                  >
                    BACK TO HOME
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="border-b border-border px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 font-mono text-[10px] tracking-[0.4em] text-muted-foreground"
            >
              // APPLY FOR RELEASE SUPPORT
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl"
            >
              Tell us about your release.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground"
            >
              Five short sections. Takes most artists under three minutes. We
              personally review every submission.
            </motion.p>
            {preselectedOffer && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 inline-flex items-center gap-2 border border-border px-3 py-1.5"
                >
                  <Check size={11} className="text-foreground" />
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    INTEREST: {preselectedOffer.toUpperCase()}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Form */}
        <section className="px-6 py-16">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-16">
            {/* Step 1 */}
            <div className="space-y-6">
              <div>
                <FieldLabel step="01" label="ARTIST NAME" required />
                <TextInput
                  required
                  value={data.artistName}
                  onChange={(e) => setData({ ...data, artistName: e.target.value })}
                  placeholder="Your stage name"
                />
              </div>
              <div>
                <FieldLabel step="01" label="EMAIL" required />
                <TextInput
                  required
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="you@domain.com"
                />
              </div>
              <div>
                <FieldLabel step="01" label="CITY / COUNTRY" />
                <TextInput
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="Los Angeles, CA"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-6">
              <div>
                <FieldLabel step="02" label="PRIMARY MUSIC LINK" required />
                <TextInput
                  required
                  type="url"
                  value={data.primaryMusicLink}
                  onChange={(e) => setData({ ...data, primaryMusicLink: e.target.value })}
                  placeholder="Spotify, SoundCloud, or YouTube"
                />
              </div>
              <div>
                <FieldLabel step="02" label="GENRE / STYLE" />
                <TextInput
                  value={data.genre}
                  onChange={(e) => setData({ ...data, genre: e.target.value })}
                  placeholder="R&B, alternative, drill, house..."
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-6">
              <div>
                <FieldLabel step="03" label="CURRENT RELEASE STAGE" required />
                <ChipSelect
                  options={STAGE_OPTIONS}
                  value={data.stage || null}
                  onChange={(v) => setData({ ...data, stage: v })}
                />
              </div>
              <div>
                <FieldLabel step="03" label="BIGGEST BOTTLENECK" required />
                <TextArea
                  required
                  rows={4}
                  value={data.bottleneck}
                  onChange={(e) => setData({ ...data, bottleneck: e.target.value })}
                  placeholder="What's actually blocking you right now?"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-6">
              <div>
                <FieldLabel step="04" label="GOALS (PICK ANY)" />
                <ChipSelect
                  options={GOAL_OPTIONS}
                  value={data.goals}
                  onChange={(v) => toggleGoal(v)}
                  multi
                />
              </div>
              <div className="space-y-0">
                <YesNo
                  label="Need mix / master help?"
                  value={data.needMixMaster}
                  onChange={(v) => setData({ ...data, needMixMaster: v })}
                />
                <YesNo
                  label="Need rollout / marketing help?"
                  value={data.needRollout}
                  onChange={(v) => setData({ ...data, needRollout: v })}
                />
                <YesNo
                  label="Want direct-to-fan monetization help?"
                  value={data.needD2F}
                  onChange={(v) => setData({ ...data, needD2F: v })}
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-6">
              <div>
                <FieldLabel step="05" label="BUDGET RANGE" required />
                <ChipSelect
                  options={BUDGET_OPTIONS}
                  value={data.budget || null}
                  onChange={(v) => setData({ ...data, budget: v })}
                />
              </div>
              <div>
                <FieldLabel step="05" label="ANYTHING ELSE WE SHOULD KNOW" />
                <TextArea
                  rows={4}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="Context, links, timing, etc."
                />
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-border pt-8">
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground sm:w-auto sm:px-12"
              >
                SUBMIT APPLICATION
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50">
                WE REVIEW EVERY APPLICATION. 48-HOUR RESPONSE.
              </p>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}
