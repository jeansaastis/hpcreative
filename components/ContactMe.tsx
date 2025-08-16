'use client'

import {useState} from 'react'

export default function ContactMe() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('pending')
    setError(null)
    const fd = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contact', {method: 'POST', body: fd})
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) throw new Error(json?.message || 'Lähetys epäonnistui.')
      setStatus('success')
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (err: any) {
      setStatus('error')
      setError(err?.message || 'Virhe lähetyksessä.')
    }
  }

  return (
    <div className="rounded-[0.5rem] border  bg-blue p-8 shadow-sm">
      <h3 className="mb-6 font-display text-3xl md:text-4xl font-bold text-white">Ota yhteyttä!</h3>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Honeypot (spam trap) */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="sr-only" />

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

        <button
          type="submit"
          disabled={status === 'pending'}
          className="w-full rounded-[0.5rem] bg-[#11171C] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === 'pending' ? 'Lähetetään…' : 'Lähetä'}
        </button>

        {status === 'success' && (
          <p className="text-sm text-green-700">Kiitos viestistä! Otan yhteyttä pian.</p>
        )}
        {status === 'error' && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </div>
  )
}
