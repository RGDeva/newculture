import { motion } from "framer-motion";
import { Layers, DollarSign, Users, Sparkles } from "lucide-react";

const benefits = [
  { icon: Layers, title: "TOOL AGGREGATION", desc: "Access to curated production tools, sample libraries, and software at member-exclusive rates." },
  { icon: DollarSign, title: "DISCOUNTED SERVICES", desc: "Reduced pricing on studio bookings, mastering, distribution, and legal services." },
  { icon: Users, title: "COLLABORATION HUB", desc: "Private forums and real-time channels to connect with other incubator artists." },
  { icon: Sparkles, title: "INDUSTRY ACCESS", desc: "Priority invites to showcases, label meetings, sync opportunities, and mentorship sessions." },
];

export function CommunitySection() {
  return (
    <section id="community" className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // MEMBERSHIP
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Community & Benefits
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-hud group border border-border p-8 transition-colors hover:border-foreground"
            >
              <b.icon
                size={20}
                strokeWidth={1}
                className="mb-6 text-muted-foreground transition-colors group-hover:text-foreground"
              />
              <h3 className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-foreground">
                {b.title}
              </h3>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
