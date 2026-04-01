import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ShaderBackground } from "./ShaderHero";
import logoDark from "@/assets/logo-dark.png";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ShaderBackground />

      {/* Scanline overlay */}
      <div className="scanline pointer-events-none absolute inset-0 z-10" />

      {/* Logo watermark — top right background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.4 }}
        className="pointer-events-none absolute right-[-8%] top-[-10%] z-10 select-none"
      >
        <img
          src={logoDark}
          alt=""
          className="h-[480px] w-[480px] object-contain opacity-[0.06]"
          style={{ filter: "invert(1)" }}
        />
      </motion.div>

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-[11px] tracking-[0.4em] text-muted-foreground"
        >
          MUSIC OPERATING SYSTEM
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-glow mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          THE OS FOR
          <br />
          <span className="font-light italic">MUSIC CAREERS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mb-12 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          Discover collaborators, use the right tools, and access real opportunities — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/network"
            className="group flex items-center gap-3 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground"
          >
            EXPLORE NETWORK
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/opportunities"
            className="flex items-center gap-3 border border-border px-8 py-3 font-mono text-xs tracking-[0.15em] text-foreground transition-all hover:border-foreground"
          >
            VIEW OPPORTUNITIES
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { value: "2,400+", label: "CREATORS" },
            { value: "48", label: "STATES" },
            { value: "120+", label: "STUDIOS" },
            { value: "∞", label: "OPPORTUNITIES" },
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
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50"
        >
          SYS.ONLINE — v3.0 — {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
