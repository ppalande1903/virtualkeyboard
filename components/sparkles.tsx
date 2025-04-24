"use client"
import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export const SparklesCore = ({
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFC0CB",
  particleDensity = 100,
}: SparklesProps) => {
  const { theme } = useTheme()
  const [color, setColor] = useState(particleColor)
  const particlesContainer = useRef<HTMLDivElement>(null)
  const [init, setInit] = useState(false)

  useEffect(() => {
    setColor(theme === "dark" ? "#FF69B4" : "#FFC0CB")
  }, [theme])

  useEffect(() => {
    if (!init) {
      setInit(true)
    }

    if (!particlesContainer.current || !init) return

    const particles = []
    const densityArea = (particlesContainer.current.offsetWidth * particlesContainer.current.offsetHeight) / 1000
    const particleCount = Math.floor((densityArea * particleDensity) / 100)

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "sparkle"
      particle.style.width = `${Math.random() * (maxSize - minSize) + minSize}px`
      particle.style.height = particle.style.width
      particle.style.background = color
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animationDuration = `${Math.random() * 2 + 1}s`
      particle.style.animationDelay = `${Math.random() * 2}s`
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

      particlesContainer.current.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach((particle) => {
        if (particlesContainer.current) {
          particlesContainer.current.removeChild(particle)
        }
      })
    }
  }, [init, maxSize, minSize, particleDensity, color])

  return (
    <div
      ref={particlesContainer}
      id={id}
      className={className}
      style={{
        background,
        position: "relative",
        overflow: "hidden",
      }}
    />
  )
}
