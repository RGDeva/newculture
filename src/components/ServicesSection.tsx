import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Rocket, Sparkles } from "lucide-react";

const OFFERS = [
  {
    id: "strategy",
    icon: Compass,
    eyebrow: "01 · STRATEGY & BLUEPRINT",
    name: "Strategy & Blueprint",
    pitch: "A scoped plan for your next move — release, growth, placements, or positioning. Strategy audit + written roadmap + the exact stack to use.",
    outcome: "Execute it yourself, or hand it to us.",
    color: "#22c55e",
    cta: { label: "Apply", to: "/apply?offer=strategy" },
  },
  {
    id: "execution",
    icon: Rocket,
    eyebrow: "02 · EXECUTION & GROWTH",
    name: "Execution & Growth",
    pitch: "Done-for-you operation: release rollouts, paid growth, creative, placements, direct-to-fan — run end-to-end by our team.",
    outcome: "Real outcomes, reported weekly.",
    color: "#f59e0b",
    cta: { label: "Apply", to: "/apply?offer=execution" },
  },
  {
    id: "partnership",
    icon: Sparkles,
    eyebrow: "03 · DEVELOPMENT & PARTNERSHIP",
    name: "Development & Partnership",
    pitch: "Long-term arcs for artists, producers, and operators committed to the work. Roadmap, growth retainer, IP management, advisory.",
    outcome: "A sustainable independent operation.",
    color: "#a855f7",
    cta: { label: "Apply", to: "/apply?offer=partnership" },
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              // HOW WE WORK
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Three ways to work with us.
            </h2>
            <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              Productized engagements for artists, producers, and operators.
              Custom-scoped, budget-based, selective onboarding.
            </p>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 self-start font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] transition-colors hover:text-foreground md:self-end"
          >
            SEE ALL SERVICES
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {OFFERS.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-background p-8 transition-colors hover:bg-card"
              >
                <div className="h-0.5 w-12" style={{ background: offer.color }} />

                <div
                  className="mt-8 mb-6 inline-flex h-11 w-11 items-center justify-center border"
                  style={{ borderColor: offer.color, color: offer.color }}
                >
                  <Icon size={18} strokeWidth={1.25} />
                </div>

                <p
                  className="mb-3 font-mono text-[9px] tracking-[0.3em]"
                  style={{ color: offer.color }}
                >
                  {offer.eyebrow}
                </p>

                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground">
                  {offer.name}
                </h3>

                <p className="mb-5 flex-1 font-mono text-[12px] leading-relaxed text-muted-foreground">
                  {offer.pitch}
                </p>

                <p className="mb-8 font-mono text-[11px] italic leading-relaxed text-foreground">
                  {offer.outcome}
                </p>

                <Link
                  to={offer.cta.to}
                  className="mt-auto flex items-center justify-between border border-border px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-all hover:text-foreground"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = offer.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
                >
                  <span>{offer.cta.label.toUpperCase()}</span>
                  <ArrowRight size={12} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
        >
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/50">
            CUSTOM-SCOPED · BUDGET-BASED · SELECTIVE ONBOARDING
          </p>
          <Link
            to="/apply"
            className="font-mono text-[10px] tracking-[0.25em] text-foreground underline underline-offset-[6px] hover:opacity-70"
          >
            APPLY →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
