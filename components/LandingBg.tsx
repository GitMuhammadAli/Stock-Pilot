import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// App brand color palette
const BRAND_GREEN = 82; // HSL: #B6F400
const BRAND_BLUE = 220; // HSL: #2C3444
const BRAND_NAVY = 225; // HSL: #0B0F1A

interface AnimatedGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  pulse: number
  pulseSpeed: number
}

function createBeam(width: number, height: number, colorHues: number[]): Beam {
  const angle = -35 + Math.random() * 10
  // Pick a hue from the brand palette, weighted toward green and blue
  const hue = colorHues[Math.floor(Math.random() * colorHues.length)]
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: hue,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

export default function BeamsBackground({
  className,
  intensity = "strong",
  children,
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)

  const MINIMUM_BEAMS = 20
  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  }

  // Use brand color hues for the beams
  const colorHues = [
    BRAND_GREEN, // green
    BRAND_BLUE,  // blue
    (BRAND_GREEN + BRAND_BLUE) / 2, // blend
    BRAND_NAVY,  // navy
    100,         // yellow-green accent
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform before scaling
      ctx.scale(dpr, dpr)
      const totalBeams = Math.round(MINIMUM_BEAMS * 1.5)
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(window.innerWidth, window.innerHeight, colorHues)
      )
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam
      const column = index % 3
      const spacing = window.innerWidth / 3
      beam.y = window.innerHeight + 100
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 100
      beam.speed = 0.5 + Math.random() * 0.4
      beam.hue = colorHues[index % colorHues.length]
      beam.opacity = 0.2 + Math.random() * 0.1
      return beam
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)
      // Calculate pulsing opacity
      const pulsingOpacity =
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity]
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
      // Enhanced gradient with multiple color stops
      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`)
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`)
      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = "blur(35px)"
      const totalBeams = beamsRef.current.length
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed
        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams)
        }
        drawBeam(ctx, beam)
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [intensity])

  // Brand background gradient for the hero section
  const heroGradient =
    "linear-gradient(120deg, rgba(182,244,0,0.14) 0%, rgba(44,52,68,0.18) 40%, rgba(11,15,26,0.98) 100%)"

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* Canvas beams */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ filter: "blur(15px)" }} />
      {/* Brand gradient overlay */}
      <div
        className="absolute inset-0 z-10  pointer-events-none"
        style={{
          background: heroGradient,
        }}
      />
      {/* Optional animated subtle overlay */}
      <motion.div
        className="absolute inset-0 z-20"
        animate={{
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(50px)",
        }}
      />
      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  )
}