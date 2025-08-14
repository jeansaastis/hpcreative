'use client'

import Image from 'next/image'
import React, {useEffect, useRef, useState} from 'react'

type Testimonial = {
  _id?: string
  author?: string
  role?: string
  quote?: string
  portrait?: {asset?: {url?: string}}
}

export default function TestimonialsSection({testimonials}: {testimonials: Testimonial[]}) {
  const [mounted, setMounted] = useState(false)
  const cardRefs = useRef<HTMLDivElement[]>([])
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return

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
    const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`

    const makeNearBlackGradient = (): [string, string, string] => {
      const l1 = r(18, 22) // lightest
      const l2 = r(12, 16) // mid
      const l3 = r(6, 10) // darkest
      return [hsl(0, 0, l1), hsl(0, 0, l2), hsl(0, 0, l3)]
    }

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const [c1, c2, c3] = makeNearBlackGradient()
      el.style.setProperty('--c1', c1)
      el.style.setProperty('--c2', c2)
      el.style.setProperty('--c3', c3)

      const baseAng = 43 + r(-3, 3)
      const spanAng = 8 + r(0, 2)
      const baseMid = 46 + r(-2, 2)
      const spanMid = 6 + r(0, 2)

      el.style.setProperty('--ang-from', `${baseAng - spanAng / 2}deg`)
      el.style.setProperty('--ang-to', `${baseAng + spanAng / 2}deg`)
      el.style.setProperty('--mid-from', `${baseMid - spanMid / 2}%`)
      el.style.setProperty('--mid-to', `${baseMid + spanMid / 2}%`)

      el.style.setProperty('--grad-dur', `${8 + Math.round(r(0, 4))}s`)
      el.style.animationDelay = `${(i * 0.08).toFixed(2)}s`
      el.classList.add('gradient-animate')
    })
  }, [mounted])

  if (!Array.isArray(testimonials) || testimonials.length === 0) return null

  return (
    <section className="w-full py-5 px-6 bg-white">
      <h2 className="font-display font-bold mb-6 text-5xl">HP:sta sanottua</h2>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => {
          if (!t?.quote) return null
          return (
            <li key={t._id || idx}>
              <article
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el
                }}
                className="relative rounded-[.5rem] p-5 md:p-6 min-h-[180px] flex flex-col
                           text-white overflow-hidden gradient-animate"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--ang, 43deg), var(--c1, hsl(0 0% 20%)) 0%, var(--c2, hsl(0 0% 14%)) var(--mid, 46%), var(--c3, hsl(0 0% 8%)) 100%)',
                  backgroundSize: '200% 200%',
                }}
              >
                {/* Portrait */}
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

                {/* Quote */}
                <blockquote className="relative text-lg md:text-xl font-light leading-relaxed mt-6">
                  {t.quote}
                </blockquote>

                {/* Author / role */}
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
