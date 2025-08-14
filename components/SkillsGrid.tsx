'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react'

// palette sampled from the hero photo
const PALETTE = ['#21231d', '#3d6382', '#6d98ba', '#7d8385', '#a18d5a', '#655e3a', '#d6c4a2']

// helpers
const hexToHsl = (hex: string) => {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16) / 255
  const g = parseInt(m.slice(2, 4), 16) / 255
  const b = parseInt(m.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }
  return {h, s: s * 100, l: l * 100}
}
const hslToCss = (h: number, s: number, l: number) =>
  `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`
const jitter = (v: number, amt: number) =>
  Math.max(0, Math.min(100, v + (Math.random() * 2 - 1) * amt))

type Skill = {title: string}
type Circle = {
  x: number
  y: number
  size: number
  color: string
  blur: number
  opacity: number
  dur: number
  delay: number
  dx: number
  dy: number
  dx2: number
  dy2: number
}

export default function SkillsGrid({skills}: {skills: Skill[]}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Read prefers-reduced-motion only on client
  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // crypto RNG
  const rnd = useMemo(() => {
    const buf = new Uint32Array(1)
    return () => {
      try {
        crypto.getRandomValues(buf)
        return buf[0] / 0xffffffff
      } catch {
        return Math.random()
      }
    }
  }, [])
  const r = (min: number, max: number) => min + (max - min) * rnd()

  // cache circles per card (persists across renders)
  const circlesPerCard = useRef<Record<number, Circle[]>>({})

  // --- Server/skeleton: no random, no animation (avoids hydration issues) ---
  if (!mounted) {
    return (
      <section className="w-full py-5 px-6 bg-white">
        <h2 className="font-display font-bold mb-6 text-5xl">Erityisosaaminen</h2>
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-0">
          {skills.map((skill, i) => (
            <li key={`${skill.title}-${i}`} className="group">
              <div
                className="relative flex items-center justify-center
                           h-48 sm:h-56 md:h-[254px] w-full rounded-[.5rem] overflow-hidden
                           text-white font-bold tracking-wide bg-black
                           transform-gpu transition-transform duration-300
                           group-hover:scale-[1.03] group-hover:shadow-lg"
              >
                <span className="font-display z-10 text-3xl px-6 text-center select-none">
                  {skill.title}
                </span>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[.5rem]
                             bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-40"
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  // --- Client: generate & render animated circles ---
  return (
    <section className="w-full py-5 px-6 bg-white">
      <h2 className="font-display font-bold mb-6 text-5xl">Erityisosaaminen</h2>

      <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-0">
        {skills.map((skill, i) => {
          if (!circlesPerCard.current[i]) {
            const count = Math.floor(r(3, 6))
            circlesPerCard.current[i] = Array.from({length: count}).map(() => {
              const base = PALETTE[Math.floor(r(0, PALETTE.length))]
              const {h, s, l} = hexToHsl(base)
              const dx = r(-60, 90)
              const dy = r(-45, 70)
              return {
                x: r(10, 90),
                y: r(10, 85),
                size: r(70, 160),
                color: hslToCss(h, jitter(s, 6), jitter(l, 8)),
                blur: r(10, 26),
                opacity: r(0.22, 0.4),
                dur: r(8, 12),
                delay: r(0, 2.5),
                dx,
                dy,
                dx2: -0.6 * dx,
                dy2: -0.6 * dy,
              }
            })
          }
          const circles = circlesPerCard.current[i]

          return (
            <li key={`${skill.title}-${i}`} className="group">
              <div
                className="relative flex items-center justify-center
                           h-48 sm:h-56 md:h-[254px] w-full rounded-[.5rem] overflow-hidden
                           text-black font-bold tracking-wide bg-white
                           transition-transform duration-300"
              >
                {/* Circles */}
                <div className="absolute inset-0">
                  {circles.map((c, idx) => (
                    <span
                      key={idx}
                      className={`absolute rounded-full will-change-transform ${
                        prefersReduced ? '' : 'anim-floatxy'
                      }`}
                      style={{
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        width: `${c.size}px`,
                        height: `${c.size}px`,
                        transform: 'translate(-50%, -50%)',
                        background: c.color,
                        filter: `blur(${c.blur}px)`,
                        opacity: c.opacity,
                        // animation vars read by .anim-floatxy
                        ['--dx' as any]: `${c.dx}px`,
                        ['--dy' as any]: `${c.dy}px`,
                        ['--dx2' as any]: `${c.dx2}px`,
                        ['--dy2' as any]: `${c.dy2}px`,
                        ['--dur' as any]: `${c.dur}s`,
                        ['--delay' as any]: `${c.delay}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Label */}
                <span className="font-display z-10 text-3xl px-6 text-center select-none">
                  {skill.title}
                </span>

                {/* Glass */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[.5rem]
                             bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-40"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
