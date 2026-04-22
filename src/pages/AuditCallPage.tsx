import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mic,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, CAL_STRATEGY_URL, mailtoHref } from "@/lib/config";
import { supabase } from "@/lib/supabase";

const DELIVERABLES = [
  {
    icon: Target,
    title: "POSITIONING AUDIT",
    desc: "Where you are vs. where you should be in your niche",
  },
  {
    icon: Mic,
    title: "RELEASE STRATEGY",
    desc: "Timeline, platforms, and rollout sequencing",
  },
  {
    icon: TrendingUp,
    title: "MONETIZATION PLAN",
    desc: "Direct-to-fan, streaming, and ancillary revenue",
  },
  {
    icon: Zap,
    title: "VIRALITY TACTICS",
    desc: "Content hooks, ad strategy, and playlist approach",
  },
];

const WHO_FOR = [
  "Artists preparing a major release",
  "Producers building a placement pipeline",
  "Managers structuring artist operations",
  "Anyone stuck on growth plateau",
];

interface AuditForm {
  email: string;
  name: string;
  artistName: string;
  role: string;
  focus: string[];
  currentChallenge: string;
  goals: string;
  datePreference: string;
}

const FOCUS_OPTIONS = [
  "Release strategy",
  "Marketing & growth",
  "Monetization",
  "Creative direction",
  "Team building",
  "Distribution & DSPs",
];

export default function AuditCallPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AuditForm>({
    email: "",
    name: "",
    artistName: "",
    role: "",
    focus: [],
    currentChallenge: "",
    goals: "",
    datePreference: "",
  });
  const [step, setStep] = useState<"info" | "focus" | "schedule">("info");
  const [submitting, setSubmitting] = useState(false);

  const canProceedInfo =
    form.email.includes("@") && form.name && form.artistName && form.role;
  const canProceedFocus = form.focus.length > 0 && form.currentChallenge;

  const handleBook = async () => {
    setSubmitting(true);
    // Store booking intent
    try {
      if (supabase) {
        await supabase.from("audit_bookings").insert({
          email: form.email,
          name: form.name,
          artist_name: form.artistName,
          role: form.role,
          focus_areas: form.focus,
          challenge: form.currentChallenge,
          goals: form.goals || null,
          date_preference: form.datePreference || null,
          price: PRICES.auditCall,
          status: "pending_payment",
          created_at: new Date().toISOString(),
        });
      }
      const existing = JSON.parse(localStorage.getItem("nc_audit_bookings") || "[]");
      existing.push({ ...form, price: PRICES.auditCall, status: "pending_payment" });
      localStorage.setItem("nc_audit_bookings", JSON.stringify(existing));
    } catch {}
    setSubmitting(false);
    navigate("/audit-call/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="border-b border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-4 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // STRATEGY SESSION
              </p>
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                45-Minute Growth Audit.
              </h1>
              <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
                A focused strategy session with a NewCulture operator. We audit
                your current position, identify the biggest growth lever, and map
                a 90-day action plan. Recorded. Actionable. No pitch.
              </p>
            </motion.div>

            {/* Price strip */}
            <div className="mt-10 flex items-center justify-between border border-foreground bg-foreground px-6 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-background/60">
                  ONE-TIME SESSION
                </p>
                <p className="font-display text-3xl font-bold text-background">
                  ${(PRICES.auditCall / 100).toFixed(0)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-background/80">
                  <Clock size={12} />
                  <span className="font-mono text-xs">45 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-background/80">
                  <Calendar size={12} />
                  <span className="font-mono text-xs">Recorded & delivered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="bg-background p-6">
                  <d.icon size={18} className="mb-4 text-foreground" />
                  <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                    {d.title}
                  </p>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {d.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            {/* Progress */}
            <div className="mb-10 flex items-center gap-2">
              {["info", "focus", "schedule"].map((s, i) => {
                const active = step === s;
                const done =
                  ["focus", "schedule"].indexOf(step) >
                  ["info", "focus", "schedule"].indexOf(s);
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center border font-mono text-[9px] ${
                        active || done
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <Check size={10} /> : `0${i + 1}`}
                    </div>
                    <span
                      className={`font-mono text-[9px] tracking-[0.15em] ${
                        active ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {s.toUpperCase()}
                    </span>
                    {i < 2 && (
                      <ChevronRight size={10} className="text-muted-foreground/30" />
                    )}
                  </div>
                );
              })}
            </div>

            {step === "info" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    YOUR NAME *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    ARTIST / PROJECT NAME *
                  </label>
                  <input
                    required
                    value={form.artistName}
                    onChange={(e) =>
                      setForm({ ...form, artistName: e.target.value })
                    }
                    placeholder="How you're known in the industry"
                    className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    ROLE *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Artist", "Producer", "Manager", "Engineer", "Other"].map(
                      (r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm({ ...form, role: r })}
                          className={`border px-3 py-2 font-mono text-[10px] tracking-[0.15em] transition-all ${
                            form.role === r
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >
                          {r.toUpperCase()}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={() => canProceedInfo && setStep("focus")}
                  disabled={!canProceedInfo}
                  className="flex w-full items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                >
                  CONTINUE <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === "focus" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    WHAT DO YOU WANT TO FOCUS ON? *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_OPTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            focus: form.focus.includes(f)
                              ? form.focus.filter((x) => x !== f)
                              : [...form.focus, f],
                          })
                        }
                        className={`border px-3 py-2 font-mono text-[10px] tracking-[0.15em] transition-all ${
                          form.focus.includes(f)
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    BIGGEST CHALLENGE RIGHT NOW *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.currentChallenge}
                    onChange={(e) =>
                      setForm({ ...form, currentChallenge: e.target.value })
                    }
                    placeholder="Be specific: 'I have 50k streams but can't convert to fans', 'My mixes sound amateur', etc."
                    className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    90-DAY GOALS (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={form.goals}
                    onChange={(e) => setForm({ ...form, goals: e.target.value })}
                    placeholder="What would make this quarter a win?"
                    className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("info")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => canProceedFocus && setStep("schedule")}
                    disabled={!canProceedFocus}
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    CONTINUE <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "schedule" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="border border-foreground bg-foreground/5 p-6">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">
                    Session Summary
                  </h3>
                  <div className="space-y-2 font-mono text-[11px] text-muted-foreground">
                    <p>
                      <span className="text-foreground/60">Name:</span> {form.name}
                    </p>
                    <p>
                      <span className="text-foreground/60">Artist:</span>{" "}
                      {form.artistName}
                    </p>
                    <p>
                      <span className="text-foreground/60">Role:</span> {form.role}
                    </p>
                    <p>
                      <span className="text-foreground/60">Focus:</span>{" "}
                      {form.focus.join(", ")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    PREFERRED TIMING (OPTIONAL)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Morning (9am–12pm ET)",
                      "Afternoon (12pm–5pm ET)",
                      "Evening (5pm–8pm ET)",
                      "Flexible",
                    ].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, datePreference: t })}
                        className={`border px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-all ${
                          form.datePreference === t
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("focus")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    {submitting ? "PROCESSING…" : "PROCEED TO PAYMENT"}
                    {!submitting && <ArrowRight size={14} />}
                  </button>
                </div>

                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/50">
                  You'll be redirected to Stripe to complete payment, then to our
                  scheduling calendar to book your slot. If you can't find a time
                  that works,{" "}
                  <a href={mailtoHref} className="underline hover:text-foreground">
                    email us
                  </a>{" "}
                  and we'll accommodate.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Who is this for */}
        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
              // WHO THIS IS FOR
            </p>
            <div className="space-y-3">
              {WHO_FOR.map((w) => (
                <div key={w} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-foreground" />
                  <p className="font-mono text-sm text-muted-foreground">{w}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border border-border bg-card/40 p-6">
              <p className="mb-4 font-mono text-xs text-muted-foreground">
                Not ready for a paid session? Start with our free Track Health
                Check or grab a quick Mix & Master first.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/free-analysis"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:border-foreground"
                >
                  FREE ANALYSIS <ArrowRight size={12} />
                </Link>
                <Link
                  to="/mix"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:border-foreground"
                >
                  MIX & MASTER <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
