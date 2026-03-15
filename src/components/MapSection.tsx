import { motion } from "framer-motion";
import RotatingEarth, { type StudioPin } from "@/components/ui/wireframe-dotted-globe";

const studioPins: StudioPin[] = [
  // California
  { name: "Capitol Studios", lat: 34.1017, lng: -118.3265, city: "Los Angeles", state: "CA" },
  { name: "Sunset Sound", lat: 34.0981, lng: -118.3368, city: "Hollywood", state: "CA" },
  { name: "EastWest Studios", lat: 34.0907, lng: -118.3887, city: "Hollywood", state: "CA" },
  { name: "Village Studios", lat: 34.0529, lng: -118.4372, city: "West Los Angeles", state: "CA" },
  { name: "Record Plant", lat: 34.0906, lng: -118.3866, city: "Hollywood", state: "CA" },
  { name: "Conway Recording", lat: 34.0899, lng: -118.3884, city: "Hollywood", state: "CA" },
  { name: "United Recording", lat: 34.0907, lng: -118.3355, city: "Hollywood", state: "CA" },
  { name: "Hyde Street Studios", lat: 37.7817, lng: -122.4152, city: "San Francisco", state: "CA" },
  { name: "Fantasy Studios", lat: 37.8408, lng: -122.2595, city: "Berkeley", state: "CA" },
  // New York
  { name: "Electric Lady Studios", lat: 40.7321, lng: -74.0004, city: "New York", state: "NY" },
  { name: "Power Station", lat: 40.7226, lng: -74.0050, city: "New York", state: "NY" },
  { name: "Platinum Sound", lat: 40.7484, lng: -73.9879, city: "New York", state: "NY" },
  { name: "Jungle City Studios", lat: 40.7580, lng: -73.9855, city: "New York", state: "NY" },
  { name: "MSR Studios", lat: 40.7614, lng: -73.9776, city: "New York", state: "NY" },
  // Tennessee
  { name: "RCA Studio B", lat: 36.1519, lng: -86.7888, city: "Nashville", state: "TN" },
  { name: "Blackbird Studio", lat: 36.1508, lng: -86.8148, city: "Nashville", state: "TN" },
  { name: "Ocean Way Nashville", lat: 36.1545, lng: -86.7955, city: "Nashville", state: "TN" },
  { name: "Sound Emporium", lat: 36.1175, lng: -86.7644, city: "Nashville", state: "TN" },
  { name: "Sun Studio", lat: 35.1393, lng: -90.0310, city: "Memphis", state: "TN" },
  { name: "Royal Studios", lat: 35.1044, lng: -90.0408, city: "Memphis", state: "TN" },
  // Georgia
  { name: "Tree Sound Studios", lat: 33.7615, lng: -84.3569, city: "Atlanta", state: "GA" },
  { name: "Patchwerk Studios", lat: 33.7773, lng: -84.4138, city: "Atlanta", state: "GA" },
  { name: "Doppler Studios", lat: 33.7683, lng: -84.3636, city: "Atlanta", state: "GA" },
  // Florida
  { name: "Criteria Studios", lat: 25.8001, lng: -80.1918, city: "Miami", state: "FL" },
  { name: "Circle House Studios", lat: 25.7803, lng: -80.1870, city: "Miami", state: "FL" },
  // Texas
  { name: "Arlyn Studios", lat: 30.2604, lng: -97.7467, city: "Austin", state: "TX" },
  { name: "SugarHill Studios", lat: 29.7443, lng: -95.3835, city: "Houston", state: "TX" },
  // Illinois
  { name: "Chicago Recording Company", lat: 41.8871, lng: -87.6293, city: "Chicago", state: "IL" },
  { name: "Steve Albini's Electrical Audio", lat: 41.9015, lng: -87.6723, city: "Chicago", state: "IL" },
  // Michigan
  { name: "United Sound Systems", lat: 42.3586, lng: -83.0698, city: "Detroit", state: "MI" },
  { name: "Motown Studio A", lat: 42.3641, lng: -83.0886, city: "Detroit", state: "MI" },
  // Louisiana
  { name: "Esplanade Studios", lat: 29.9682, lng: -90.0584, city: "New Orleans", state: "LA" },
  // Washington
  { name: "London Bridge Studio", lat: 47.5315, lng: -122.0319, city: "Seattle", state: "WA" },
  // Colorado
  { name: "Caribou Ranch", lat: 40.0340, lng: -105.5125, city: "Nederland", state: "CO" },
  // Minnesota
  { name: "Paisley Park Studios", lat: 44.8610, lng: -93.5666, city: "Chanhassen", state: "MN" },
  // Pennsylvania
  { name: "Sigma Sound Studios", lat: 39.9523, lng: -75.1622, city: "Philadelphia", state: "PA" },
  // Massachusetts
  { name: "Q Division Studios", lat: 42.3690, lng: -71.0765, city: "Somerville", state: "MA" },
];

export function MapSection() {
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
            Studio Map
          </h2>
          <p className="mt-4 max-w-lg font-mono text-xs text-muted-foreground">
            {studioPins.length} recording studios across the United States — hover pins to explore.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-hud relative flex items-center justify-center overflow-hidden border border-border bg-card"
        >
          <RotatingEarth
            width={900}
            height={500}
            pins={studioPins}
          />

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
            {studioPins.length} STUDIOS ACROSS {new Set(studioPins.map(p => p.state)).size} STATES
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
