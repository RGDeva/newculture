import { useState } from "react";
import { motion } from "framer-motion";

const pins = [
  { x: 18, y: 42, label: "Los Angeles", count: 12 },
  { x: 24, y: 38, label: "New York", count: 8 },
  { x: 22, y: 44, label: "Atlanta", count: 15 },
  { x: 21, y: 46, label: "Miami", count: 6 },
  { x: 48, y: 30, label: "London", count: 9 },
  { x: 50, y: 32, label: "Paris", count: 4 },
  { x: 52, y: 28, label: "Berlin", count: 7 },
  { x: 75, y: 38, label: "Tokyo", count: 5 },
  { x: 70, y: 48, label: "Lagos", count: 11 },
  { x: 55, y: 50, label: "Nairobi", count: 3 },
];

export function MapSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="map" className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // GLOBAL NETWORK
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Artist Map
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-hud relative aspect-[2/1] w-full overflow-hidden border border-border bg-card"
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)",
              backgroundSize: "5% 5%",
            }}
          />

          {/* World map outline (simplified SVG) */}
          <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full opacity-10">
            <path
              d="M15,25 Q20,20 25,22 Q30,18 35,20 Q40,22 45,20 Q48,18 50,20 Q55,22 60,20 Q65,18 70,22 Q75,20 80,25 Q85,28 80,32 Q75,35 70,38 Q65,40 60,42 Q55,45 50,42 Q45,40 40,38 Q35,35 30,38 Q25,40 20,38 Q15,35 12,30 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>

          {/* Pins */}
          {pins.map((pin) => (
            <div
              key={pin.label}
              className="absolute cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onMouseEnter={() => setActive(pin.label)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="animate-pulse-dot h-2 w-2 rounded-full bg-foreground" />
              {active === pin.label && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap border border-border bg-background px-3 py-1.5"
                >
                  <p className="font-mono text-[10px] tracking-[0.15em] text-foreground">
                    {pin.label}
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    {pin.count} ARTISTS
                  </p>
                </motion.div>
              )}
            </div>
          ))}

          {/* Corner coordinates */}
          <div className="absolute left-3 top-3 font-mono text-[9px] text-muted-foreground/40">
            [00.000, 00.000]
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[9px] text-muted-foreground/40">
            [90.000, 180.000]
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted-foreground">
            {pins.reduce((a, b) => a + b.count, 0)} ARTISTS ACROSS {pins.length} CITIES
          </p>
          <a
            href="#join"
            className="font-mono text-[10px] tracking-[0.15em] text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            PIN YOURSELF →
          </a>
        </div>
      </div>
    </section>
  );
}
