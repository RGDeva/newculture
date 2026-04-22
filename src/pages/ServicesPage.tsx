import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  FileAudio,
  Globe,
  Mail,
  Megaphone,
  Music,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, mailtoHref } from "@/lib/config";

// ── Productized Offers (fixed price, buy now) ─────────────────────────────
const PRODUCTIZED_OFFERS = [
  {
    id: "mix",
    icon: FileAudio,
    eyebrow: "PRODUCT",
    name: "AI Mix & Master",
    price: PRICES.mixAnalysis,
    priceLabel: "$" + (PRICES.mixAnalysis / 100).toFixed(0),
    tagline: "Release-ready mix in 48 hours",
    description:
      "Upload your track. RoEx AI engine analyzes frequency balance, dynamics, and stereo imaging — then a professional engineer reviews and delivers a polished final. You keep 100% ownership.",
    features: [
      "RoEx AI spectral analysis & scoring",
      "Professional mastering chain",
      "Human QC review included",
      "One revision included",
      "WAV + MP3 delivery",
      "24–48 hour turnaround",
    ],
    backend: "Powered by RoEx Audio Intelligence",
    cta: { label: "UPLOAD TRACK", to: "/mix", primary: true },
    color: "#22c55e",
  },
  {
    id: "audit",
    icon: Target,
    eyebrow: "STRATEGY SESSION",
    name: "45-Min Growth Audit",
    price: PRICES.auditCall,
    priceLabel: "$" + (PRICES.auditCall / 100).toFixed(0),
    tagline: "One session. Clear direction.",
    description:
      "A focused strategy session backed by Recoupable research intelligence. We analyze your audience, content performance, and competitive landscape — then map a 90-day action plan. Recorded and delivered.",
    features: [
      "Recoupable-powered audience analysis",
      "Content gap & opportunity identification",
      "Release strategy & timeline",
      "Monetization plan (D2F + streaming)",
      "Written follow-up summary",
      "Recording provided",
    ],
    backend: "Powered by Recoupable Research Intelligence",
    cta: { label: "BOOK NOW", to: "/audit-call", primary: true },
    color: "#f59e0b",
  },
  {
    id: "marketing",
    icon: Megaphone,
    eyebrow: "DONE-FOR-YOU",
    name: "Marketing & Ads Package",
    price: PRICES.marketingPackage,
    priceLabel: "$" + (PRICES.marketingPackage / 100).toFixed(0),
    tagline: "We run your campaign end-to-end",
    description:
      "We build and execute targeted ad campaigns using Recoupable audience intelligence. Geo-targeted creative, optimized media buying across Meta, TikTok, and YouTube — operated by our team.",
    features: [
      "Recoupable-powered audience targeting",
      "Geo-targeted video ad creatives",
      "Meta, TikTok, YouTube optimization",
      "$500+ recommended ad spend managed",
      "Weekly performance reports",
      "Live A/B testing & iteration",
    ],
    backend: "Powered by Recoupable Audience Intelligence",
    cta: { label: "START CAMPAIGN", to: "/marketing-package", primary: true },
    color: "#a855f7",
  },
];

// ── Application-Only Offers (high-end, selective) ───────────────────────────
const APPLICATION_OFFERS = [
  {
    id: "strategy",
    eyebrow: "ENGAGEMENT 01",
    name: "Strategy & Blueprint",
    forWho:
      "Artists, producers, or operators who need a comprehensive plan before committing spend. Release, growth, placements, or positioning.",
    outcome:
      "A scoped written roadmap with Recoupable-powered research. Execute yourself — or hand to us.",
    includes: [
      "Recoupable audience & competitive research",
      "60-minute deep-dive strategy audit",
      "Written roadmap with 90-day timelines",
      "Channel mix + budget framework",
      "Content pillar & viral hook recommendations",
      "Handoff document you keep forever",
    ],
    backend: "Recoupable Research + Expert Strategy",
    cta: { label: "Apply", to: "/apply?offer=strategy" },
    color: "#22c55e",
  },
  {
    id: "execution",
    eyebrow: "ENGAGEMENT 02",
    name: "Execution & Growth",
    forWho:
      "Artists and producers with specific projects who want end-to-end operation by our team.",
    outcome:
      "Real outcomes — releases, fans, placements, revenue. Powered by our operating stack.",
    includes: [
      "RoEx-powered mix/master pipeline",
      "Recoupable-informed content & ad strategy",
      "Release operations via ONCE workflow rail",
      "Paid growth retainer (Meta, TikTok, YouTube)",
      "Placement & beat outreach",
      "Direct-to-fan monetization setup",
      "Weekly reporting + operator check-ins",
    ],
    backend: "RoEx + Recoupable + ONCE",
    cta: { label: "Apply", to: "/apply?offer=execution" },
    color: "#f59e0b",
  },
  {
    id: "partnership",
    eyebrow: "ENGAGEMENT 03",
    name: "Development & Partnership",
    forWho:
      "Committed artists, producers, and operators ready for long-term arcs. Full operating stack deployed.",
    outcome:
      "A sustainable operation with repeatable output — built on RoEx, Recoupable, and ONCE infrastructure.",
    includes: [
      "Multi-project A&R + RoEx production pipeline",
      "Recoupable-powered ongoing research",
      "Brand architecture and visual systems",
      "Monthly content + release cadence",
      "ONCE release operations management",
      "Publishing, royalty, and IP management",
      "Direct advisory access",
    ],
    backend: "Full Operating Stack",
    cta: { label: "Apply", to: "/apply?offer=partnership" },
    color: "#a855f7",
  },
];

// ── Components ────────────────────────────────────────────────────────────
function ProductCard({
  offer,
  index,
}: {
  offer: (typeof PRODUCTIZED_OFFERS)[0];
  index: number;
}) {
  const Icon = offer.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col border border-border bg-background"
    >
      <div className="h-0.5 w-full" style={{ background: offer.color }} />
      <div className="flex flex-1 flex-col p-8 md:p-10">
        <div className="mb-6 flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center border"
            style={{ borderColor: offer.color, color: offer.color }}
          >
            <Icon size={18} strokeWidth={1.25} />
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-foreground">
              {offer.priceLabel}
            </p>
            <p className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">
              ONE-TIME
            </p>
          </div>
        </div>

        <p
          className="mb-2 font-mono text-[9px] tracking-[0.3em]"
          style={{ color: offer.color }}
        >
          {offer.eyebrow}
        </p>
        <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground">
          {offer.name}
        </h3>
        <p className="mb-4 font-mono text-xs italic text-muted-foreground/80">
          {offer.tagline}
        </p>
        <p className="mb-6 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {offer.description}
        </p>

        <ul className="mb-6 space-y-2">
          {offer.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check
                size={12}
                className="mt-0.5 flex-shrink-0"
                style={{ color: offer.color }}
              />
              <span className="font-mono text-[11px] text-muted-foreground">
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Backend badge */}
        {offer.backend && (
          <div className="mb-6 border border-border/50 bg-card/20 px-3 py-2">
            <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/50">
              {offer.backend.toUpperCase()}
            </p>
          </div>
        )}

        <div className="mt-auto">
          <Link
            to={offer.cta.to}
            className={`flex w-full items-center justify-center gap-2 py-3 font-mono text-xs tracking-[0.15em] transition-all ${
              offer.cta.primary
                ? "border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground"
                : "border border-border text-foreground hover:border-foreground"
            }`}
          >
            {offer.cta.label} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ApplicationCard({
  offer,
  index,
}: {
  offer: (typeof APPLICATION_OFFERS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative border border-border bg-background"
    >
      <div className="h-0.5 w-full" style={{ background: offer.color }} />
      <div className="grid gap-6 px-8 py-10 md:grid-cols-[1fr_1.3fr] md:gap-10 md:px-12 md:py-14">
        <div>
          <p
            className="mb-3 font-mono text-[9px] tracking-[0.35em]"
            style={{ color: offer.color }}
          >
            {offer.eyebrow}
          </p>
          <h3 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {offer.name}
          </h3>
          <div className="mb-4">
            <p className="mb-1 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60">
              FOR
            </p>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {offer.forWho}
            </p>
          </div>
          <div>
            <p className="mb-1 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60">
              OUTCOME
            </p>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {offer.outcome}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="mb-3 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60">
            INCLUDES
          </p>
          <ul className="mb-6 space-y-2">
            {offer.includes.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight
                  size={10}
                  className="mt-1 flex-shrink-0"
                  style={{ color: offer.color }}
                />
                <span className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {i}
                </span>
              </li>
            ))}
          </ul>
          {/* Backend badge */}
          {offer.backend && (
            <div className="mb-4 border border-border/50 bg-card/20 px-3 py-2">
              <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/50">
                {offer.backend.toUpperCase()}
              </p>
            </div>
          )}
          <div className="mt-auto">
            <Link
              to={offer.cta.to}
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:border-foreground"
            >
              {offer.cta.label} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="border-b border-border px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 font-mono text-[10px] tracking-[0.4em] text-muted-foreground"
            >
              // HOW TO WORK WITH US
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl"
            >
              Two paths.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground"
            >
              Start fast with a productized service, or apply for full-service
              engagement. Powered by RoEx audio intelligence, Recoupable research,
              and ONCE release operations — all behind the scenes.
            </motion.p>
          </div>
        </section>

        {/* Productized Offers */}
        <section className="border-b border-border bg-card/10 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                  // PATH 01 · START NOW
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Productized services.
                </h2>
                <p className="mt-3 max-w-lg font-mono text-sm text-muted-foreground">
                  Fixed price. Immediate start. No application required. Upgrade
                  to deeper engagements anytime.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/free-analysis"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-foreground transition-all hover:border-foreground"
                >
                  <Zap size={12} />
                  OR START FREE →
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {PRODUCTIZED_OFFERS.map((offer, i) => (
                <ProductCard key={offer.id} offer={offer} index={i} />
              ))}
            </div>

            {/* Trust note */}
            <div className="mt-10 border border-border bg-background p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-1 font-mono text-xs font-bold text-foreground">
                    Not sure which to choose?
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Start with the free Track Health Check. We'll analyze your
                    mix and recommend the right path.
                  </p>
                </div>
                <Link
                  to="/free-analysis"
                  className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
                >
                  FREE ANALYSIS <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Application-Only Offers */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // PATH 02 · SELECTIVE ONBOARDING
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Full-service engagements.
              </h2>
              <p className="mt-3 max-w-lg font-mono text-sm text-muted-foreground">
                For artists and operators ready for comprehensive support.
                Application required. Custom-scoped. Higher touch.
              </p>
            </div>

            <div className="space-y-6">
              {APPLICATION_OFFERS.map((offer, i) => (
                <ApplicationCard key={offer.id} offer={offer} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-border bg-card/20 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              // HOW IT WORKS
            </p>
            <h2 className="mb-12 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Four steps to release.
            </h2>
            <div className="grid gap-px bg-border md:grid-cols-4">
              {[
                { n: "01", t: "CHOOSE", d: "Pick a product or apply for full service" },
                { n: "02", t: "INTAKE", d: "Upload track or complete application" },
                { n: "03", t: "EXECUTE", d: "We mix, strategize, or run campaigns" },
                { n: "04", t: "SHIP", d: "Release with assets, plan, and momentum" },
              ].map((step) => (
                <div key={step.n} className="bg-background p-6 md:p-8">
                  <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                    {step.n}
                  </p>
                  <h3 className="mb-2 font-display text-lg font-bold tracking-tight text-foreground">
                    {step.t}
                  </h3>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {step.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="border-t border-border px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // IN FLIGHT
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Current engagements.
              </h2>
              <p className="mt-3 max-w-xl font-mono text-sm text-muted-foreground">
                A snapshot of active client work. Names redacted — full case
                studies shared on strategy calls.
              </p>
            </div>

            <div className="grid gap-px bg-border md:grid-cols-3">
              {[
                {
                  tag: "ARTIST · R&B",
                  offer: "Execution & Growth",
                  stage: "Single rollout · week 6 of 8",
                  metrics: [
                    { k: "Spotify MLS", v: "+312%" },
                    { k: "Paid CPM", v: "$3.10" },
                    { k: "D2F list", v: "4,800+" },
                  ],
                  note: "First release via NewCulture stack. Landed 3 editorial playlists.",
                },
                {
                  tag: "PRODUCER · HIP-HOP",
                  offer: "Development & Partnership",
                  stage: "Quarter 2 of 4",
                  metrics: [
                    { k: "Placements booked", v: "6" },
                    { k: "Beat pack revenue", v: "+$14k" },
                    { k: "Outbound response", v: "22%" },
                  ],
                  note: "Beat-outreach system + first co-pub deal signed.",
                },
                {
                  tag: "ARTIST · ALT/INDIE",
                  offer: "Strategy → Execution",
                  stage: "Album campaign · planning",
                  metrics: [
                    { k: "Blueprint delivered", v: "11 days" },
                    { k: "Budget scoped", v: "$14.5k" },
                    { k: "Upgraded", v: "Yes" },
                  ],
                  note: "Started with Blueprint, converted to full Execution.",
                },
              ].map((c) => (
                <div key={c.tag} className="flex flex-col bg-background p-6 md:p-8">
                  <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">
                    {c.tag}
                  </p>
                  <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-foreground">
                    {c.offer}
                  </p>
                  <p className="mb-4 font-mono text-[11px] text-muted-foreground">
                    {c.stage}
                  </p>
                  <div className="mb-4 space-y-1 border-t border-border pt-3">
                    {c.metrics.map((m) => (
                      <div
                        key={m.k}
                        className="flex items-baseline justify-between font-mono text-[10px]"
                      >
                        <span className="text-muted-foreground/60">{m.k}</span>
                        <span className="text-foreground">{m.v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-auto font-mono text-[11px] italic leading-relaxed text-muted-foreground/70">
                    {c.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Ready to move?
            </h2>
            <p className="mx-auto mb-8 max-w-lg font-mono text-sm leading-relaxed text-muted-foreground">
              Start with a productized service today, or apply for comprehensive
              support. Either way, we review every submission personally.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/free-analysis"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                START FREE <ArrowRight size={14} />
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
              >
                APPLY FOR FULL SERVICE <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
