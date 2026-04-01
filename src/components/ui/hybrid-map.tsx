import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Map } from "lucide-react"
import RotatingEarth from "@/components/ui/wireframe-dotted-globe"
import type { MapPin, UserLocation } from "@/components/ui/wireframe-dotted-globe"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/ui/wireframe-dotted-globe"

// Lazy-load FlatMap to avoid SSR / Leaflet issues
import { lazy, Suspense } from "react"
const FlatMap = lazy(() => import("@/components/ui/flat-map"))

interface HybridMapProps {
  pins: MapPin[]
  userLocation?: UserLocation | null
  focusPoint?: UserLocation | null
  width?: number
  height?: number
  onPinClick?: (pin: MapPin | null) => void
}

export default function HybridMap({
  pins,
  userLocation,
  focusPoint,
  width = 900,
  height = 520,
  onPinClick,
}: HybridMapProps) {
  // "globe" | "flat"
  const [mode, setMode] = useState<"globe" | "flat">("globe")
  const [flatCenter, setFlatCenter] = useState<[number, number]>(
    userLocation ? [userLocation.lat, userLocation.lng] : [39.5, -98.35]
  )
  const [flatZoom, setFlatZoom] = useState(4)
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
  const prevFocusRef = useRef<UserLocation | null>(null)

  // When user location comes in via focusPoint, switch to flat map centered there
  useEffect(() => {
    if (!focusPoint) return
    if (
      prevFocusRef.current?.lat === focusPoint.lat &&
      prevFocusRef.current?.lng === focusPoint.lng
    )
      return
    prevFocusRef.current = focusPoint

    // If already in globe mode: animate globe then transition to flat
    setFlatCenter([focusPoint.lat, focusPoint.lng])
    setFlatZoom(12)
    // Switch to flat after globe fly-to animation finishes (~1.5s)
    setTimeout(() => setMode("flat"), 1600)
  }, [focusPoint])

  const handlePinClick = useCallback(
    (pin: MapPin | null) => {
      setSelectedPin(pin)
      onPinClick?.(pin)
    },
    [onPinClick]
  )

  const switchToFlat = () => {
    if (userLocation) {
      setFlatCenter([userLocation.lat, userLocation.lng])
      setFlatZoom(12)
    } else {
      setFlatCenter([39.5, -98.35])
      setFlatZoom(4)
    }
    setMode("flat")
  }

  const switchToGlobe = () => {
    setMode("globe")
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Mode Toggle */}
      <div className="absolute right-3 top-3 z-30 flex gap-1">
        <button
          onClick={switchToGlobe}
          title="3D Globe"
          className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] tracking-[0.15em] transition-all backdrop-blur-sm ${
            mode === "globe"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background/60 text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          <Globe size={10} />
          GLOBE
        </button>
        <button
          onClick={switchToFlat}
          title="2D Map"
          className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] tracking-[0.15em] transition-all backdrop-blur-sm ${
            mode === "flat"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background/60 text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          <Map size={10} />
          MAP
        </button>
      </div>

      {/* Globe layer */}
      <AnimatePresence>
        {mode === "globe" && (
          <motion.div
            key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <RotatingEarth
              width={width}
              height={height}
              pins={pins}
              userLocation={userLocation}
              focusPoint={focusPoint}
              onPinClick={handlePinClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flat map layer */}
      <AnimatePresence>
        {mode === "flat" && (
          <motion.div
            key="flat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-card">
                  <span className="font-mono text-[10px] text-muted-foreground">Loading map...</span>
                </div>
              }
            >
              <FlatMap
                pins={pins}
                userLocation={userLocation}
                center={flatCenter}
                zoom={flatZoom}
                onPinClick={handlePinClick}
                className="h-full w-full"
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner coords (globe only) */}
      {mode === "globe" && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[9px] text-muted-foreground/30">
            [00.000, 00.000]
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 font-mono text-[9px] text-muted-foreground/30">
            [90.000, 180.000]
          </div>
        </>
      )}

      {/* User location badge */}
      {userLocation && (
        <div
          className="pointer-events-none absolute bottom-8 left-3 z-20 flex items-center gap-1.5 font-mono text-[9px]"
          style={{ color: "#00ff88" }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
          YOUR LOCATION
        </div>
      )}

      {/* Hint: switch to flat for deep zoom */}
      {mode === "globe" && userLocation && (
        <div className="absolute bottom-3 left-3 z-20">
          <button
            onClick={switchToFlat}
            className="flex items-center gap-1.5 border border-border bg-background/70 px-2.5 py-1 font-mono text-[9px] text-muted-foreground backdrop-blur-sm transition-all hover:border-foreground hover:text-foreground"
          >
            <Map size={9} />
            ZOOM IN — SWITCH TO MAP VIEW
          </button>
        </div>
      )}

      {/* Selected pin detail panel (both modes) */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            key={selectedPin.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}
            className="absolute right-3 z-40 w-64 border border-border bg-background/95 backdrop-blur-md"
            style={{ top: mode === "globe" ? "48px" : "48px" }}
          >
            <div className="flex items-start justify-between border-b border-border px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: CATEGORY_COLORS[selectedPin.category] }}
                  />
                  <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
                    {CATEGORY_LABELS[selectedPin.category]}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold leading-tight text-foreground">
                  {selectedPin.name}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  {selectedPin.city}{selectedPin.state ? `, ${selectedPin.state}` : ""}
                </p>
              </div>
              <button
                onClick={() => { setSelectedPin(null); onPinClick?.(null) }}
                className="ml-2 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors font-mono text-[10px]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 px-4 py-3">
              {selectedPin.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground">RATING</span>
                  <span className="font-mono text-[9px] text-foreground">
                    ★ {selectedPin.rating.toFixed(1)}
                    {selectedPin.reviewCount ? ` (${selectedPin.reviewCount})` : ""}
                  </span>
                </div>
              )}
              {selectedPin.genres && selectedPin.genres.length > 0 && (
                <div>
                  <p className="font-mono text-[8px] text-muted-foreground">GENRES</p>
                  <p className="font-mono text-[9px] text-foreground">{selectedPin.genres.join(", ")}</p>
                </div>
              )}
              {selectedPin.bio && (
                <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">{selectedPin.bio}</p>
              )}
              {selectedPin.phone && (
                <p className="font-mono text-[9px] text-foreground">{selectedPin.phone}</p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedPin.gmbUrl && (
                  <a
                    href={selectedPin.gmbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    MAPS ↗
                  </a>
                )}
                {selectedPin.website && (
                  <a
                    href={selectedPin.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    SITE ↗
                  </a>
                )}
                {selectedPin.instagram && (
                  <a
                    href={`https://instagram.com/${selectedPin.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    IG ↗
                  </a>
                )}
                {/* Fly to this pin on flat map */}
                <button
                  onClick={() => {
                    setFlatCenter([selectedPin.lat, selectedPin.lng])
                    setFlatZoom(14)
                    setMode("flat")
                  }}
                  className="border border-border px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                >
                  ZOOM IN ↗
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
