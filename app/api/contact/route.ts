import {NextResponse} from 'next/server'
import nodemailer from 'nodemailer'

// app/api/contact/route.ts
export const runtime = 'nodejs'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g. in-v3.mailjet.com
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.EMAIL_USER, // Mailjet API Key
    pass: process.env.EMAIL_PASS, // Mailjet Secret Key
  },
})

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'})[m] as string,
  )
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const name = ((form.get('name') as string) || '').trim()
    const email = ((form.get('email') as string) || '').trim()
    const message = ((form.get('message') as string) || '').trim()
    const company = ((form.get('company') as string) || '').trim() // honeypot

    // Honeypot — pretend success so bots don't learn
    if (company) return NextResponse.json({ok: true})

    if (!name || !email || !message) {
      return NextResponse.json({ok: false, message: 'Puuttuvia tietoja.'}, {status: 400})
    }
    if (!isEmail(email)) {
      return NextResponse.json({ok: false, message: 'Sähköpostiosoite ei kelpaa.'}, {status: 400})
    }

    const to = process.env.CONTACT_TO || process.env.EMAIL_USER
    const from = process.env.EMAIL_FROM // must be a verified sender/domain in Mailjet
    if (!to || !from) {
      return NextResponse.json(
        {ok: false, message: 'Sähköpostiasetukset puuttuvat.'},
        {status: 500},
      )
    }

    const html = `
      <h2>Uusi viesti sivustolta</h2>
      <p><strong>Nimi:</strong> ${escapeHtml(name)}</p>
      <p><strong>Sähköposti:</strong> ${escapeHtml(email)}</p>
      <p><strong>Viesti:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `
    const text = `Nimi: ${name}\nSähköposti: ${email}\n\n${message}`

    await transporter.sendMail({
      to,
      from,
      subject: `Yhteydenotto: ${name}`,
      replyTo: email,
      text,
      html,
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('contact error:', err)
    return NextResponse.json({ok: false, message: 'Palvelinvirhe.'}, {status: 500})
  }
}
