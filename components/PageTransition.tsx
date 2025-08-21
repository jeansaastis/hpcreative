'use client'

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

function isInternalLink(a: HTMLAnchorElement) {
  const u = new URL(a.href, location.href)
  return u.origin === location.origin
}

// normalize to “/path?query” (ignore hash, trim trailing slash except root)
function normalizePathAndQuery(url: string) {
  const u = new URL(url, location.href)
  let p = u.pathname
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p + u.search
}

export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const [show, setShow] = useState(false)
  const navigatingRef = useRef(false)
  const hideTimer = useRef<number | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // ignore modified clicks, non-left clicks, etc.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return

      // find <a>
      let el = e.target as HTMLElement | null
      while (el && el.tagName !== 'A') el = el.parentElement
      const a = el as HTMLAnchorElement | null
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return
      if (!isInternalLink(a)) return
      if (a.dataset.noTransition === 'true') return

      const rawHref = a.getAttribute('href') || ''
      // let hash-only navigations pass (same path, has hash)
      const samePath = rawHref.split('#')[0] === location.pathname
      if (samePath && rawHref.includes('#')) return

      const target = normalizePathAndQuery(a.href)
      const current = normalizePathAndQuery(location.href)

      // if already on that route (same path+query), don't do anything
      if (target === current) return

      e.preventDefault()

      // start overlay and fallback auto-hide
      navigatingRef.current = true
      setShow(true)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      hideTimer.current = window.setTimeout(
        () => {
          // safety: if route never changed, don’t get stuck
          if (navigatingRef.current) {
            setShow(false)
            navigatingRef.current = false
          }
        },
        reduce ? 300 : 1500,
      )

      // tiny lead-in so overlay is visible before push
      setTimeout(() => router.push(rawHref), reduce ? 0 : 50)
    }

    const onPop = () => {
      // back/forward
      navigatingRef.current = true
      setShow(true)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      hideTimer.current = window.setTimeout(
        () => {
          if (navigatingRef.current) {
            setShow(false)
            navigatingRef.current = false
          }
        },
        reduce ? 300 : 1500,
      )
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
    }
  }, [router, reduce])

  // When the route actually changes, fade overlay out and clear fallback
  useEffect(() => {
    if (!navigatingRef.current) return
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    const t = window.setTimeout(
      () => {
        setShow(false)
        navigatingRef.current = false
      },
      reduce ? 0 : 250,
    )
    return () => window.clearTimeout(t)
  }, [pathname, reduce])

  const inDur = reduce ? 0 : 0.14
  const outDur = reduce ? 0 : 0.22

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="page-fade"
          initial={{opacity: 0}}
          animate={{opacity: 1, transition: {duration: inDur, ease: 'linear'}}}
          exit={{opacity: 0, transition: {duration: outDur, ease: 'linear'}}}
          className="fixed inset-0 z-[60] pointer-events-none bg-white"
          aria-hidden
        />
      )}
    </AnimatePresence>
  )
}
