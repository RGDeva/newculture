import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileAudio,
  Lock,
  Mail,
  Music,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, mailtoHref } from "@/lib/config";
import { supabase } from "@/lib/supabase";

const BENEFITS = [
  {
    icon: Zap,
    title: "LIVE AUDIENCE DATA",
    desc: "Real-time follower counts, growth rate, and geographic concentration",
  },
  {
    icon: Music,
    title: "COMPETITIVE POSITION",
    desc: "Where you stand vs. similar artists in your niche",
  },
  {
    icon: Search,
    title: "GROWTH PROJECTION",
    desc: "Current trajectory vs. optimized potential with action plan",
  },
  {
    icon: Lock,
    title: "VIRAL POTENTIAL SCORE",
    desc: "Content performance analysis and viral opportunity detection",
  },
];

export default function FreeAnalysisPage() {
  const [email, setEmail] = useState("");
  const [artistName, setArtistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !artistName || !trackUrl) return;

    setSubmitting(true);
    try {
      if (supabase) {
        await supabase.from("free_analyses").insert({
          email,
          artist_name: artistName,
          track_url: trackUrl,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      }
      const existing = JSON.parse(localStorage.getItem("nc_free_analyses") || "[]");
      existing.push({ email, artistName, trackUrl, createdAt: new Date().toISOString() });
      localStorage.setItem("nc_free_analyses", JSON.stringify(existing));
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {!submitted ? (
          <>
            {/* Header */}
            <section className="border-b border-border px-6 py-16">
              <div className="mx-auto max-w-3xl text-center">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="mb-4 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                    // LIVE INTELLIGENCE REPORT
                  </p>
                  <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                    Free Audience Intelligence.
                  </h1>
                  <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
                    Get a real-time breakdown of your competitive position, 
                    audience trajectory, and growth opportunities. Powered by 
                    our proprietary Recoupable intelligence engine — delivered 
                    in 2 minutes, not 2 weeks.
                  </p>
                </motion.div>

                {/* Benefits */}
                <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  {BENEFITS.map((b) => (
                    <div key={b.title} className="bg-background p-5">
                      <b.icon size={16} className="mb-3 text-foreground" />
                      <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                        {b.title}
                      </p>
                      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Form */}
            <section className="px-6 py-16">
              <div className="mx-auto max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Where we send your report"
                      className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                      ARTIST / PROJECT NAME *
                    </label>
                    <input
                      required
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="How you're known"
                      className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                      TRACK LINK (SOUNDCLOUD / DROPBOX / GOOGLE DRIVE) *
                    </label>
                    <input
                      type="url"
                      required
                      value={trackUrl}
                      onChange={(e) => setTrackUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground"
                    />
                    <p className="mt-2 font-mono text-[9px] text-muted-foreground/50">
                      Or email files directly to{" "}
                      <a href={mailtoHref} className="underline hover:text-foreground">
                        {mailtoHref.replace("mailto:", "")}
                      </a>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !email.includes("@") || !artistName || !trackUrl}
                    className="flex w-full items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    {submitting ? "SENDING…" : "GET FREE ANALYSIS"}
                    {!submitting && <ArrowRight size={14} />}
                  </button>

                  <p className="text-center font-mono text-[10px] tracking-[0.2em] text-muted-foreground/40">
                    NO SPAM. UNSUBSCRIBE ANYTIME. REPORT DELIVERED IN ~10 MIN.
                  </p>
                </form>
              </div>
            </section>
          </>
        ) : (
          /* Success + Upsells */
          <section className="px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 inline-flex h-16 w-16 items-center justify-center border border-foreground bg-foreground text-background"
              >
                <Check size={28} strokeWidth={1.5} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground"
              >
                Analysis queued.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-6 max-w-md font-mono text-sm leading-relaxed text-muted-foreground"
              >
                Check your email ({email}) in the next 10 minutes for your
                Track Health Check report. If you don't see it, check spam or{" "}
                <a href={mailtoHref} className="underline hover:text-foreground">
                  contact us
                </a>
                .
              </motion.p>

              {/* Blueprint Preview */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-12 border border-amber-500/20 bg-amber-500/5 p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Search size={14} className="text-amber-500" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-amber-500">
                    RECOUPABLE BLUEPRINT PREVIEW
                  </span>
                </div>
                <p className="mb-3 font-mono text-sm text-foreground">
                  Included in your report:
                </p>
                <ul className="mb-4 space-y-2 text-left">
                  <li className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
                    <Target size={10} className="mt-1 text-amber-500" />
                    <span>Content pillar recommendations for your genre</span>
                  </li>
                  <li className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
                    <Target size={10} className="mt-1 text-amber-500" />
                    <span>Viral hook opportunities based on trending patterns</span>
                  </li>
                  <li className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
                    <Target size={10} className="mt-1 text-amber-500" />
                    <span>Platform prioritization suggestions</span>
                  </li>
                </ul>
                <p className="font-mono text-[10px] text-muted-foreground/60">
                  Full research-backed blueprint available with Growth Audit →
                </p>
              </motion.div>

              {/* Upsells */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                  // READY TO GO FURTHER?
                </p>
                <div className="grid gap-px bg-border sm:grid-cols-2">
                  <div className="bg-background p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <FileAudio size={14} className="text-foreground" />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        MIX & MASTER
                      </span>
                    </div>
                    <p className="mb-2 font-display text-2xl font-bold text-foreground">
                      ${(PRICES.mixAnalysis / 100).toFixed(0)}
                    </p>
                    <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                      Professional AI mix + human QC. Release-ready in 48 hours.
                    </p>
                    <Link
                      to="/mix"
                      className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 font-mono text-[11px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
                    >
                      ORDER NOW <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="bg-background p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Mail size={14} className="text-foreground" />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        STRATEGY CALL
                      </span>
                    </div>
                    <p className="mb-2 font-display text-2xl font-bold text-foreground">
                      ${(PRICES.auditCall / 100).toFixed(0)}
                    </p>
                    <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                      45-minute audit with a NewCulture strategist. Custom 90-day plan.
                    </p>
                    <Link
                      to="/audit-call"
                      className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:border-foreground"
                    >
                      BOOK CALL <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/"
                  className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground"
                >
                  BACK TO HOME →
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
