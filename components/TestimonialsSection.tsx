'use client'

import Image from 'next/image'
import React, {useEffect, useMemo, useRef, useState} from 'react'

const PALETTE = ['#11171C', '#020202', '#1B2730', '#048A81', '#1B2730']

type Testimonial = {
  _id?: string
  author?: string
  role?: string
  quote?: string
  portrait?: {asset?: {url?: string}}
}

export default function TestimonialsSection({testimonials}: {testimonials: Testimonial[]}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        : false,
    [],
  )

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

  const circles = useRef<any[]>([])
  if (mounted && circles.current.length === 0) {
    const count = Math.floor(r(8, 14))
    circles.current = Array.from({length: count}).map(() => {
      const base = PALETTE[Math.floor(r(0, PALETTE.length))]
      const dx = r(-40, 50)
      const dy = r(-30, 40)
      return {
        x: r(5, 95),
        y: r(5, 95),
        size: r(60, 140),
        color: base,
        blur: r(18, 36),
        opacity: r(0.1, 0.25),
        dur: r(9, 15),
        delay: r(0, 3),
        dx,
        dy,
        dx2: -0.6 * dx,
        dy2: -0.6 * dy,
      }
    })
  }

  if (!Array.isArray(testimonials) || testimonials.length === 0) return null

  return (
    <section className="w-full py-20 px-10 text-white bg-blue relative overflow-hidden">
      {/* Floating circles background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {circles.current.map((c, idx) => (
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
      )}

      <h2 className="font-display text-white p-7 font-bold mb-6 text-2xl sm:text-3xl md:text-4xl">
        HP:sta sanottua
      </h2>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {testimonials.map((t, idx) => {
          if (!t?.quote) return null
          return (
            <li key={t._id || idx}>
              <article className="relative rounded-[.5rem] sm:p-5 md:p-6 min-h-[180px] flex flex-col text-white overflow-hidden">
                {t.portrait?.asset?.url && (
                  <div className="absolute top-4 left-4 h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/20">
                    <Image
                      src={t.portrait.asset.url}
                      alt={t.author ? `${t.author} portrait` : 'Portrait'}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
                <blockquote className="relative text-lg md:text-xl font-light leading-relaxed mt-6">
                  {t.quote}
                </blockquote>
                <div className="mt-4">
                  {t.author && <div className="font-semibold">{t.author}</div>}
                  {t.role && <div className="text-sm text-white/70">{t.role}</div>}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
