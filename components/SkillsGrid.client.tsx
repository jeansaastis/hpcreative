'use client'

import React, {useEffect, useRef, useState} from 'react'

type Skill = {title: string}

export default function SkillsGrid({skills}: {skills: Skill[]}) {
  const [mounted, setMounted] = useState(false)
  const cardRefs = useRef<HTMLDivElement[]>([])
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // crypto-backed RNG
    const rnd = (() => {
      const buf = new Uint32Array(1)
      return () => {
        try {
          crypto.getRandomValues(buf)
          return buf[0] / 0xffffffff
        } catch {
          return Math.random()
        }
      }
    })()
    const r = (min: number, max: number) => min + (max - min) * rnd()

    // ── NEAR-BLACK GRADIENT: three greys (s=0 so hue is irrelevant) ─────────────
    const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`
    const makeNearBlackGradient = (): [string, string, string] => {
      // very dark base, tiny separation so the motion reads as a shimmer
      const l1 = r(18, 22) // lightest grey
      const l2 = r(12, 16) // mid grey
      const l3 = r(6, 10) // darkest
      const h = 0 // s=0 → grayscale
      return [hsl(h, 0, l1), hsl(h, 0, l2), hsl(h, 0, l3)]
    }

    cardRefs.current.forEach((el, i) => {
      if (!el) return

      // set near-black colours
      const [c1, c2, c3] = makeNearBlackGradient()
      el.style.setProperty('--c1', c1)
      el.style.setProperty('--c2', c2)
      el.style.setProperty('--c3', c3)

      if (prefersReduced) return

      // Subtle value motion: small angle swing + slight mid-stop drift
      const baseAng = 43 + r(-3, 3)
      const spanAng = 8 + r(0, 2)
      const baseMid = 46 + r(-2, 2)
      const spanMid = 6 + r(0, 2)

      el.style.setProperty('--ang-from', `${baseAng - spanAng / 2}deg`)
      el.style.setProperty('--ang-to', `${baseAng + spanAng / 2}deg`)
      el.style.setProperty('--mid-from', `${baseMid - spanMid / 2}%`)
      el.style.setProperty('--mid-to', `${baseMid + spanMid / 2}%`)

      // Slow, smooth; slight stagger per card
      el.style.setProperty('--grad-dur', `${8 + Math.round(r(0, 4))}s`)
      el.style.animationDelay = `${(i * 0.08).toFixed(2)}s`

      el.classList.add('gradient-animate')
    })
  }, [mounted])

  if (!mounted) return null

  return (
    <section className="w-full py-5 px-6 bg-white">
      <h2 className="font-display font-bold mb-6 text-5xl">Erityisosaaminen</h2>

      <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-0">
        {skills.map((skill, i) => (
          <li key={skill.title} className="group">
            <div
              ref={(el) => {
                if (el) cardRefs.current[i] = el
              }}
              className="relative flex items-center justify-center
                         h-48 sm:h-56 md:h-[254px] w-full rounded-[.5rem] overflow-hidden
                         text-white font-bold tracking-wide
                         shadow-[rgba(255,255,255,0.08)_0px_1px_0px_inset,
                                 rgba(0,0,0,0.25)_0px_-10px_20px_inset,
                                 rgba(0,0,0,0.2)_0px_2px_2px,
                                 rgba(0,0,0,0.15)_0px_4px_4px,
                                 rgba(0,0,0,0.1)_0px_8px_8px]
                         transform-gpu transition-transform duration-300
                         group-hover:scale-[1.03] group-hover:shadow-lg gradient-animate"
              style={{
                backgroundImage:
                  'linear-gradient(var(--ang, 43deg), var(--c1, hsl(0 0% 20%)) 0%, var(--c2, hsl(0 0% 14%)) var(--mid, 46%), var(--c3, hsl(0 0% 8%)) 100%)',
                backgroundSize: '200% 200%',
              }}
            >
              <span className="font-display z-10 text-3xl px-6">{skill.title}</span>

              {/* very subtle gloss to make the grey pop */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[.5rem]
                           bg-gradient-to-t from-transparent via-white/5 to-white/10
                           opacity-40"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
