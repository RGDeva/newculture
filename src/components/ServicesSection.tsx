import { motion } from "framer-motion";
import { Mic, Search, Users, Headphones, MapPin, Zap } from "lucide-react";

const services = [
  { icon: Search, title: "STUDIO FINDER", desc: "Locate premium recording studios with real-time availability and booking." },
  { icon: Users, title: "PRODUCER MATCH", desc: "AI-powered matching connecting artists with producers by genre and style." },
  { icon: Mic, title: "SESSION BOOKING", desc: "Schedule recording sessions, mixing, and mastering with vetted engineers." },
  { icon: MapPin, title: "LOCATION NETWORK", desc: "Pin yourself on the global map and discover collaborators nearby." },
  { icon: Headphones, title: "DISTRIBUTION", desc: "Streamlined release pipeline to all major streaming platforms." },
  { icon: Zap, title: "ACCELERATOR", desc: "12-week programs with mentorship, funding, and industry placement." },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // INFRASTRUCTURE
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Services & Tools
          </h2>
        </motion.div>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group bg-background p-8 transition-colors hover:bg-card"
            >
              <service.icon
                size={20}
                strokeWidth={1}
                className="mb-6 text-muted-foreground transition-colors group-hover:text-foreground"
              />
              <h3 className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-foreground">
                {service.title}
              </h3>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
