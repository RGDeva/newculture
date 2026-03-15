import { motion } from "framer-motion";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const artists = [
  { name: "KAEL RIVERS", role: "VOCALIST / SONGWRITER", location: "LOS ANGELES, CA", id: "NC-001", img: artist1 },
  { name: "NOVA SAINT", role: "R&B / NEO-SOUL", location: "ATLANTA, GA", id: "NC-002", img: artist2 },
  { name: "MARCO VOSS", role: "PRODUCER / ENGINEER", location: "MIAMI, FL", id: "NC-003", img: artist3 },
  { name: "SHADE ELEMENT", role: "HIP-HOP / EXPERIMENTAL", location: "NEW YORK, NY", id: "NC-004", img: artist4 },
];

export function ArtistsSection() {
  return (
    <section id="artists" className="bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // ROSTER
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Featured Artists
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="border-hud group cursor-pointer border border-border bg-card p-0 transition-all hover:border-foreground"
            >
              <div className="scanline relative aspect-[3/4] overflow-hidden">
                <img
                  src={artist.img}
                  alt={artist.name}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                  {artist.id}
                </div>
              </div>
              <div className="border-t border-border p-4">
                <h3 className="mb-1 font-display text-sm font-semibold tracking-wide text-foreground">
                  {artist.name}
                </h3>
                <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                  {artist.role}
                </p>
                <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
                  ◉ {artist.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
