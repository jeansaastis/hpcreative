// ensure not Edge

import nodemailer from 'nodemailer'

// app/api/contact/route.ts
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const name = ((form.get('name') as string) || '').trim()
    const email = ((form.get('email') as string) || '').trim()
    const message = ((form.get('message') as string) || '').trim()
    const company = ((form.get('company') as string) || '').trim() // honeypot

    if (company) return Response.json({ok: true}) // spam trap

    if (!name || !email || !message) {
      return Response.json({ok: false, message: 'Puuttuvia tietoja.'}, {status: 400})
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // in-v3.mailjet.com
      port: Number(process.env.EMAIL_PORT), // 587
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER, // Mailjet API Key
        pass: process.env.EMAIL_PASS, // Mailjet Secret Key
      },
    })

    const to = process.env.CONTACT_TO!
    const from = process.env.EMAIL_FROM! // must be a verified sender/domain in Mailjet

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

    return Response.json({ok: true})
  } catch (err) {
    console.error(err)
    return Response.json({ok: false, message: 'Palvelinvirhe.'}, {status: 500})
  }
}

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'})[m] as string,
  )
}
