'use client'

import React, {useEffect, useMemo, useState} from 'react'

const PALETTE = ['#11171C', '#020202', '#1B2730', '#048A81', '#1B2730']

// helpers
function hexToHsl(hex: string) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3)
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  const int = parseInt(hex, 16)
  const r = ((int >> 16) & 255) / 255
  const g = ((int >> 8) & 255) / 255
  const b = (int & 255) / 255
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
      default:
        h = (r - g) / d + 4
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
  // read prefers-reduced-motion on client (stable via useMemo)
  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // crypto RNG (stable function)
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

  // circles per card live in state so we re-render as soon as they exist
  const [circles, setCircles] = useState<Circle[][] | null>(null)

  useEffect(() => {
    // generate once on mount (and when skills length changes)
    const next: Circle[][] = skills.map(() => {
      const count = Math.floor(r(3, 6))
      return Array.from({length: count}).map(() => {
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
    })
    setCircles(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills.length]) // changes only if count of cards changes

  return (
    <section className="w-full py-10 px-4 bg-blue">
      <h2 className="font-display text-white p-7 font-bold mb-6 text-4xl">Erityisosaaminen</h2>

      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 min-w-0">
        {skills.map((skill, i) => {
          const cardCircles = circles?.[i] ?? [] // empty on very first paint (SSR), filled right after mount
          return (
            <li key={`${skill.title}-${i}`} className="group pb-8 sm:pb-2">
              <div
                className="relative flex items-center justify-center
                           h-72 w-full rounded-[.5rem] overflow-hidden
                           text-white font-bold tracking-wide"
              >
                {/* Circles */}
                <div className="absolute inset-0">
                  {cardCircles.map((c, idx) => (
                    <span
                      key={idx}
                      className={`absolute rounded-full will-change-transform ${prefersReduced ? '' : 'anim-floatxy'}`}
                      style={{
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        width: `${c.size}px`,
                        height: `${c.size}px`,
                        transform: 'translate(-50%, -50%)',
                        background: c.color,
                        filter: `blur(${c.blur}px)`,
                        opacity: c.opacity,
                        // animation vars (your CSS reads these)
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

                {/* Glossy overlay */}
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
