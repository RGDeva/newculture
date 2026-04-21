import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import { MorphingText } from "@/components/ui/morphing-text";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { mailtoHref } from "@/lib/config";

const MORPHING_WORDS = [
  "NEXT RELEASE",
  "GROWTH ENGINE",
  "FAN ECONOMY",
  "CREATIVE BUSINESS",
  "PLACEMENT PIPELINE",
];

const PARTNER_STACK = [
  "ROEX",
  "WAVI",
  "DREAMSTER",
  "TEAM ROLLOUTS",
  "RECORD FINANCIAL",
  "RELATIONL",
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Globe background — centered, faded */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          className="w-[700px] max-w-[90vw]"
        >
          <GlobePulse speed={0.002} />
        </motion.div>
      </div>

      {/* Radial overlay to darken edges */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,black_80%)]" />

      {/* Scanline overlay */}
      <div className="scanline pointer-events-none absolute inset-0 z-[2]" />

      {/* Main content */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-[11px] tracking-[0.4em] text-muted-foreground"
        >
NEWCULTURE · MUSIC GROWTH & ARTIST DEVELOPMENT
        </motion.p>

        {/* Static heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-glow mb-2 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          WE RUN YOUR
        </motion.h1>

        {/* Morphing text line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mb-8"
        >
          <MorphingText
            texts={MORPHING_WORDS}
            className="h-14 font-display text-3xl font-light italic text-foreground md:h-20 md:text-5xl lg:h-24 lg:text-[5rem]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mx-auto mb-12 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
Selective consulting + execution for artists, producers, and creative operators.
          Strategy, growth, release, and long-term development — where there's fit.
          Built around real outcomes, not retainers.
        </motion.p>

        {/* Liquid metal CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Link to="/apply">
            <LiquidMetalButton label="Apply" />
          </Link>
<a href={mailtoHref}>
            <LiquidMetalButton label="Get in touch" />
          </a>
        </motion.div>

        {/* Secondary text CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.8 }}
          className="mt-6"
        >
          <Link
            to="/services"
            className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70 underline underline-offset-[6px] transition-colors hover:text-foreground"
          >
            HOW WE WORK →
          </Link>
        </motion.div>

        {/* Partner stack strip — real social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="font-mono text-[9px] tracking-[0.35em] text-muted-foreground/50">
            — POWERED BY OUR OPERATING STACK —
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PARTNER_STACK.map((p) => (
              <span
                key={p}
                className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/80"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* HUD coordinates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50"
        >
          SELECTIVE ONBOARDING · NEWCULTURE · {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
