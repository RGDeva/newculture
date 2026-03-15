import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ShaderBackground } from "./ShaderHero";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ShaderBackground />

      {/* Scanline overlay */}
      <div className="scanline pointer-events-none absolute inset-0 z-10" />

      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-[11px] tracking-[0.4em] text-muted-foreground"
        >
          NEXT-GENERATION ARTIST INCUBATOR
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-glow mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          BUILD THE
          <br />
          <span className="font-light italic">NEW CULTURE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mb-12 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          A curated network connecting emerging artists, producers, and industry
          infrastructure. Your launchpad into the future of music.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#artists"
            className="group flex items-center gap-3 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground"
          >
            EXPLORE ARTISTS
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#join"
            className="flex items-center gap-3 border border-border px-8 py-3 font-mono text-xs tracking-[0.15em] text-foreground transition-all hover:border-foreground"
          >
            JOIN NETWORK
          </a>
        </motion.div>

        {/* HUD coordinates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50"
        >
          SYS.ONLINE — v2.0.26 — {new Date().getFullYear()}
        </motion.div>
      </div>
    </section>
  );
}
