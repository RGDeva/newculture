import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import { MorphingText } from "@/components/ui/morphing-text";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import logoDark from "@/assets/logo-dark.png";

const MORPHING_WORDS = [
  "MUSIC CAREER",
  "CREATIVE EMPIRE",
  "NEXT RELEASE",
  "ARTIST NETWORK",
  "SOUND LEGACY",
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
          THE MUSIC OPERATING SYSTEM
        </motion.p>

        {/* Static heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-glow mb-2 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          BUILD YOUR
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
          className="mx-auto mb-12 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          The infrastructure layer for music. Discover collaborators, integrate AI-powered tools,
          and access real opportunities — one unified platform.
        </motion.p>

        {/* Liquid metal CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Link to="/network">
            <LiquidMetalButton label="Explore Network" />
          </Link>
          <Link to="/tools">
            <LiquidMetalButton label="Browse Tools" />
          </Link>
          <Link to="/opportunities">
            <LiquidMetalButton viewMode="icon" />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { value: "2,400+", label: "CREATORS" },
            { value: "48", label: "STATES" },
            { value: "120+", label: "STUDIOS" },
            { value: "8+", label: "INTEGRATED TOOLS" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* HUD coordinates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50"
        >
          SYS.ONLINE — v3.0 — {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
