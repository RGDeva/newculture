"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"

export interface StudioPin {
  name: string
  lat: number
  lng: number
  city: string
  state: string
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  pins?: StudioPin[]
  onPinHover?: (pin: StudioPin | null) => void
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  pins = [],
  onPinHover,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPin, setHoveredPin] = useState<StudioPin | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const handlePinHover = useCallback(
    (pin: StudioPin | null) => {
      setHoveredPin(pin)
      onPinHover?.(pin)
    },
    [onPinHover]
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

    interface DotData { lng: number; lat: number; visible: boolean }
    const allDots: DotData[] = []
    let landFeatures: any
    let animTime = 0

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

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
        context.globalAlpha = 0.15
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
            context.fillStyle = "#666666"
            context.fill()
          }
        })

        // Studio pins
        const pulseRadius = 3 + Math.sin(animTime * 3) * 1.5
        pins.forEach((pin) => {
          const projected = projection([pin.lng, pin.lat])
          if (projected && projected[0] >= 0 && projected[0] <= containerWidth && projected[1] >= 0 && projected[1] <= containerHeight) {
            // Pulse ring
            context.beginPath()
            context.arc(projected[0], projected[1], pulseRadius * scaleFactor, 0, 2 * Math.PI)
            context.strokeStyle = "rgba(255, 255, 255, 0.4)"
            context.lineWidth = 1 * scaleFactor
            context.stroke()

            // Core dot
            context.beginPath()
            context.arc(projected[0], projected[1], 2.5 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#ffffff"
            context.fill()
          }
        })
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
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat, visible: true }))
        })

        render()
        setIsLoading(false)
      } catch {
        setError("Failed to load map data")
        setIsLoading(false)
      }
    }

    // Rotation & interaction
    const rotation: [number, number] = [-95, -35] // Start centered on US
    let autoRotate = true
    const rotationSpeed = 0.3

    const rotate = () => {
      animTime += 0.016
      if (autoRotate) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation)
      }
      render()
    }

    const rotationTimer = d3.timer(rotate)

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation: [number, number] = [...rotation]

      const handleMouseMove = (e: MouseEvent) => {
        rotation[0] = startRotation[0] + (e.clientX - startX) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - (e.clientY - startY) * 0.5))
        projection.rotate(rotation)
        render()
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        setTimeout(() => { autoRotate = true }, 10)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = event.clientX - rect.left
      const my = event.clientY - rect.top
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      let found: StudioPin | null = null
      for (const pin of pins) {
        const projected = projection([pin.lng, pin.lat])
        if (projected) {
          const dist = Math.sqrt((projected[0] - mx) ** 2 + (projected[1] - my) ** 2)
          if (dist < 8 * scaleFactor) {
            found = pin
            setTooltipPos({ x: projected[0], y: projected[1] })
            break
          }
        }
      }
      handlePinHover(found)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const sf = event.deltaY > 0 ? 0.9 : 1.1
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * sf)))
      render()
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("wheel", handleWheel)
    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height, pins, handlePinHover])

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
      {hoveredPin && tooltipPos && (
        <div
          className="pointer-events-none absolute z-20 border border-border bg-background px-3 py-1.5"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 40, transform: "translateX(-50%)" }}
        >
          <p className="font-mono text-[10px] tracking-[0.15em] text-foreground whitespace-nowrap">
            {hoveredPin.name}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground">
            {hoveredPin.city}, {hoveredPin.state}
          </p>
        </div>
      )}
      <p className="mt-2 text-center font-mono text-[9px] text-muted-foreground/50">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  )
}
