import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Schema (Supabase-ready) ───────────────────────────────────────────────
type ReleaseStage =
  | "writing"
  | "recording"
  | "mixing"
  | "mastered-unreleased"
  | "released-no-traction";

type BudgetBand =
  | "under-300"
  | "300-750"
  | "750-1500"
  | "1500-3000"
  | "3000-plus";

const HELP_OPTIONS = [
  "Finish the song (mix / master)",
  "Artwork & creative assets",
  "Distribution",
  "Paid rollout / marketing",
  "Press & playlist",
  "Direct-to-fan monetization",
  "Strategy / blueprint",
] as const;
type HelpNeeded = (typeof HELP_OPTIONS)[number];

const STAGE_OPTIONS: { value: ReleaseStage; label: string }[] = [
  { value: "writing", label: "Writing" },
  { value: "recording", label: "Recording" },
  { value: "mixing", label: "Mixing" },
  { value: "mastered-unreleased", label: "Mastered, unreleased" },
  { value: "released-no-traction", label: "Released, no traction" },
];

const BUDGET_OPTIONS: { value: BudgetBand; label: string }[] = [
  { value: "under-300", label: "Under $300" },
  { value: "300-750", label: "$300 – $750" },
  { value: "750-1500", label: "$750 – $1,500" },
  { value: "1500-3000", label: "$1,500 – $3,000" },
  { value: "3000-plus", label: "$3,000+" },
];

interface ApplicationPayload {
  offer?: string | null;
  fullName: string;
  email: string;
  artistName: string;
  musicLinks: string[];
  releaseStage: ReleaseStage | "";
  helpNeeded: HelpNeeded[];
  targetReleaseDate: string;
  bottleneck: string;
  budget: BudgetBand | "";
  readyThirtyDays: boolean | null;
  notes: string;
  submittedAt: string;
}

type FitTier = "strong" | "mid" | "light";

// ── Scoring / routing logic ───────────────────────────────────────────────
function scoreApplication(a: ApplicationPayload): { score: number; tier: FitTier } {
  let score = 0;

  const budgetScore: Record<BudgetBand, number> = {
    "under-300": 0,
    "300-750": 1,
    "750-1500": 2,
    "1500-3000": 3,
    "3000-plus": 4,
  };
  if (a.budget) score += budgetScore[a.budget];

  if (a.readyThirtyDays === true) score += 1;

  if (
    a.releaseStage === "mixing" ||
    a.releaseStage === "mastered-unreleased" ||
    a.releaseStage === "released-no-traction"
  )
    score += 1;

  let tier: FitTier = "light";
  if (score >= 5) tier = "strong";
  else if (score >= 3) tier = "mid";

  return { score, tier };
}

// ── Primitives ────────────────────────────────────────────────────────────
function StepHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="mb-8 border-l border-foreground pl-4">
      <p className="mb-1 font-mono text-[9px] tracking-[0.35em] text-muted-foreground/70">
        STEP {step}
      </p>
      <p className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {title}
      </p>
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
        {label}
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
  const isSelected = (v: T) =>
    multi ? (Array.isArray(value) ? value.includes(v) : false) : value === v;
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
  value: boolean | null;
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

// ── Success states by tier ────────────────────────────────────────────────
function SuccessStrong({ artistName }: { artistName: string }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Sparkles size={20} className="text-foreground" strokeWidth={1.5} />
        <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
          // STRONG FIT · INVITED TO BOOK
        </p>
      </div>
      <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        {artistName || "You"} — you're a fit.
      </h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-muted-foreground">
        Based on what you shared, we'd like to get on a 30-minute strategy call
        to scope your release. Pick a time that works for you and our team will
        come prepared with a preliminary plan.
      </p>

      <div className="mb-10 border border-foreground bg-foreground/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={14} className="text-foreground" />
          <p className="font-mono text-[10px] tracking-[0.3em] text-foreground">
            BOOK YOUR STRATEGY CALL
          </p>
        </div>
        <p className="mb-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
          30 minutes · Free · With a NewCulture release strategist. We'll review
          your music, bottleneck, and goals, then walk you through how Release
          Execution would work for your specific release.
        </p>
        <a
          href="https://cal.com/newculture/strategy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
        >
          BOOK A STRATEGY CALL <ArrowRight size={14} />
        </a>
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground/70">
        Prefer email? We'll also send you a confirmation and booking link at the
        address you provided.
      </p>
    </div>
  );
}

function SuccessMid({ artistName }: { artistName: string }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <CheckCircle2 size={20} className="text-foreground" strokeWidth={1.5} />
        <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
          // APPLICATION UNDER REVIEW
        </p>
      </div>
      <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        Thanks{artistName ? `, ${artistName}` : ""}. We're reviewing.
      </h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-muted-foreground">
        Your submission is being personally reviewed by our team. Expect a
        response within 48 hours with one of the following:
      </p>
      <ul className="mb-12 space-y-4 border-l border-border pl-6">
        <li className="font-mono text-sm leading-relaxed text-foreground">
          → A booking link for a strategy call, if it's the right moment
        </li>
        <li className="font-mono text-sm leading-relaxed text-foreground">
          → A scoped recommendation tailored to your release stage and budget
        </li>
        <li className="font-mono text-sm leading-relaxed text-foreground">
          → A direct invitation to our Release Blueprint if you're earlier in
          the process
        </li>
      </ul>

      <div className="border border-border bg-card/40 p-6">
        <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
          WHILE YOU WAIT
        </p>
        <p className="mb-4 font-mono text-sm leading-relaxed text-muted-foreground">
          Have a look at the operating stack we use with clients. It's the same
          stack we'd deploy for your release if we take it on.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            EXPLORE OUR STACK <ArrowRight size={12} />
          </Link>
          <Link
            to="/services"
            className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground self-center"
          >
            SEE ALL SERVICES
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuccessLight({ artistName }: { artistName: string }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Compass size={20} className="text-foreground" strokeWidth={1.5} />
        <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
          // WE RECOMMEND A BLUEPRINT FIRST
        </p>
      </div>
      <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        Start with a Release Blueprint.
      </h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-muted-foreground">
        Based on your application, the highest-leverage next step for{" "}
        {artistName ? <span className="text-foreground">{artistName}</span> : "you"}{" "}
        isn't full-service execution yet — it's a scoped plan you can execute
        yourself (or hand to us when you're ready).
      </p>

      <div className="mb-10 border border-foreground bg-foreground/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Compass size={14} className="text-foreground" />
          <p className="font-mono text-[10px] tracking-[0.3em] text-foreground">
            RELEASE BLUEPRINT
          </p>
        </div>
        <p className="mb-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
          A scoped written plan for your next release: strategy audit, 8-week
          rollout calendar, budget framework, and the exact tool + provider
          stack to use. Budget-fit. Built for where you actually are right now.
        </p>
        <ul className="mb-6 space-y-2">
          {[
            "60-minute strategy audit with our team",
            "8-week rollout calendar with channel mix",
            "Tool & provider stack recommendation",
            "Written handoff document",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
              <Check size={12} className="mt-0.5 flex-shrink-0 text-foreground" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
        >
          GET A RELEASE BLUEPRINT <ArrowRight size={14} />
        </Link>
      </div>

      <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
        Still want a full-service review? Reply to our confirmation email with
        more context — budget plans, co-funding, timeline — and we'll take
        another look.
      </p>
      <Link
        to="/tools"
        className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground"
      >
        EXPLORE OUR STACK →
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const [searchParams] = useSearchParams();
  const preselectedOffer = searchParams.get("offer");
  const interest = searchParams.get("interest");

  const [submitted, setSubmitted] = useState<FitTier | null>(null);
  const [data, setData] = useState<ApplicationPayload>({
    offer: preselectedOffer,
    fullName: "",
    email: "",
    artistName: "",
    musicLinks: [""],
    releaseStage: "",
    helpNeeded: [],
    targetReleaseDate: "",
    bottleneck: "",
    budget: "",
    readyThirtyDays: null,
    notes: interest ? `Interested in: ${interest}` : "",
    submittedAt: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [submitted]);

  const toggleHelp = (g: HelpNeeded) => {
    setData((prev) => ({
      ...prev,
      helpNeeded: prev.helpNeeded.includes(g)
        ? prev.helpNeeded.filter((x) => x !== g)
        : [...prev.helpNeeded, g],
    }));
  };

  const setMusicLink = (i: number, v: string) => {
    setData((prev) => ({
      ...prev,
      musicLinks: prev.musicLinks.map((x, idx) => (idx === i ? v : x)),
    }));
  };
  const addMusicLink = () =>
    setData((prev) => ({ ...prev, musicLinks: [...prev.musicLinks, ""] }));
  const removeMusicLink = (i: number) =>
    setData((prev) => ({
      ...prev,
      musicLinks: prev.musicLinks.filter((_, idx) => idx !== i),
    }));

  const isValid = useMemo(() => {
    return (
      data.fullName.trim().length > 0 &&
      data.email.trim().length > 0 &&
      data.artistName.trim().length > 0 &&
      data.musicLinks.some((l) => l.trim().length > 0) &&
      !!data.releaseStage &&
      !!data.budget &&
      data.readyThirtyDays !== null &&
      data.bottleneck.trim().length > 0
    );
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const payload: ApplicationPayload = {
      ...data,
      musicLinks: data.musicLinks.filter((l) => l.trim().length > 0),
      submittedAt: new Date().toISOString(),
    };
    const { tier, score } = scoreApplication(payload);
    // Supabase-ready mock: persist in localStorage for now.
    try {
      const key = "nc_applications";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ ...payload, _tier: tier, _score: score });
      localStorage.setItem(key, JSON.stringify(existing.slice(-500)));
    } catch {}
    setSubmitted(tier);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <section className="border-b border-border px-6 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl"
            >
              {submitted === "strong" && <SuccessStrong artistName={data.artistName} />}
              {submitted === "mid" && <SuccessMid artistName={data.artistName} />}
              {submitted === "light" && <SuccessLight artistName={data.artistName} />}
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
              We take on a limited number of artists each quarter. This intake
              helps us decide if there's a fit. Most artists finish it in under
              three minutes.
            </motion.p>
            {preselectedOffer && (
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
            )}
          </div>
        </section>

        {/* Form */}
        <section className="px-6 py-16">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-20">
            {/* Step 1 — You */}
            <div>
              <StepHeader step="01" title="You" />
              <div className="space-y-6">
                <div>
                  <FieldLabel label="FULL NAME" required />
                  <TextInput
                    required
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    placeholder="First and last"
                  />
                </div>
                <div>
                  <FieldLabel label="EMAIL" required />
                  <TextInput
                    required
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="you@domain.com"
                  />
                </div>
                <div>
                  <FieldLabel label="ARTIST NAME" required />
                  <TextInput
                    required
                    value={data.artistName}
                    onChange={(e) => setData({ ...data, artistName: e.target.value })}
                    placeholder="Your stage name"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 — Music */}
            <div>
              <StepHeader step="02" title="Your music" />
              <div className="space-y-6">
                <div>
                  <FieldLabel label="MUSIC LINKS (SPOTIFY, SOUNDCLOUD, YOUTUBE)" required />
                  <div className="space-y-3">
                    {data.musicLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <TextInput
                          type="url"
                          required={i === 0}
                          value={link}
                          onChange={(e) => setMusicLink(i, e.target.value)}
                          placeholder={i === 0 ? "Primary link" : "Additional link (optional)"}
                        />
                        {data.musicLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMusicLink(i)}
                            className="flex-shrink-0 p-2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Remove link"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {data.musicLinks.length < 3 && (
                      <button
                        type="button"
                        onClick={addMusicLink}
                        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Plus size={11} /> ADD ANOTHER LINK
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 — Where you are */}
            <div>
              <StepHeader step="03" title="Where you are" />
              <div className="space-y-8">
                <div>
                  <FieldLabel label="CURRENT RELEASE STAGE" required />
                  <ChipSelect
                    options={STAGE_OPTIONS}
                    value={data.releaseStage || null}
                    onChange={(v) => setData({ ...data, releaseStage: v })}
                  />
                </div>
                <div>
                  <FieldLabel label="TARGET RELEASE DATE" />
                  <TextInput
                    type="date"
                    value={data.targetReleaseDate}
                    onChange={(e) =>
                      setData({ ...data, targetReleaseDate: e.target.value })
                    }
                  />
                  <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
                    LEAVE BLANK IF NOT YET SCHEDULED
                  </p>
                </div>
                <div>
                  <FieldLabel label="BIGGEST BOTTLENECK" required />
                  <TextArea
                    required
                    rows={4}
                    value={data.bottleneck}
                    onChange={(e) => setData({ ...data, bottleneck: e.target.value })}
                    placeholder="What's actually blocking you right now? Be specific."
                  />
                </div>
              </div>
            </div>

            {/* Step 4 — What you need */}
            <div>
              <StepHeader step="04" title="What you need" />
              <div>
                <FieldLabel label="SELECT ALL THAT APPLY" />
                <ChipSelect
                  options={HELP_OPTIONS}
                  value={data.helpNeeded}
                  onChange={(v) => toggleHelp(v)}
                  multi
                />
              </div>
            </div>

            {/* Step 5 — Budget + timing */}
            <div>
              <StepHeader step="05" title="Budget & timing" />
              <div className="space-y-8">
                <div>
                  <FieldLabel label="BUDGET RANGE FOR THIS RELEASE" required />
                  <ChipSelect
                    options={BUDGET_OPTIONS}
                    value={data.budget || null}
                    onChange={(v) => setData({ ...data, budget: v })}
                  />
                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground/60">
                    Custom-scoped. Selective onboarding. We work across budget levels —
                    but matching you to the right offer depends on being honest here.
                  </p>
                </div>
                <div className="border border-border bg-card/30 p-5">
                  <YesNo
                    label="Ready to move in the next 30 days?"
                    value={data.readyThirtyDays}
                    onChange={(v) => setData({ ...data, readyThirtyDays: v })}
                  />
                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground/60">
                    Be honest. "No" doesn't disqualify you — it just changes what we
                    recommend.
                  </p>
                </div>
                <div>
                  <FieldLabel label="ANYTHING ELSE WE SHOULD KNOW" />
                  <TextArea
                    rows={4}
                    value={data.notes}
                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                    placeholder="Context, co-collaborators, timing nuances, etc."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-border pt-8">
              <button
                type="submit"
                disabled={!isValid}
                className="group inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted-foreground/40 sm:w-auto sm:px-12"
              >
                SUBMIT APPLICATION
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50">
                PERSONALLY REVIEWED · 48-HOUR RESPONSE · SELECTIVE ONBOARDING
              </p>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}
