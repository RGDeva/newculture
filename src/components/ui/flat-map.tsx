import { useEffect, useRef } from "react"
import type { MapPin } from "@/components/ui/wireframe-dotted-globe"
import type { UserLocation } from "@/components/ui/wireframe-dotted-globe"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/ui/wireframe-dotted-globe"

interface FlatMapProps {
  pins: MapPin[]
  userLocation?: UserLocation | null
  center?: [number, number]
  zoom?: number
  onPinClick?: (pin: MapPin) => void
  className?: string
}

export default function FlatMap({
  pins,
  userLocation,
  center = [39.5, -98.35],
  zoom = 5,
  onPinClick,
  className = "",
}: FlatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const markersRef = useRef<import("leaflet").CircleMarker[]>([])
  const userMarkerRef = useRef<import("leaflet").CircleMarker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamically import leaflet (avoids SSR issues)
    import("leaflet").then((L) => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "",
        iconUrl: "",
        shadowUrl: "",
      })

      const map = L.map(containerRef.current!, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      })

      mapRef.current = map

      // Dark styled tiles using CartoDB dark matter (no key needed)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map)

      // Custom zoom control bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map)

      // Attribution minimal
      L.control
        .attribution({ position: "bottomleft", prefix: "" })
        .addTo(map)
        .setPrefix(
          '<span style="font-family:monospace;font-size:8px;opacity:0.4">© CartoDB © OSM</span>'
        )

      renderMarkers(L, map)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render markers when pins change
  useEffect(() => {
    if (!mapRef.current) return
    import("leaflet").then((L) => {
      if (!mapRef.current) return
      renderMarkers(L, mapRef.current)
    })
  }, [pins])

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return
    import("leaflet").then((L) => {
      if (!mapRef.current) return
      userMarkerRef.current?.remove()
      const m = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: "#00ff88",
        fillOpacity: 1,
        color: "#00ff88",
        weight: 2,
        opacity: 0.5,
      })
        .addTo(mapRef.current)
        .bindTooltip(
          '<span style="font-family:monospace;font-size:10px;color:#00ff88">YOU</span>',
          { permanent: false, direction: "top" }
        )
      userMarkerRef.current = m
    })
  }, [userLocation])

  // Pan to center when it changes externally
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo(center, zoom, { duration: 1.2 })
  }, [center, zoom])

  function renderMarkers(L: typeof import("leaflet"), map: import("leaflet").Map) {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    pins.forEach((pin) => {
      const color = CATEGORY_COLORS[pin.category] ?? "#ffffff"
      const marker = L.circleMarker([pin.lat, pin.lng], {
        radius: 6,
        fillColor: color,
        fillOpacity: 0.9,
        color: color,
        weight: 1.5,
        opacity: 0.6,
      }).addTo(map)

      // Tooltip
      const stars = pin.rating !== undefined ? `★${pin.rating.toFixed(1)}` : ""
      marker.bindTooltip(
        `<div style="font-family:monospace;font-size:10px;line-height:1.4;min-width:120px">
          <div style="font-weight:bold;color:${color}">${pin.name}</div>
          <div style="color:#aaa;font-size:9px">${pin.city}${pin.state ? `, ${pin.state}` : ""}</div>
          <div style="color:#666;font-size:9px">${CATEGORY_LABELS[pin.category]}${stars ? ` · ${stars}` : ""}</div>
        </div>`,
        { direction: "top", opacity: 1 }
      )

      if (onPinClick) {
        marker.on("click", () => onPinClick(pin))
      }

      markersRef.current.push(marker)
    })
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: "#0a0a0a" }}
    />
  )
}
