'use client'

import React, {useEffect, useMemo, useRef} from 'react'

function RevealCard({title, children}: {title: string; children: React.ReactNode}) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // simple HTML escaper for safety when rebuilding innerHTML
  const esc = (s: string) =>
    s.replace(
      /[&<>"']/g,
      (m) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[m]!,
    )

  useEffect(() => {
    const cardEl = cardRef.current
    const titleEl = titleRef.current
    const bodyEl = bodyRef.current
    if (!cardEl || !titleEl || !bodyEl) return

    if (prefersReduced) {
      // Show everything immediately
      cardEl.style.opacity = '1'
      cardEl.style.transform = 'none'
      titleEl.style.opacity = '1'
      bodyEl.querySelectorAll<HTMLElement>(':scope > *').forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    let cancels: Array<() => void> = []

    ;(async () => {
      const {animate, stagger} = await import('animejs')

      // ---------- 0) Prep initial states ----------
      // card
      cardEl.style.opacity = '0'

      // title → split into WORDS, then into characters inside each word
      const text = titleEl.textContent ?? ''
      titleEl.setAttribute('aria-label', text) // keep accessibility

      const words = text.split(/\s+/).filter(Boolean)
      const wordHtml = words
        .map((w, wi) => {
          const chars = Array.from(w)
            .map((ch) => `<span class="char inline-block opacity-0">${esc(ch)}</span>`)
            .join('')
          // Wrap word to prevent breaking inside it
          const space = wi < words.length - 1 ? '<span class="word-space"> </span>' : ''
          return `<span class="word inline-block whitespace-nowrap align-baseline">${chars}</span>${space}`
        })
        .join('')

      titleEl.innerHTML = wordHtml

      // body → animate each direct child (paragraphs, lists, etc.)
      const bodyKids = Array.from(bodyEl.children) as HTMLElement[]
      bodyKids.forEach((el) => {
        el.style.opacity = '0'
      })

      // ---------- 1) Card in ----------
      const CARD_DUR = 750
      const CARD_DELAY = 250
      const GAP = 120
      const a1 = animate(cardEl, {
        opacity: {from: 0, to: 1},
        translateY: {from: 12, to: 0},
        scale: {from: 0.95, to: 1},
        delay: CARD_DELAY,
        duration: CARD_DUR,
        easing: 'easeOutQuad',
      })
      cancels.push(() => a1.cancel())

      // ---------- 2) Title letters ----------
      const chars = titleEl.querySelectorAll<HTMLElement>('.char')
      const TITLE_PER_CHAR = 28
      const a2 = animate(chars, {
        opacity: {from: 0, to: 1},
        translateY: {from: 1, to: 0},
        duration: 420,
        easing: 'easeOutQuad',
        delay: stagger(TITLE_PER_CHAR, {from: 'first', start: CARD_DELAY + CARD_DUR + GAP}),
      })
      cancels.push(() => a2.cancel())

      // ---------- 3) Body lines ----------
      const BODY_PER_EL = 60
      const a3 = animate(bodyKids, {
        opacity: {from: 0, to: 1},
        translateY: {from: 1, to: 0},
        duration: 420,
        easing: 'easeOutQuad',
        delay: stagger(BODY_PER_EL, {
          start: CARD_DELAY + CARD_DUR + GAP + TITLE_PER_CHAR * Math.max(0, chars.length - 1) + 100,
        }),
      })
      cancels.push(() => a3.cancel())
    })()

    return () => {
      cancels.forEach((fn) => {
        try {
          fn()
        } catch {}
      })
    }
  }, [prefersReduced])

  return (
    <div
      ref={cardRef}
      className="relative rounded-[.5rem] p-5 md:p-20 bg-white shadow-[rgba(0,0,0,0.08)_0px_6px_18px] overflow-hidden"
    >
      <h1
        ref={titleRef}
        className="break-normal whitespace-normal hyphens-none md:[text-wrap:balance] leading-tight font-display text-blue font-bold mb-4 text-3xl md:text-4xl"
      >
        {title}
      </h1>

      <div className="relative text-lg md:text-xl font-light leading-relaxed mt-6" ref={bodyRef}>
        {children}
      </div>
    </div>
  )
}

export default RevealCard
