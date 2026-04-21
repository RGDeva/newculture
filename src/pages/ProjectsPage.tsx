import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Circle,
  CircleDot,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Mock data (Supabase-ready schema) ─────────────────────────────────────
type PhaseStatus = "done" | "active" | "upcoming";

interface Phase {
  id: string;
  label: string;
  status: PhaseStatus;
  note?: string;
}

interface Deliverable {
  id: string;
  name: string;
  status: "delivered" | "in-progress" | "queued";
  provider?: string;
}

interface MockProject {
  id: string;
  release: string;
  artist: string;
  tier: "Release Execution" | "Release Blueprint" | "Artist Development";
  targetDate: string;
  progress: number;
  phases: Phase[];
  deliverables: Deliverable[];
  nextSteps: string[];
  monetization: { label: string; url: string; status: "live" | "setup" }[];
}

const MOCK: MockProject = {
  id: "rel-001",
  release: "MIDNIGHT FAULTLINE",
  artist: "Kael Rivers",
  tier: "Release Execution",
  targetDate: "2026-06-18",
  progress: 62,
  phases: [
    { id: "p1", label: "Scope & Strategy", status: "done" },
    { id: "p2", label: "Mix & Master", status: "done", note: "via RoEx + engineer pass" },
    { id: "p3", label: "Assets & Distribution", status: "active", note: "Cover art in review" },
    { id: "p4", label: "Paid Rollout", status: "upcoming" },
    { id: "p5", label: "D2F Monetization", status: "upcoming" },
  ],
  deliverables: [
    { id: "d1", name: "Mix v3 (stereo master)", status: "delivered", provider: "RoEx" },
    { id: "d2", name: "Short-form clip pack (12)", status: "in-progress" },
    { id: "d3", name: "DistroKid upload", status: "queued" },
    { id: "d4", name: "Press one-sheet", status: "in-progress" },
    { id: "d5", name: "Meta ad creatives (6)", status: "queued" },
  ],
  nextSteps: [
    "Approve cover art round 2 (sent Monday)",
    "Record 15-sec behind-the-scenes clip",
    "Confirm $2,400 paid rollout budget",
  ],
  monetization: [
    { label: "Wavi vault", url: "https://wavi.stream/", status: "setup" },
    { label: "Dreamster DMA drop", url: "https://dreamster.io/", status: "setup" },
  ],
};

// ── Components ────────────────────────────────────────────────────────────
function PhaseIcon({ status }: { status: PhaseStatus }) {
  if (status === "done")
    return (
      <div className="flex h-6 w-6 items-center justify-center border border-[#22c55e] bg-[#22c55e]/10">
        <Check size={12} className="text-[#22c55e]" />
      </div>
    );
  if (status === "active")
    return (
      <div className="flex h-6 w-6 items-center justify-center border border-foreground bg-foreground/5">
        <CircleDot size={12} className="text-foreground" />
      </div>
    );
  return (
    <div className="flex h-6 w-6 items-center justify-center border border-border">
      <Circle size={10} className="text-muted-foreground/40" />
    </div>
  );
}

function DeliverableRow({ d }: { d: Deliverable }) {
  const chip =
    d.status === "delivered"
      ? { color: "#22c55e", label: "DELIVERED" }
      : d.status === "in-progress"
      ? { color: "#f59e0b", label: "IN PROGRESS" }
      : { color: "#64748b", label: "QUEUED" };
  return (
    <div className="flex items-center justify-between border-b border-border py-4">
      <div>
        <p className="font-mono text-sm text-foreground">{d.name}</p>
        {d.provider && (
          <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
            VIA {d.provider.toUpperCase()}
          </p>
        )}
      </div>
      <span
        className="border px-2.5 py-1 font-mono text-[9px] tracking-[0.2em]"
        style={{ color: chip.color, borderColor: chip.color + "50" }}
      >
        {chip.label}
      </span>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Portal header */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <Lock size={12} className="text-muted-foreground/50" />
              <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // CLIENT PORTAL PREVIEW
              </p>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                  {MOCK.artist.toUpperCase()} · {MOCK.tier.toUpperCase()}
                </p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                  {MOCK.release}
                </h1>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  Target release · {new Date(MOCK.targetDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="min-w-[240px] border border-border bg-card/40 p-5">
                <p className="mb-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">
                  OVERALL PROGRESS
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-4xl font-bold text-foreground">{MOCK.progress}%</p>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/50">
                    ACTIVE
                  </p>
                </div>
                <div className="mt-3 h-1 w-full bg-border">
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${MOCK.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phases timeline */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
              PHASES
            </p>
            <div className="space-y-4">
              {MOCK.phases.map((phase, i) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 border-l border-border pl-5"
                >
                  <PhaseIcon status={phase.status} />
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3">
                      <p className="font-display text-lg font-bold text-foreground">
                        {phase.label}
                      </p>
                      {phase.status === "active" && (
                        <span className="border border-foreground px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-foreground">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    {phase.note && (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {phase.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid: deliverables + next steps */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-2">
            {/* Deliverables */}
            <div className="bg-background p-8">
              <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                DELIVERABLES
              </p>
              <div>
                {MOCK.deliverables.map((d) => (
                  <DeliverableRow key={d.id} d={d} />
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-background p-8">
              <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                NEXT STEPS
              </p>
              <ul className="space-y-4">
                {MOCK.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                    <p className="font-mono text-sm leading-relaxed text-foreground">
                      {step}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-border pt-6">
                <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                  MONETIZATION LAYER
                </p>
                <div className="space-y-2">
                  {MOCK.monetization.map((m) => (
                    <a
                      key={m.label}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-border px-4 py-3 font-mono text-xs text-foreground transition-colors hover:border-foreground"
                    >
                      <span>{m.label}</span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {m.status === "live" ? "LIVE" : "IN SETUP"}
                        <ExternalLink size={10} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-border px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground/60">
              // THIS IS A PREVIEW
            </p>
            <h2 className="mb-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Your release, operated end-to-end.
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
              Every NewCulture client gets a private operating layer like this
              one: phases, deliverables, providers, and monetization in a single
              view. No spreadsheets, no chasing.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
            >
              APPLY FOR RELEASE SUPPORT <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
