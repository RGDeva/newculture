import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  DollarSign,
  Globe,
  Megaphone,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, mailtoHref } from "@/lib/config";
import { supabase } from "@/lib/supabase";

const INCLUDES = [
  { icon: Target, title: "CAMPAIGN STRATEGY", desc: "Audience targeting, platform mix, and budget allocation" },
  { icon: Megaphone, title: "AD CREATIVE", desc: "3–5 video assets optimized for Meta, TikTok, YouTube" },
  { icon: TrendingUp, title: "MEDIA BUYING", desc: "$500–$2k+ recommended ad spend managed by us" },
  { icon: Users, title: "REPORTING", desc: "Weekly performance reports with optimization notes" },
];

const PLATFORMS = ["Meta (Instagram/Facebook)", "TikTok", "YouTube", "Spotify Ads"];
const BUDGETS = ["$500–$1k", "$1k–$2k", "$2k–$5k", "$5k+ (custom)"];

interface MarketingForm {
  email: string;
  artistName: string;
  releaseUrl: string;
  platforms: string[];
  budget: string;
  goals: string;
  timeline: string;
  notes: string;
}

export default function MarketingPackagePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<MarketingForm>({
    email: "",
    artistName: "",
    releaseUrl: "",
    platforms: [],
    budget: "",
    goals: "",
    timeline: "",
    notes: "",
  });
  const [step, setStep] = useState<"info" | "strategy" | "review">("info");
  const [submitting, setSubmitting] = useState(false);

  const canProceedInfo =
    form.email.includes("@") && form.artistName && form.releaseUrl;
  const canProceedStrategy =
    form.platforms.length > 0 && form.budget && form.goals && form.timeline;

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      if (supabase) {
        await supabase.from("marketing_packages").insert({
          email: form.email,
          artist_name: form.artistName,
          release_url: form.releaseUrl,
          platforms: form.platforms,
          budget_range: form.budget,
          goals: form.goals,
          timeline: form.timeline,
          notes: form.notes || null,
          price: PRICES.marketingPackage,
          status: "pending_payment",
          created_at: new Date().toISOString(),
        });
      }
      const existing = JSON.parse(
        localStorage.getItem("nc_marketing_packages") || "[]"
      );
      existing.push({ ...form, price: PRICES.marketingPackage, status: "pending_payment" });
      localStorage.setItem("nc_marketing_packages", JSON.stringify(existing));
    } catch {}
    setSubmitting(false);
    navigate("/marketing-package/checkout");
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
                // DONE-FOR-YOU MARKETING
              </p>
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Marketing & Ads Package.
              </h1>
              <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
                We build and run targeted ad campaigns for your release. Creative,
                media buying, and weekly optimization — handled end-to-end. You
                provide the music; we handle the growth.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-background p-6">
                <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                  PACKAGE FEE
                </p>
                <p className="font-display text-3xl font-bold text-foreground">
                  ${(PRICES.marketingPackage / 100).toFixed(0)}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  One-time creative & management fee
                </p>
              </div>
              <div className="bg-background p-6">
                <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                  AD SPEND
                </p>
                <p className="font-display text-3xl font-bold text-foreground">
                  $500+
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  Minimum recommended media budget (separate)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Includes */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {INCLUDES.map((i) => (
                <div key={i.title} className="bg-background p-6">
                  <i.icon size={18} className="mb-4 text-foreground" />
                  <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                    {i.title}
                  </p>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {i.desc}
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
              {["info", "strategy", "review"].map((s, i) => {
                const active = step === s;
                const done =
                  ["strategy", "review"].indexOf(step) >
                  ["info", "strategy", "review"].indexOf(s);
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                    ARTIST / PROJECT NAME *
                  </label>
                  <input
                    required
                    value={form.artistName}
                    onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                    placeholder="How you're known"
                    className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    RELEASE LINK (SPOTIFY / SOUNDCLOUD / YOUTUBE) *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.releaseUrl}
                    onChange={(e) => setForm({ ...form, releaseUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                  <p className="mt-2 font-mono text-[9px] text-muted-foreground/50">
                    The track we'll be promoting
                  </p>
                </div>

                <button
                  onClick={() => canProceedInfo && setStep("strategy")}
                  disabled={!canProceedInfo}
                  className="flex w-full items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                >
                  CONTINUE <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === "strategy" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    TARGET PLATFORMS *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            platforms: form.platforms.includes(p)
                              ? form.platforms.filter((x) => x !== p)
                              : [...form.platforms, p],
                          })
                        }
                        className={`border px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-all ${
                          form.platforms.includes(p)
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    MONTHLY AD BUDGET *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`border px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-all ${
                          form.budget === b
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {b.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    CAMPAIGN GOALS *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.goals}
                    onChange={(e) => setForm({ ...form, goals: e.target.value })}
                    placeholder="Streams, followers, conversions, playlist placements? Be specific."
                    className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    TIMELINE *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["ASAP", "Next 2 weeks", "Next month", "Flexible"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: t })}
                        className={`border px-3 py-2 font-mono text-[10px] tracking-[0.12em] transition-all ${
                          form.timeline === t
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
                    onClick={() => setStep("info")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => canProceedStrategy && setStep("review")}
                    disabled={!canProceedStrategy}
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    REVIEW <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border border-foreground bg-foreground/5 p-6">
                  <h3 className="mb-4 font-display text-lg font-bold text-foreground">
                    Campaign Summary
                  </h3>
                  <div className="space-y-2 font-mono text-[11px] text-muted-foreground">
                    <p>
                      <span className="text-foreground/60">Artist:</span> {form.artistName}
                    </p>
                    <p>
                      <span className="text-foreground/60">Release:</span>{" "}
                      <a href={form.releaseUrl} className="underline hover:text-foreground" target="_blank" rel="noreferrer">
                        {form.releaseUrl.slice(0, 50)}...
                      </a>
                    </p>
                    <p>
                      <span className="text-foreground/60">Platforms:</span>{" "}
                      {form.platforms.join(", ")}
                    </p>
                    <p>
                      <span className="text-foreground/60">Budget:</span> {form.budget}
                    </p>
                    <p>
                      <span className="text-foreground/60">Timeline:</span> {form.timeline}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    ANYTHING ELSE WE SHOULD KNOW?
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Existing assets, brand guidelines, previous campaigns, etc."
                    className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                  />
                </div>

                <div className="flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                      TOTAL
                    </p>
                    <p className="font-display text-4xl font-bold text-foreground">
                      ${(PRICES.marketingPackage / 100).toFixed(0)}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/50">
                      + ad spend (paid to platforms directly)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("strategy")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    {submitting ? "PROCESSING…" : "PROCEED TO PAYMENT"}
                    {!submitting && <ArrowRight size={14} />}
                  </button>
                </div>

                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/50">
                  After payment, you'll be invited to a project dashboard where
                  we collaborate on creative and launch timeline. Questions?{" "}
                  <a href={mailtoHref} className="underline hover:text-foreground">
                    Email us
                  </a>
                  .
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
