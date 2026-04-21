import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Compass, Rocket, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type Offer = {
  id: string;
  eyebrow: string;
  name: string;
  icon: typeof Compass;
  forWho: string;
  outcome: string;
  includes: string[];
  cta: { label: string; to: string };
  color: string;
};

const OFFERS: Offer[] = [
  {
    id: "blueprint",
    eyebrow: "OFFER 01",
    name: "Release Blueprint",
    icon: Compass,
    forWho:
      "Artists 2–6 weeks out from a release who need a plan, not a vendor.",
    outcome:
      "A release you can actually execute — or hand to us. Budget-based, scoped to your goals.",
    includes: [
      "60-minute strategy audit with our team",
      "8-week rollout calendar with channel mix",
      "Paid media budget framework",
      "Tool & provider stack recommendation",
      "Mix / master direction and provider match",
      "Written handoff document you keep",
    ],
    cta: { label: "Get a Release Blueprint", to: "/apply?offer=blueprint" },
    color: "#22c55e",
  },
  {
    id: "execution",
    eyebrow: "OFFER 02",
    name: "Release Execution",
    icon: Rocket,
    forWho:
      "Artists with a song ready to launch who want it run professionally end-to-end.",
    outcome:
      "A real release that reaches real fans and produces real cashflow. We run the rollout.",
    includes: [
      "Mix & master (RoEx + curated engineers)",
      "Full creative asset package",
      "Distribution setup and DSP pitching",
      "Paid rollout (Meta, TikTok, YouTube)",
      "Press & playlist seeding",
      "Direct-to-fan monetization (Wavi / Dreamster)",
      "Week-by-week reporting",
    ],
    cta: { label: "Apply for Release Support", to: "/apply?offer=execution" },
    color: "#f59e0b",
  },
  {
    id: "development",
    eyebrow: "OFFER 03",
    name: "Artist Development",
    icon: Sparkles,
    forWho:
      "Artists committing to a 6–12 month arc. Selective. Not for everyone.",
    outcome:
      "A sustainable independent operation with repeatable releases and real income.",
    includes: [
      "Multi-release roadmap and A&R",
      "Brand architecture and visual direction",
      "Monthly content system",
      "Paid growth retainer",
      "Royalty and IP management (Record Financial)",
      "Direct advisory access to our team",
    ],
    cta: { label: "Talk to NewCulture", to: "/apply?offer=development" },
    color: "#a855f7",
  },
];

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const Icon = offer.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative border border-border bg-background"
    >
      <div className="h-0.5 w-full" style={{ background: offer.color }} />
      <div className="grid gap-8 px-8 py-12 md:grid-cols-[1fr_1.4fr] md:gap-12 md:px-14 md:py-16">
        {/* Left: name + who */}
        <div>
          <p
            className="mb-4 font-mono text-[9px] tracking-[0.35em]"
            style={{ color: offer.color }}
          >
            {offer.eyebrow}
          </p>
          <div
            className="mb-6 inline-flex h-11 w-11 items-center justify-center border"
            style={{ borderColor: offer.color, color: offer.color }}
          >
            <Icon size={18} strokeWidth={1.25} />
          </div>
          <h2 className="mb-5 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {offer.name}
          </h2>
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
            FOR
          </p>
          <p className="mb-8 max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">
            {offer.forWho}
          </p>
          <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
            OUTCOME
          </p>
          <p className="max-w-sm font-mono text-sm italic leading-relaxed text-foreground">
            {offer.outcome}
          </p>
        </div>

        {/* Right: includes + CTA */}
        <div>
          <p className="mb-6 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
            WHAT'S INCLUDED
          </p>
          <ul className="mb-10 space-y-3">
            {offer.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-mono text-sm leading-relaxed text-foreground"
              >
                <Check
                  size={14}
                  strokeWidth={2}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: offer.color }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-6">
            <p className="mb-5 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60">
              CUSTOM-SCOPED · BUDGET-BASED · SELECTIVE ONBOARDING
            </p>
            <Link
              to={offer.cta.to}
              className="group inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
            >
              {offer.cta.label.toUpperCase()}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="border-b border-border bg-background px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 font-mono text-[10px] tracking-[0.4em] text-muted-foreground"
            >
              // SELECTIVE ONBOARDING
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl"
            >
              Three ways to work with us.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground"
            >
              NewCulture runs release-stage support for independent artists.
              Finish the song, package the rollout, run the traffic, and build
              the fan economy — with operators, not another platform.
            </motion.p>
          </div>
        </section>

        {/* Offers */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-8">
            {OFFERS.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        </section>

        {/* How we work */}
        <section className="border-t border-border bg-card/20 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              // HOW WE WORK
            </p>
            <h2 className="mb-16 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Four-step intake.
            </h2>
            <div className="grid gap-px bg-border md:grid-cols-4">
              {[
                { n: "01", t: "APPLY", d: "30-second intake. Tell us where you are and what you need." },
                { n: "02", t: "SCOPE", d: "We review, then send a release scope or book a call." },
                { n: "03", t: "BUILD", d: "Assets, mix, rollout plan, budget — operated by us." },
                { n: "04", t: "LAUNCH", d: "We run the release, report weekly, and optimize live." },
              ].map((step) => (
                <div key={step.n} className="bg-background p-8">
                  <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                    {step.n}
                  </p>
                  <h3 className="mb-3 font-display text-lg font-bold tracking-tight text-foreground">
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

        {/* Final CTA */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Ready to run your next release properly?
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              We take on a limited number of artists each quarter. If that's you,
              start with a short application.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
              >
                APPLY FOR RELEASE SUPPORT <ArrowRight size={14} />
              </Link>
              <Link
                to="/tools"
                className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground"
              >
                EXPLORE OUR OPERATING STACK →
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
