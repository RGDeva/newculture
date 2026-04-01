import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ShaderBackground } from "./ShaderHero";
import { GlowCard } from "@/components/ui/spotlight-card";
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

      {/* Floating GlowCard accents — background decoration */}
      <div className="pointer-events-none absolute inset-0 z-[11] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="absolute -left-12 top-[15%] rotate-[-8deg]"
        >
          <GlowCard glowColor="purple" size="sm" className="opacity-40">
            <div />
          </GlowCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.12, x: 0 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute -right-8 top-[25%] rotate-[6deg]"
        >
          <GlowCard glowColor="blue" size="sm" className="opacity-40">
            <div />
          </GlowCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ delay: 1.8, duration: 2 }}
          className="absolute bottom-[8%] left-[8%] rotate-[4deg]"
        >
          <GlowCard glowColor="green" size="sm" className="opacity-30">
            <div />
          </GlowCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ delay: 2.0, duration: 2 }}
          className="absolute bottom-[12%] right-[10%] rotate-[-5deg]"
        >
          <GlowCard glowColor="orange" size="sm" className="opacity-30">
            <div />
          </GlowCard>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-[11px] tracking-[0.4em] text-muted-foreground"
        >
          THE MUSIC OPERATING SYSTEM
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-glow mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          BUILD YOUR
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text font-light italic text-transparent">
            MUSIC CAREER
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mb-12 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          The infrastructure layer for music. Discover collaborators, integrate AI-powered tools,
          and access real opportunities — one unified platform for artists, producers, engineers, and labels.
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
            href="/tools"
            className="flex items-center gap-3 border border-border px-8 py-3 font-mono text-xs tracking-[0.15em] text-foreground transition-all hover:border-foreground"
          >
            BROWSE TOOLS
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
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50"
        >
          SYS.ONLINE — v3.0 — {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
