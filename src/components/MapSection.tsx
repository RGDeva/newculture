import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, LocateFixed, Search, ChevronRight } from "lucide-react";
import {
  type MapPin,
  type PinCategory,
  type UserLocation,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "@/components/ui/wireframe-dotted-globe";
import HybridMap from "@/components/ui/hybrid-map";
import { CSV_STUDIO_PINS } from "@/data/csv-studios";

const STORAGE_KEY = "newculture_map_pins";

const SEED_PINS: MapPin[] = [
  { id: "s1",  name: "Capitol Studios",               lat: 34.1017, lng: -118.3265, city: "Los Angeles",   state: "CA", category: "studio",  rating: 4.8, reviewCount: 312, gmbUrl: "https://maps.google.com/?q=Capitol+Studios+Hollywood", website: "https://capitolstudios.com", genres: ["Pop","Rock","Orchestral"] },
  { id: "s2",  name: "Sunset Sound",                  lat: 34.0981, lng: -118.3368, city: "Hollywood",     state: "CA", category: "studio",  rating: 4.7, reviewCount: 198, gmbUrl: "https://maps.google.com/?q=Sunset+Sound+Hollywood" },
  { id: "s3",  name: "EastWest Studios",              lat: 34.0907, lng: -118.3887, city: "Hollywood",     state: "CA", category: "studio",  rating: 4.9, reviewCount: 421 },
  { id: "s4",  name: "Village Studios",               lat: 34.0529, lng: -118.4372, city: "West Los Angeles", state: "CA", category: "studio" },
  { id: "s5",  name: "Record Plant",                  lat: 34.0906, lng: -118.3866, city: "Hollywood",     state: "CA", category: "studio",  website: "https://recordplant.com" },
  { id: "s6",  name: "Hyde Street Studios",           lat: 37.7817, lng: -122.4152, city: "San Francisco", state: "CA", category: "studio" },
  { id: "s7",  name: "Electric Lady Studios",         lat: 40.7321, lng: -74.0004,  city: "New York",      state: "NY", category: "studio",  rating: 4.9, reviewCount: 876, gmbUrl: "https://maps.google.com/?q=Electric+Lady+Studios+NYC", website: "https://electricladystudios.com", genres: ["Rock","R&B","Hip-Hop"] },
  { id: "s8",  name: "Power Station",                 lat: 40.7226, lng: -74.0050,  city: "New York",      state: "NY", category: "studio" },
  { id: "s9",  name: "RCA Studio B",                  lat: 36.1519, lng: -86.7888,  city: "Nashville",     state: "TN", category: "studio",  rating: 4.6, reviewCount: 540, gmbUrl: "https://maps.google.com/?q=RCA+Studio+B+Nashville", genres: ["Country","Pop"] },
  { id: "s10", name: "Blackbird Studio",              lat: 36.1508, lng: -86.8148,  city: "Nashville",     state: "TN", category: "studio",  website: "https://blackbirdstudio.com" },
  { id: "s11", name: "Sun Studio",                    lat: 35.1393, lng: -90.0310,  city: "Memphis",       state: "TN", category: "studio",  rating: 4.9, reviewCount: 2100, gmbUrl: "https://maps.google.com/?q=Sun+Studio+Memphis", genres: ["Rock","Blues","Country"] },
  { id: "s12", name: "Tree Sound Studios",            lat: 33.7615, lng: -84.3569,  city: "Atlanta",       state: "GA", category: "studio",  genres: ["Hip-Hop","R&B","Trap"] },
  { id: "s13", name: "Patchwerk Studios",             lat: 33.7773, lng: -84.4138,  city: "Atlanta",       state: "GA", category: "studio",  rating: 4.7, reviewCount: 290 },
  { id: "s14", name: "Criteria Studios",              lat: 25.8001, lng: -80.1918,  city: "Miami",         state: "FL", category: "studio" },
  { id: "s15", name: "Arlyn Studios",                 lat: 30.2604, lng: -97.7467,  city: "Austin",        state: "TX", category: "studio",  website: "https://arlynstudios.com" },
  { id: "s16", name: "SugarHill Studios",             lat: 29.7443, lng: -95.3835,  city: "Houston",       state: "TX", category: "studio" },
  { id: "s17", name: "Chicago Recording Company",     lat: 41.8871, lng: -87.6293,  city: "Chicago",       state: "IL", category: "studio" },
  { id: "s18", name: "Motown Studio A",               lat: 42.3641, lng: -83.0886,  city: "Detroit",       state: "MI", category: "studio",  rating: 4.8, reviewCount: 670, gmbUrl: "https://maps.google.com/?q=Motown+Museum+Detroit", genres: ["R&B","Soul","Motown"] },
  { id: "s19", name: "Paisley Park Studios",          lat: 44.8610, lng: -93.5666,  city: "Chanhassen",    state: "MN", category: "studio",  rating: 4.8, reviewCount: 1200, gmbUrl: "https://maps.google.com/?q=Paisley+Park+Chanhassen" },
  { id: "s20", name: "Sigma Sound Studios",           lat: 39.9523, lng: -75.1622,  city: "Philadelphia",  state: "PA", category: "studio" },
  { id: "s21", name: "London Bridge Studio",          lat: 47.5315, lng: -122.0319, city: "Seattle",       state: "WA", category: "studio" },
  { id: "s22", name: "Jungle City Studios",           lat: 40.7580, lng: -73.9855,  city: "New York",      state: "NY", category: "studio" },
  { id: "s23", name: "Ocean Way Nashville",           lat: 36.1545, lng: -86.7955,  city: "Nashville",     state: "TN", category: "studio" },
  { id: "s24", name: "Royal Studios",                 lat: 35.1044, lng: -90.0408,  city: "Memphis",       state: "TN", category: "studio" },
  { id: "s25", name: "Esplanade Studios",             lat: 29.9682, lng: -90.0584,  city: "New Orleans",   state: "LA", category: "studio" },
  { id: "a1", name: "Sample Artist — NYC",            lat: 40.7580, lng: -73.9855,  city: "New York",      state: "NY", category: "artist",  bio: "Independent R&B/Soul artist based in Manhattan.", genres: ["R&B","Soul"], instagram: "sampleartist" },
  { id: "a2", name: "Sample Artist — LA",             lat: 34.0522, lng: -118.2437, city: "Los Angeles",   state: "CA", category: "artist",  bio: "West Coast Hip-Hop artist.", genres: ["Hip-Hop","Rap"] },
  { id: "a3", name: "Sample Artist — ATL",            lat: 33.7490, lng: -84.3880,  city: "Atlanta",       state: "GA", category: "artist",  bio: "Atlanta trap & melodic rap.", genres: ["Trap","Rap"] },
  { id: "p1", name: "Sample Producer — Chicago",      lat: 41.8827, lng: -87.6233,  city: "Chicago",       state: "IL", category: "producer", bio: "Multi-genre producer, specializing in soul samples.", genres: ["Soul","Hip-Hop"] },
  { id: "p2", name: "Sample Producer — Houston",      lat: 29.7604, lng: -95.3698,  city: "Houston",       state: "TX", category: "producer", bio: "Screwed & Chopped beats pioneer.", genres: ["Chopped","Hip-Hop"] },
  { id: "e1", name: "Sample Engineer — Nashville",    lat: 36.1627, lng: -86.7816,  city: "Nashville",     state: "TN", category: "engineer", bio: "Mixing & mastering engineer with 10+ years experience.", genres: ["Country","Pop"] },
  { id: "v1", name: "Sample Videographer — Miami",    lat: 25.7617, lng: -80.1918,  city: "Miami",         state: "FL", category: "videographer", bio: "Music video director & colorist." },
  { id: "d1", name: "Sample DJ — Las Vegas",          lat: 36.1699, lng: -115.1398, city: "Las Vegas",     state: "NV", category: "dj", bio: "Residency DJ, open format." },
  { id: "ph1", name: "Sample Photographer — NYC",     lat: 40.6892, lng: -74.0445,  city: "New York",      state: "NY", category: "photographer", bio: "Editorial & press photography." },
  { id: "m1", name: "Sample Model — LA",              lat: 34.0195, lng: -118.4912, city: "Los Angeles",   state: "CA", category: "model", bio: "Commercial & editorial model." },
];

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as PinCategory[];

const COMBINED_SEED: MapPin[] = (() => {
  const seedNames = new Set(SEED_PINS.map((p) => p.name.toLowerCase()));
  const csvDeduped = CSV_STUDIO_PINS.filter((p) => !seedNames.has(p.name.toLowerCase()));
  return [...SEED_PINS, ...csvDeduped];
})();

const EMPTY_FORM = {
  name: "", address: "", city: "", state: "",
  category: "artist" as PinCategory,
  bio: "", instagram: "", website: "", phone: "", genres: "", gmbUrl: "",
};

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function MapSection({ embedded = false }: { embedded?: boolean }) {
  const [allPins, setAllPins] = useState<MapPin[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: MapPin[] = JSON.parse(stored);
        const userIds = new Set(parsed.map((p) => p.id));
        return [...COMBINED_SEED.filter((p) => !userIds.has(p.id)), ...parsed];
      }
    } catch {}
    return COMBINED_SEED;
  });

  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(new Set(ALL_CATEGORIES));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [focusPoint, setFocusPoint] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [nearbyRadius, setNearbyRadius] = useState(25);
  const [nearbyFilter, setNearbyFilter] = useState<Set<PinCategory>>(new Set(ALL_CATEGORIES));
  const [searchQuery, setSearchQuery] = useState("");

  const handleLocateMe = () => {
    if (!navigator.geolocation) { setLocateError("Geolocation not supported."); return; }
    setLocating(true); setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc); setFocusPoint({ ...loc }); setLocating(false);
      },
      (err) => { setLocateError(err.code === 1 ? "Location permission denied." : "Could not get location."); setLocating(false); },
      { timeout: 10000 }
    );
  };

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; city: string; state: string } | null> => {
    if (!address.trim()) return null;
    setGeocoding(true); setGeocodeError("");
    try {
      const encoded = encodeURIComponent(address + ", United States");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=1`, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (!data.length) { setGeocodeError("Address not found."); return null; }
      const result = data[0]; const addr = result.address;
      return { lat: parseFloat(result.lat), lng: parseFloat(result.lon), city: addr.city || addr.town || addr.village || addr.county || "", state: addr.state || "" };
    } catch { setGeocodeError("Geocoding failed."); return null; }
    finally { setGeocoding(false); }
  };

  const handleAddressBlur = async () => {
    if (!form.address.trim()) return;
    const geo = await geocodeAddress(form.address);
    if (geo) setForm((f) => ({ ...f, city: geo.city || f.city, state: geo.state || f.state }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return;
    setSubmitting(true);
    const geo = await geocodeAddress(form.address);
    if (!geo) { setSubmitting(false); return; }
    const newPin: MapPin = {
      id: `user_${Date.now()}`, name: form.name.trim(),
      lat: geo.lat, lng: geo.lng, city: form.city || geo.city, state: form.state || geo.state,
      category: form.category, bio: form.bio.trim() || undefined,
      instagram: form.instagram.trim() || undefined, website: form.website.trim() || undefined,
      phone: form.phone.trim() || undefined, gmbUrl: form.gmbUrl.trim() || undefined,
      genres: form.genres.trim() ? form.genres.split(",").map((g) => g.trim()).filter(Boolean) : undefined,
    };
    const updated = [...allPins, newPin];
    setAllPins(updated);
    const seedIds = new Set(COMBINED_SEED.map((p) => p.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((p) => !seedIds.has(p.id))));
    setActiveCategories((prev) => new Set([...prev, form.category]));
    setSubmitting(false); setSubmitted(true); setForm(EMPTY_FORM);
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2500);
  };

  const toggleCategory = (cat: PinCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size === 1) return prev; next.delete(cat); } else next.add(cat);
      return next;
    });
  };

  const visiblePins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPins.filter((p) => {
      if (!activeCategories.has(p.category)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) || CATEGORY_LABELS[p.category].toLowerCase().includes(q) ||
        (p.genres ?? []).some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [allPins, activeCategories, searchQuery]);

  const nearbyPins = useMemo(() => {
    if (!userLocation) return [];
    return allPins
      .filter((p) => nearbyFilter.has(p.category))
      .map((p) => ({ pin: p, dist: distanceMiles(userLocation.lat, userLocation.lng, p.lat, p.lng) }))
      .filter(({ dist }) => dist <= nearbyRadius)
      .sort((a, b) => a.dist - b.dist);
  }, [allPins, userLocation, nearbyRadius, nearbyFilter]);

  const stateCounts = useMemo(() =>
    visiblePins.reduce<Record<string, number>>((acc, p) => { acc[p.state] = (acc[p.state] || 0) + 1; return acc; }, {}),
    [visiblePins]
  );

  const mapContent = (
    <div className={embedded ? "p-4" : "mx-auto max-w-7xl px-6"}>
      {/* Header — standalone only */}
      {!embedded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">// GLOBAL NETWORK</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Creator Map</h2>
            <p className="mt-3 max-w-lg font-mono text-xs text-muted-foreground">
              {visiblePins.length} of {allPins.length} creators across {Object.keys(stateCounts).length} states
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLocateMe} disabled={locating}
              className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] transition-all disabled:opacity-50 ${userLocation ? "border-[#00ff88] text-[#00ff88]" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              {locating ? <Loader2 size={11} className="animate-spin" /> : <LocateFixed size={11} />}
              {userLocation ? "LOCATED" : locating ? "LOCATING..." : "LOCATE ME"}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground"
            >
              <Plus size={12} /> ADD YOURSELF
            </button>
          </div>
        </motion.div>
      )}

      {/* Embedded toolbar */}
      {embedded && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handleLocateMe} disabled={locating}
            className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] transition-all disabled:opacity-50 ${userLocation ? "border-[#00ff88] text-[#00ff88]" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
          >
            {locating ? <Loader2 size={10} className="animate-spin" /> : <LocateFixed size={10} />}
            {userLocation ? "LOCATED" : locating ? "LOCATING..." : "LOCATE ME"}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
          >
            <Plus size={10} /> ADD YOURSELF
          </button>
          <div className="relative ml-auto">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="border border-border bg-transparent py-1.5 pl-8 pr-3 font-mono text-[10px] text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
            />
          </div>
        </div>
      )}

      {locateError && <p className="mb-4 font-mono text-[10px] text-destructive">{locateError}</p>}

      {/* Search + filters — standalone only */}
      {!embedded && (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mb-4 flex flex-col gap-3"
        >
          <div className="relative max-w-sm">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, genre..."
              className="w-full border border-border bg-transparent py-2 pl-8 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={11} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategories(new Set(ALL_CATEGORIES))}
              className={`border px-3 py-1 font-mono text-[9px] tracking-[0.15em] transition-all ${activeCategories.size === ALL_CATEGORIES.length ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              ALL
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat} onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-1.5 border px-3 py-1 font-mono text-[9px] tracking-[0.1em] transition-all ${activeCategories.has(cat) ? "border-transparent text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
                style={activeCategories.has(cat) ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: activeCategories.has(cat) ? "currentColor" : CATEGORY_COLORS[cat] }} />
                {CATEGORY_LABELS[cat].toUpperCase()}
                <span className="opacity-60">({allPins.filter((p) => p.category === cat).length})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Map */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="relative overflow-hidden border border-border bg-card"
      >
        <HybridMap pins={visiblePins} userLocation={userLocation} focusPoint={focusPoint} width={900} height={520} />
      </motion.div>

      {/* Category legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
        {ALL_CATEGORIES.filter((c) => activeCategories.has(c)).map((cat) => {
          const count = visiblePins.filter((p) => p.category === cat).length;
          if (!count) return null;
          return (
            <span key={cat} className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
              {count} {CATEGORY_LABELS[cat].toUpperCase()}S
            </span>
          );
        })}
      </div>

      {/* Nearby panel */}
      <AnimatePresence>
        {userLocation && nearbyPins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="mt-8 border border-border"
          >
            <div className="flex flex-col gap-3 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">// NEAR YOU</p>
                <p className="font-mono text-sm font-bold text-foreground">{nearbyPins.length} creators within {nearbyRadius} miles</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground">RADIUS</span>
                  {[10, 25, 50, 100].map((r) => (
                    <button key={r} onClick={() => setNearbyRadius(r)}
                      className={`border px-2 py-0.5 font-mono text-[9px] transition-all ${nearbyRadius === r ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"}`}
                    >{r}mi</button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALL_CATEGORIES.map((cat) => (
                    <button key={cat}
                      onClick={() => setNearbyFilter((prev) => { const next = new Set(prev); if (next.has(cat)) { if (next.size === 1) return prev; next.delete(cat); } else next.add(cat); return next; })}
                      className="border px-2 py-0.5 font-mono text-[8px] transition-all"
                      style={nearbyFilter.has(cat) ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat], color: "#000" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                    >{CATEGORY_LABELS[cat]}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-0 divide-y divide-border sm:grid-cols-2 lg:grid-cols-3">
              {nearbyPins.slice(0, 18).map(({ pin, dist }) => (
                <div key={pin.id} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-card">
                  <span className="mt-0.5 inline-block h-2 w-2 flex-shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[pin.category] }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[10px] font-bold text-foreground">{pin.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{pin.city}, {pin.state} · {dist.toFixed(1)} mi</p>
                    {pin.genres && pin.genres.length > 0 && (
                      <p className="truncate font-mono text-[8px] text-muted-foreground/60">{pin.genres.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    {pin.rating !== undefined && (
                      <span className="font-mono text-[8px] text-muted-foreground">★ {pin.rating.toFixed(1)}</span>
                    )}
                    {pin.gmbUrl && (
                      <a href={pin.gmbUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[8px] text-muted-foreground transition-colors hover:text-foreground">
                        Maps <ChevronRight size={8} className="inline" />
                      </a>
                    )}
                    {pin.website && !pin.gmbUrl && (
                      <a href={pin.website} target="_blank" rel="noopener noreferrer" className="font-mono text-[8px] text-muted-foreground transition-colors hover:text-foreground">
                        Site <ChevronRight size={8} className="inline" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {nearbyPins.length > 18 && (
              <div className="border-t border-border px-5 py-3">
                <p className="font-mono text-[9px] text-muted-foreground">+{nearbyPins.length - 18} more within {nearbyRadius} miles</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (embedded) {
    return (
      <>
        {mapContent}
        <AnimatePresence>
          {showForm && <AddPinModal {...{ form, setForm, geocoding, geocodeError, submitting, submitted, handleAddressBlur, handleSubmit, setShowForm, ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS }} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <section id="map" className="border-t border-border bg-background py-24">
      {mapContent}
      <AnimatePresence>
        {showForm && <AddPinModal {...{ form, setForm, geocoding, geocodeError, submitting, submitted, handleAddressBlur, handleSubmit, setShowForm, ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS }} />}
      </AnimatePresence>
    </section>
  );
}

// ── Add Pin Modal (extracted) ─────────────────────────────────────────────
function AddPinModal({
  form, setForm, geocoding, geocodeError, submitting, submitted,
  handleAddressBlur, handleSubmit, setShowForm, ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS,
}: {
  form: typeof import("../components/MapSection")["EMPTY_FORM"] extends never ? any : any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  geocoding: boolean; geocodeError: string; submitting: boolean; submitted: boolean;
  handleAddressBlur: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: (v: boolean) => void;
  ALL_CATEGORIES: PinCategory[];
  CATEGORY_COLORS: Record<PinCategory, string>;
  CATEGORY_LABELS: Record<PinCategory, string>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-background"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">// ADD TO MAP</p>
            <p className="font-mono text-sm font-bold text-foreground">Pin Yourself</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-muted-foreground transition-colors hover:text-foreground"><X size={16} /></button>
        </div>
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-12">
            <div className="font-mono text-2xl text-foreground">✓</div>
            <p className="font-mono text-xs tracking-[0.2em] text-foreground">YOU&apos;RE ON THE MAP</p>
            <p className="font-mono text-[10px] text-muted-foreground">Your pin has been added.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">CATEGORY *</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((cat) => (
                  <button key={cat} type="button" onClick={() => setForm((f: any) => ({ ...f, category: cat }))}
                    className="border px-2.5 py-1 font-mono text-[9px] transition-all"
                    style={form.category === cat ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat], color: "#000" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                  >{CATEGORY_LABELS[cat]}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                {form.category === "studio" ? "STUDIO NAME *" : "YOUR NAME / ALIAS *"}
              </label>
              <input required value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
                placeholder={form.category === "studio" ? "e.g. Westside Sound" : "e.g. DJ Phantom"}
                className="w-full border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">ADDRESS / NEIGHBORHOOD *</label>
              <div className="relative">
                <input required value={form.address} onChange={(e) => setForm((f: any) => ({ ...f, address: e.target.value }))}
                  onBlur={handleAddressBlur} placeholder="e.g. 123 Main St, Brooklyn, NY"
                  className="w-full border border-border bg-transparent px-3 py-2 pr-8 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
                />
                {geocoding && <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />}
              </div>
              {geocodeError && <p className="mt-1 font-mono text-[9px] text-destructive">{geocodeError}</p>}
              {form.city && <p className="mt-1 font-mono text-[9px] text-muted-foreground">✓ Located: {form.city}{form.state ? `, ${form.state}` : ""}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">INSTAGRAM</label>
                <input value={form.instagram} onChange={(e) => setForm((f: any) => ({ ...f, instagram: e.target.value }))} placeholder="@handle"
                  className="w-full border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">WEBSITE</label>
                <input value={form.website} onChange={(e) => setForm((f: any) => ({ ...f, website: e.target.value }))} placeholder="https://"
                  className="w-full border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">GENRES / SPECIALTIES</label>
              <input value={form.genres} onChange={(e) => setForm((f: any) => ({ ...f, genres: e.target.value }))} placeholder="Hip-Hop, R&B, Trap"
                className="w-full border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">BIO</label>
              <textarea value={form.bio} onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))} placeholder="Short description..." rows={2}
                className="w-full resize-none border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none" />
            </div>
            {form.category === "studio" && (
              <div>
                <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-muted-foreground">GOOGLE MAPS URL</label>
                <input value={form.gmbUrl} onChange={(e) => setForm((f: any) => ({ ...f, gmbUrl: e.target.value }))} placeholder="https://maps.google.com/?q=..."
                  className="w-full border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none" />
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="font-mono text-[9px] text-muted-foreground/50">Saved locally to your browser</p>
              <button type="submit" disabled={submitting || geocoding}
                className="flex items-center gap-2 border border-foreground bg-foreground px-5 py-2 font-mono text-[10px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-50"
              >
                {submitting ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                {submitting ? "LOCATING..." : "DROP PIN"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
