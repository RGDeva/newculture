import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  FileAudio,
  Megaphone,
  Target,
  Zap,
} from "lucide-react";
import { PRICES } from "@/lib/config";

// Productized offers shown on homepage (fast conversion)
const PRODUCTIZED_OFFERS = [
  {
    id: "free",
    icon: Zap,
    eyebrow: "FREE",
    name: "Track Health Check",
    price: "FREE",
    description: "AI analysis of your mix. Get a report in 10 minutes.",
    cta: { label: "GET FREE ANALYSIS", to: "/free-analysis", primary: false },
  },
  {
    id: "mix",
    icon: FileAudio,
    eyebrow: "$" + (PRICES.mixAnalysis / 100).toFixed(0),
    name: "AI Mix & Master",
    price: "$" + (PRICES.mixAnalysis / 100).toFixed(0),
    description: "Release-ready mix in 48 hours. You keep 100% ownership.",
    cta: { label: "UPLOAD TRACK", to: "/mix", primary: true },
  },
  {
    id: "audit",
    icon: Target,
    eyebrow: "$" + (PRICES.auditCall / 100).toFixed(0),
    name: "Growth Audit Call",
    price: "$" + (PRICES.auditCall / 100).toFixed(0),
    description: "45-min strategy session with a NewCulture operator.",
    cta: { label: "BOOK CALL", to: "/audit-call", primary: true },
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
              // START NOW
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Productized services.
            </h2>
            <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              Fixed price. No application. Start immediately and upgrade to full
              service anytime.
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

        {/* Product cards */}
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {PRODUCTIZED_OFFERS.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-background p-8 transition-colors hover:bg-card md:p-10"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-foreground/20">
                    <Icon size={18} className="text-foreground" />
                  </div>
                  <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground">
                    {offer.eyebrow}
                  </span>
                </div>

                <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground">
                  {offer.name}
                </h3>
                <p className="mb-6 font-mono text-sm leading-relaxed text-muted-foreground">
                  {offer.description}
                </p>

                <div className="mt-auto">
                  <Link
                    to={offer.cta.to}
                    className={`inline-flex items-center gap-2 py-2 font-mono text-[11px] tracking-[0.15em] transition-all ${
                      offer.cta.primary
                        ? "border-b border-foreground text-foreground hover:opacity-70"
                        : "text-muted-foreground underline underline-offset-[4px] hover:text-foreground"
                    }`}
                  >
                    {offer.cta.label} <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cross-sell to full service */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 border border-border bg-card/40 p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 font-mono text-xs font-bold text-foreground">
                Need more than a single service?
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Apply for Strategy & Blueprint, Execution & Growth, or long-term Partnership.
              </p>
            </div>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 self-start border border-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background md:self-center"
            >
              APPLY <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
