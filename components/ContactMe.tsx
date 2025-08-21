'use client'

import {useEffect, useRef, useState} from 'react'

export default function ContactMe() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lastEmail, setLastEmail] = useState<string>('') // for nicer success copy
  const formRef = useRef<HTMLFormElement | null>(null)
  const successTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (successTimer.current) window.clearTimeout(successTimer.current)
    }
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'pending') return // only block while sending

    setStatus('pending')
    setError(null)

    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') || '').trim()
    setLastEmail(email)

    try {
      const res = await fetch('/api/contact', {method: 'POST', body: fd})
      const json = await res.json().catch(() => ({}) as any)
      if (!res.ok || !json.ok) throw new Error(json?.message || 'Lähetys epäonnistui.')

      formRef.current?.reset()
      setStatus('success')

      // after a short moment, return to idle so they can send again
      successTimer.current = window.setTimeout(() => {
        setStatus('idle')
      }, 2500)
    } catch (err: any) {
      setError(err?.message || 'Virhe lähetyksessä.')
      setStatus('error') // allow re-submit after correction
    }
  }

  // If user edits after an error/success, go back to idle and clear error
  function onAnyInput() {
    if (status === 'error' || status === 'success') {
      setStatus('idle')
      setError(null)
    }
  }

  const sending = status === 'pending'

  return (
    <div className="rounded-[0.5rem] border bg-blue px-3 py-6 md:py-12 md:p-8 shadow-sm">
      <h3 className="text-blue hp-h2 hp-h2--light hp-h2--left p-4 md:p-4 text-white">
        Ota yhteyttä!
      </h3>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        onInput={onAnyInput}
        aria-busy={sending}
        className="space-y-5"
      >
        {/* Honeypot (spam trap) — must match API: _hp */}
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="sr-only" />

        <fieldset disabled={sending} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-white">
              Nimi
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-[0.5rem] border border-black/10 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/20"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-white">
              Sähköposti
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-[0.5rem] border border-black/10 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/20"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm text-white">
              Viesti
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full resize-y rounded-[0.5rem] border border-black/10 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Mitä haluaisit toteuttaa?"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={sending}
          aria-disabled={sending}
          className={`w-full rounded-[0.5rem] px-5 py-3 font-semibold transition disabled:opacity-60
            ${
              status === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#11171C] text-white hover:bg-white hover:text-blue'
            }`}
        >
          {sending && (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              Lähetetään…
            </span>
          )}
          {status === 'success' && (
            <span className="inline-flex items-center gap-2">
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16.7 5.7l-7.6 7.6-3.8-3.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Lähetetty
            </span>
          )}
          {status === 'idle' && 'Lähetä'}
          {status === 'error' && 'Yritä uudelleen'}
        </button>

        {/* Success + error copy */}
        {status === 'success' && (
          <p className="text-md text-white">
            Viesti lähetetty — palaan asiaan mahdollisimman pian!
          </p>
        )}
        {status === 'error' && <p className="text-sm text-red-200">{error}</p>}
      </form>
    </div>
  )
}
