import { motion } from "framer-motion";
import { ArrowUpRight, Music2, Radio, Mic2, Zap } from "lucide-react";

const TOOLS = [
  {
    id: "dreamster",
    name: "Dreamster",
    url: "https://dreamster.io/",
    tag: "DIGITAL MUSIC OWNERSHIP",
    description:
      "Dreamster brings true music ownership back to fans and artists. Listen, own, earn, and resell music as Digital Music Assets — a new format that lets you hold music like vinyl, cassette, or CD, backed by blockchain verification.",
    icon: <Music2 size={20} />,
    color: "#a855f7",
    features: ["Digital Music Assets (DMA)", "Own & Resell Music", "Fan Earnings via DSTER", "Artist Direct Monetization"],
  },
  {
    id: "wavi",
    name: "Wavi",
    url: "https://wavi.stream/",
    tag: "COLLABORATIVE MUSIC VAULT",
    description:
      "Wavi is a workspace for music teams to organize audio projects, share them securely, and get paid. Simple checkout and automated splits for beats, sessions, and releases — all in one collaborative vault.",
    icon: <Radio size={20} />,
    color: "#06b6d4",
    features: ["Audio Project Organization", "Secure File Sharing", "Beat & Session Checkout", "Automated Revenue Splits"],
  },
  {
    id: "takerecord",
    name: "Record Financial",
    url: "https://takerecord.com",
    tag: "IP FINANCE & ASSET MANAGEMENT",
    description:
      "Record is the first financial institution focused on intellectual property. Their full product suite includes royalty management, asset-backed lending, brokerage services, and a rightsholder portal — building one of the largest alternative asset classes in the world.",
    icon: <Mic2 size={20} />,
    color: "#f59e0b",
    features: ["Royalty Management", "Asset-Backed Lending", "Music Catalog Brokerage", "Rightsholder Portal"],
  },
  {
    id: "teamrollouts",
    name: "Team Rollouts",
    url: "https://www.teamrollouts.com/",
    tag: "MUSIC RELEASE OS",
    description:
      "The operating system for music releases. AI-powered release planning, team collaboration, and real-time analytics — built for artists, managers, and labels to streamline every rollout from strategy to launch.",
    icon: <Zap size={20} />,
    color: "#22c55e",
    features: ["AI-Powered Release Planning", "Team Collaboration", "Real-Time Analytics", "Label & Manager Workflows"],
  },
];

export function ToolsSection() {
  return (
    <section id="tools" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // PARTNER ECOSYSTEM
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Tools &amp; Platforms
          </h2>
          <p className="mt-4 max-w-lg font-mono text-xs text-muted-foreground">
            Infrastructure we've built and partnered with — purpose-built for artists, producers, and music companies.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col bg-background p-8 transition-colors hover:bg-card"
            >
              {/* Top row */}
              <div className="mb-6 flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center border"
                  style={{ borderColor: tool.color, color: tool.color }}
                >
                  {tool.icon}
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-border px-2.5 py-1 font-mono text-[8px] tracking-[0.2em] text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-foreground hover:text-foreground"
                >
                  VISIT <ArrowUpRight size={9} />
                </a>
              </div>

              {/* Tag */}
              <p className="mb-2 font-mono text-[8px] tracking-[0.3em]" style={{ color: tool.color }}>
                {tool.tag}
              </p>

              {/* Name */}
              <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-foreground">
                {tool.name}
              </h3>

              {/* Description */}
              <p className="mb-6 flex-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {tool.description}
              </p>

              {/* Features */}
              <ul className="space-y-1.5">
                {tool.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
                    <span
                      className="inline-block h-1 w-1 flex-shrink-0 rounded-full"
                      style={{ background: tool.color }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-between border border-border px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground transition-all hover:text-foreground"
                style={{ borderColor: "hsl(var(--border))" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = tool.color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
              >
                <span>EXPLORE {tool.name.toUpperCase()}</span>
                <ArrowUpRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="font-mono text-[9px] text-muted-foreground/50">
            PARTNER INTEGRATIONS — BUILT FOR INDEPENDENT ARTISTS
          </p>
          <a
            href="#join"
            className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            BECOME A PARTNER →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
