"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"
import { X, ExternalLink, MapPin as MapPinIcon, Phone, Globe, Star } from "lucide-react"

export type PinCategory =
  | "studio"
  | "artist"
  | "producer"
  | "engineer"
  | "videographer"
  | "model"
  | "dj"
  | "photographer"
  | "other"

export const CATEGORY_COLORS: Record<PinCategory, string> = {
  studio:       "#ffffff",
  artist:       "#60a5fa",
  producer:     "#a78bfa",
  engineer:     "#34d399",
  videographer: "#fb923c",
  model:        "#f472b6",
  dj:           "#facc15",
  photographer: "#22d3ee",
  other:        "#94a3b8",
}

export const CATEGORY_LABELS: Record<PinCategory, string> = {
  studio:       "Recording Studio",
  artist:       "Artist",
  producer:     "Producer",
  engineer:     "Engineer",
  videographer: "Videographer",
  model:        "Model",
  dj:           "DJ",
  photographer: "Photographer",
  other:        "Other",
}

export interface MapPin {
  id: string
  name: string
  lat: number
  lng: number
  city: string
  state: string
  category: PinCategory
  // optional enrichment
  bio?: string
  instagram?: string
  website?: string
  phone?: string
  rating?: number
  reviewCount?: number
  gmbUrl?: string
  imageUrl?: string
  genres?: string[]
}

// Keep backward-compat alias
export type StudioPin = MapPin

export interface UserLocation {
  lat: number
  lng: number
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  pins?: MapPin[]
  onPinClick?: (pin: MapPin | null) => void
  userLocation?: UserLocation | null
  focusPoint?: UserLocation | null
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  pins = [],
  onPinClick,
  userLocation,
  focusPoint,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPin, setHoveredPin] = useState<MapPin | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)

  // Keep a ref to pins so canvas callbacks always see current value
  const pinsRef = useRef<MapPin[]>(pins)
  useEffect(() => { pinsRef.current = pins }, [pins])

  // Expose focus command to parent via ref
  const userLocRef = useRef<UserLocation | null>(userLocation ?? null)
  useEffect(() => { userLocRef.current = userLocation ?? null }, [userLocation])

  // focusPoint triggers animated fly-to
  const focusPointRef = useRef<UserLocation | null>(focusPoint ?? null)
  const focusTriggerRef = useRef(0)
  useEffect(() => {
    if (focusPoint) {
      focusPointRef.current = focusPoint
      focusTriggerRef.current += 1
    }
  }, [focusPoint])

  const handlePinClick = useCallback(
    (pin: MapPin | null) => {
      setSelectedPin(pin)
      onPinClick?.(pin)
    },
    [onPinClick]
  )

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        if (!pointInPolygon(point, geometry.coordinates[0])) return false
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInPolygon(point, geometry.coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) dots.push(point)
        }
      }
      return dots
    }

    interface DotData { lng: number; lat: number }
    const allDots: DotData[] = []
    let landFeatures: any
    let animTime = 0

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius
      const currentPins = pinsRef.current

      // Globe background
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#000000"
      context.fill()
      context.strokeStyle = "#ffffff"
      context.lineWidth = 2 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = 0.12
        context.stroke()
        context.globalAlpha = 1

        // Land outlines
        context.beginPath()
        landFeatures.features.forEach((feature: any) => path(feature))
        context.strokeStyle = "#ffffff"
        context.lineWidth = 0.8 * scaleFactor
        context.stroke()

        // Halftone dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (projected && projected[0] >= 0 && projected[0] <= containerWidth && projected[1] >= 0 && projected[1] <= containerHeight) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#555555"
            context.fill()
          }
        })

        // Pins — back pass: pulse rings
        const pulseRadius = 4 + Math.sin(animTime * 2.5) * 2
        currentPins.forEach((pin) => {
          const projected = projection([pin.lng, pin.lat])
          if (!projected) return
          if (projected[0] < 0 || projected[0] > containerWidth || projected[1] < 0 || projected[1] > containerHeight) return
          const color = CATEGORY_COLORS[pin.category] ?? "#ffffff"
          context.beginPath()
          context.arc(projected[0], projected[1], pulseRadius * scaleFactor, 0, 2 * Math.PI)
          context.strokeStyle = color.replace(")", ", 0.35)").replace("#", "rgba(").replace("rgba(", "rgba(")
          // simpler: just use globalAlpha
          context.globalAlpha = 0.35
          context.strokeStyle = color
          context.lineWidth = 1.2 * scaleFactor
          context.stroke()
          context.globalAlpha = 1
        })

        // Pins — front pass: core dots + labels
        currentPins.forEach((pin) => {
          const projected = projection([pin.lng, pin.lat])
          if (!projected) return
          if (projected[0] < 0 || projected[0] > containerWidth || projected[1] < 0 || projected[1] > containerHeight) return
          const color = CATEGORY_COLORS[pin.category] ?? "#ffffff"
          // Core dot
          context.beginPath()
          context.arc(projected[0], projected[1], 3 * scaleFactor, 0, 2 * Math.PI)
          context.fillStyle = color
          context.fill()
          // Name label — only render when zoomed in enough
          if (scaleFactor > 1.1) {
            const labelFontSize = Math.min(9, 7 * scaleFactor) * dpr
            context.save()
            context.scale(1 / dpr, 1 / dpr)
            context.font = `${labelFontSize}px 'JetBrains Mono', monospace`
            context.textAlign = "left"
            const lx = (projected[0] + 5 * scaleFactor) * dpr
            const ly = (projected[1] + 3 * scaleFactor) * dpr
            // Shadow for readability
            context.shadowColor = "#000000"
            context.shadowBlur = 4
            context.fillStyle = color
            context.globalAlpha = 0.9
            context.fillText(pin.name, lx, ly)
            context.shadowBlur = 0
            context.globalAlpha = 1
            context.restore()
          }
        })

        // User location beacon
        const userLoc = userLocRef.current
        if (userLoc) {
          const projected = projection([userLoc.lng, userLoc.lat])
          if (projected && projected[0] >= 0 && projected[0] <= containerWidth && projected[1] >= 0 && projected[1] <= containerHeight) {
            const beaconPulse = 6 + Math.sin(animTime * 4) * 3
            // Outer pulse
            context.beginPath()
            context.arc(projected[0], projected[1], beaconPulse * scaleFactor, 0, 2 * Math.PI)
            context.globalAlpha = 0.25
            context.strokeStyle = "#00ff88"
            context.lineWidth = 1.5 * scaleFactor
            context.stroke()
            context.globalAlpha = 1
            // Middle ring
            context.beginPath()
            context.arc(projected[0], projected[1], 4 * scaleFactor, 0, 2 * Math.PI)
            context.strokeStyle = "#00ff88"
            context.lineWidth = 1 * scaleFactor
            context.stroke()
            // Core
            context.beginPath()
            context.arc(projected[0], projected[1], 2.5 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#00ff88"
            context.fill()
          }
        }
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Failed to load land data")
        landFeatures = await response.json()

        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }))
        })

        render()
        setIsLoading(false)
      } catch {
        setError("Failed to load map data")
        setIsLoading(false)
      }
    }

    const rotation: [number, number] = [-95, -35]
    let autoRotate = true
    const rotationSpeed = 0.25
    let isDragging = false
    let lastFocusTrigger = 0
    let flyToTarget: [number, number] | null = null
    let flyToScale: number | null = null
    let flyProgress = 0
    let flyFromRotation: [number, number] = [rotation[0], rotation[1]]
    let flyFromScale = radius

    const rotate = () => {
      animTime += 0.016

      // Detect new focus trigger
      if (focusTriggerRef.current !== lastFocusTrigger && focusPointRef.current) {
        lastFocusTrigger = focusTriggerRef.current
        const fp = focusPointRef.current
        flyToTarget = [-fp.lng, -fp.lat]
        flyToScale = radius * 2.2
        flyProgress = 0
        flyFromRotation = [rotation[0], rotation[1]]
        flyFromScale = projection.scale()
        autoRotate = false
      }

      // Animated fly-to
      if (flyToTarget && flyProgress < 1) {
        flyProgress = Math.min(1, flyProgress + 0.025)
        const t = flyProgress < 0.5 ? 2 * flyProgress * flyProgress : -1 + (4 - 2 * flyProgress) * flyProgress // ease in-out
        rotation[0] = flyFromRotation[0] + (flyToTarget[0] - flyFromRotation[0]) * t
        rotation[1] = flyFromRotation[1] + (flyToTarget[1] - flyFromRotation[1]) * t
        projection.rotate(rotation)
        if (flyToScale !== null) {
          projection.scale(flyFromScale + (flyToScale - flyFromScale) * t)
        }
        if (flyProgress >= 1) flyToTarget = null
      } else if (autoRotate) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation)
      }

      render()
    }

    const rotationTimer = d3.timer(rotate)

    const getPinAtPoint = (mx: number, my: number): MapPin | null => {
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius
      for (const pin of pinsRef.current) {
        const projected = projection([pin.lng, pin.lat])
        if (projected) {
          const dist = Math.sqrt((projected[0] - mx) ** 2 + (projected[1] - my) ** 2)
          if (dist < 10 * scaleFactor) return pin
        }
      }
      return null
    }

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = false
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation: [number, number] = [rotation[0], rotation[1]]

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true
        rotation[0] = startRotation[0] + dx * 0.5
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - dy * 0.5))
        projection.rotate(rotation)
        render()
      }

      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        // Only resume auto-rotate if no user location focused
        if (!userLocRef.current) {
          setTimeout(() => { autoRotate = true }, 10)
        }

        if (!isDragging) {
          const rect = canvas.getBoundingClientRect()
          const mx = e.clientX - rect.left
          const my = e.clientY - rect.top
          const pin = getPinAtPoint(mx, my)
          if (pin) {
            setSelectedPin(pin)
            onPinClick?.(pin)
          }
        }
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = event.clientX - rect.left
      const my = event.clientY - rect.top
      const found = getPinAtPoint(mx, my)
      setHoveredPin(found)
      if (found) {
        const projected = projection([found.lng, found.lat])
        if (projected) setTooltipPos({ x: projected[0], y: projected[1] })
        canvas.style.cursor = "pointer"
      } else {
        canvas.style.cursor = "grab"
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const sf = event.deltaY > 0 ? 0.9 : 1.1
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * sf)))
      render()
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height])

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="font-mono text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground animate-pulse">
            LOADING GLOBE...
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="block" />

      {/* Hover tooltip */}
      {hoveredPin && tooltipPos && !selectedPin && (
        <div
          className="pointer-events-none absolute z-20 border border-border bg-background/95 px-3 py-1.5"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 48, transform: "translateX(-50%)" }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: CATEGORY_COLORS[hoveredPin.category] }}
            />
            <p className="font-mono text-[10px] tracking-[0.1em] text-foreground whitespace-nowrap">
              {hoveredPin.name}
            </p>
          </div>
          <p className="font-mono text-[9px] text-muted-foreground">
            {CATEGORY_LABELS[hoveredPin.category]} · {hoveredPin.city}, {hoveredPin.state}
          </p>
        </div>
      )}

      {/* Click-selected pin detail panel */}
      {selectedPin && (
        <div className="absolute right-3 top-3 z-30 w-72 border border-border bg-background/98 backdrop-blur-md shadow-xl overflow-hidden">
          {/* Header stripe in category color */}
          <div className="h-1 w-full" style={{ background: CATEGORY_COLORS[selectedPin.category] }} />

          <div className="flex items-start justify-between border-b border-border px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[selectedPin.category] }} />
                <p className="font-mono text-[8px] tracking-[0.25em] uppercase"
                   style={{ color: CATEGORY_COLORS[selectedPin.category] }}>
                  {CATEGORY_LABELS[selectedPin.category]}
                </p>
              </div>
              <p className="font-mono text-sm font-bold text-foreground leading-tight truncate">
                {selectedPin.name}
              </p>
              <p className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground mt-0.5">
                <MapPinIcon size={8} />
                {selectedPin.city}{selectedPin.state ? `, ${selectedPin.state}` : ""}
              </p>
            </div>
            <button onClick={() => setSelectedPin(null)}
              className="ml-2 flex-shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors">
              <X size={13} />
            </button>
          </div>

          <div className="px-4 py-3 space-y-3">

            {/* Rating row — prominently shown for studios */}
            {selectedPin.rating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={10}
                      className={s <= Math.round(selectedPin.rating!) ? "text-yellow-400" : "text-muted-foreground/30"}
                      fill={s <= Math.round(selectedPin.rating!) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-foreground">{selectedPin.rating.toFixed(1)}</span>
                {selectedPin.reviewCount && (
                  <span className="font-mono text-[9px] text-muted-foreground">({selectedPin.reviewCount.toLocaleString()} reviews)</span>
                )}
              </div>
            )}

            {/* Bio */}
            {selectedPin.bio && (
              <p className="font-mono text-[9px] leading-relaxed text-muted-foreground border-l-2 pl-2"
                style={{ borderColor: CATEGORY_COLORS[selectedPin.category] + "60" }}>
                {selectedPin.bio}
              </p>
            )}

            {/* Genres */}
            {selectedPin.genres && selectedPin.genres.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[7px] tracking-[0.3em] text-muted-foreground/60">GENRES / SPECIALTIES</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPin.genres.map((g) => (
                    <span key={g}
                      className="border px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground"
                      style={{ borderColor: CATEGORY_COLORS[selectedPin.category] + "40" }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact details */}
            {(selectedPin.phone || selectedPin.website || selectedPin.instagram) && (
              <div className="space-y-1.5 border-t border-border pt-3">
                {selectedPin.phone && (
                  <a href={`tel:${selectedPin.phone}`}
                     className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors group">
                    <Phone size={9} className="flex-shrink-0" />
                    <span className="truncate">{selectedPin.phone}</span>
                  </a>
                )}
                {selectedPin.website && (
                  <a href={selectedPin.website} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors">
                    <Globe size={9} className="flex-shrink-0" />
                    <span className="truncate">{selectedPin.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                    <ExternalLink size={7} className="flex-shrink-0 ml-auto" />
                  </a>
                )}
                {selectedPin.instagram && (
                  <a href={`https://instagram.com/${selectedPin.instagram.replace("@", "")}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground hover:text-foreground transition-colors">
                    <span className="flex-shrink-0 font-mono text-[9px] font-bold">IG</span>
                    <span className="truncate">@{selectedPin.instagram.replace("@", "")}</span>
                    <ExternalLink size={7} className="flex-shrink-0 ml-auto" />
                  </a>
                )}
              </div>
            )}

            {/* GMB / Maps CTA — full width button for studios */}
            {selectedPin.gmbUrl && (
              <a href={selectedPin.gmbUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-between gap-2 border border-border px-3 py-2.5 font-mono text-[9px] tracking-[0.1em] text-foreground hover:bg-foreground hover:text-background transition-all mt-1">
                <div className="flex items-center gap-2">
                  <MapPinIcon size={10} />
                  {selectedPin.category === "studio" ? "VIEW BUSINESS ON GOOGLE" : "VIEW ON GOOGLE MAPS"}
                </div>
                <ExternalLink size={9} />
              </a>
            )}

            {/* Fallback Google search for studios without GMB URL */}
            {!selectedPin.gmbUrl && selectedPin.category === "studio" && (
              <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedPin.name + " " + selectedPin.city + " recording studio")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-between gap-2 border border-border px-3 py-2.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground hover:border-foreground hover:text-foreground transition-all mt-1">
                <div className="flex items-center gap-2">
                  <MapPinIcon size={10} />
                  SEARCH ON GOOGLE
                </div>
                <ExternalLink size={9} />
              </a>
            )}
          </div>
        </div>
      )}

      <p className="mt-2 text-center font-mono text-[9px] text-muted-foreground/50">
        Drag to rotate · Scroll to zoom · Click pin to expand
      </p>
    </div>
  )
}
