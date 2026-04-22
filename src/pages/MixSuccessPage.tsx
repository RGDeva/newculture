import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Check, Download, Mail, Music, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, mailtoHref } from "@/lib/config";

const UPSELLS = [
  {
    id: "audit",
    icon: Calendar,
    title: "45-Minute Growth Audit",
    price: `$${(PRICES.auditCall / 100).toFixed(0)}`,
    desc: "Strategy session to plan your release, marketing, and monetization.",
    cta: "Book Now",
    to: "/audit-call",
    highlight: true,
  },
  {
    id: "marketing",
    icon: Star,
    title: "Marketing & Ads Package",
    price: `$${(PRICES.marketingPackage / 100).toFixed(0)}`,
    desc: "We run targeted campaigns for your release across Meta, TikTok, and YouTube.",
    cta: "Learn More",
    to: "/marketing-package",
    highlight: false,
  },
];

export default function MixSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="border-b border-border px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex h-16 w-16 items-center justify-center border border-foreground bg-foreground text-background"
            >
              <Check size={28} strokeWidth={1.5} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl"
            >
              Order confirmed.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-8 max-w-md font-mono text-sm leading-relaxed text-muted-foreground"
            >
              Your track is queued for analysis. You'll receive a confirmation
              email shortly with your order details and a link to check status.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12 flex flex-col items-center gap-3 font-mono text-[11px] text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Music size={12} />
                <span>Mix + Master + Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Download size={12} />
                <span>Delivery: 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} />
                <span>Updates sent to your email</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
              >
                BACK TO HOME <ArrowRight size={14} />
              </Link>
              <a
                href={mailtoHref}
                className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground"
              >
                NEED HELP? GET IN TOUCH →
              </a>
            </motion.div>
          </div>
        </section>

        {/* Upsells */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // NEXT STEPS
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Maximize this release.
              </h2>
              <p className="mt-3 font-mono text-sm text-muted-foreground">
                Your mix is being processed. Here's how to make sure it gets heard.
              </p>
            </div>

            <div className="grid gap-px bg-border md:grid-cols-2">
              {UPSELLS.map((u) => (
                <div
                  key={u.id}
                  className={`flex flex-col bg-background p-8 ${
                    u.highlight ? "relative" : ""
                  }`}
                >
                  {u.highlight && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-foreground" />
                  )}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center border border-foreground/20">
                      <u.icon size={16} className="text-foreground" />
                    </div>
                    <span className="font-display text-2xl font-bold text-foreground">
                      {u.price}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-foreground">
                    {u.title}
                  </h3>
                  <p className="mb-6 flex-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {u.desc}
                  </p>
                  <Link
                    to={u.to}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] transition-all ${
                      u.highlight
                        ? "border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground"
                        : "border border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {u.cta} <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 border border-border bg-card/40 p-6 text-center">
              <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60">
                OR
              </p>
              <p className="mb-4 font-mono text-sm text-muted-foreground">
                Ready for full-service support? Apply to work with us on strategy,
                execution, or long-term development.
              </p>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 font-mono text-xs tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
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
