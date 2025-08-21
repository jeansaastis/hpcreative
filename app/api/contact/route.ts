import {NextResponse} from 'next/server'
import nodemailer from 'nodemailer'

// Force Node runtime (not Edge)
export const runtime = 'nodejs'

// Mailjet SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g. in-v3.mailjet.com
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.EMAIL_USER!, // Mailjet API Key
    pass: process.env.EMAIL_PASS!, // Mailjet Secret Key
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

/** DARK CARD THEME (matches site) */
function renderEmailHTML(name: string, email: string, message: string) {
  const escName = escapeHtml(name)
  const escEmail = escapeHtml(email)
  const escMsg = escapeHtml(message).replace(/\r\n/g, '\n')

  // Palette
  const BG = '#F3F6F9' // page background
  const CARD = '#1B2730' // dark card
  const TITLE = '#FFFFFF' // title on card
  const LABEL = '#CBD5E1' // light label
  const FIELD_BG = '#FFFFFF'
  const FIELD_TXT = '#11171C'
  const BORDER = '#E6ECF1'
  const ACCENT = '#048A81' // teal button

  return `<!doctype html>
<html lang="fi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Uusi viesti</title>
  </head>
  <body style="margin:0;padding:0;background:${BG};">
    <!-- Preheader (hidden) -->
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Uusi viesti yhteydenottolomakkeesta
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <!-- Card -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:640px;background:${CARD};border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <h1 style="margin:0 0 8px 0;font:800 32px/1.15 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${TITLE};">
                  Uusi viesti saapunut
                </h1>
              </td>
            </tr>

            <!-- Name -->
            <tr>
              <td style="padding:6px 28px 0 28px;">
                <div style="font:600 14px/1.4 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${LABEL};margin:0 0 6px 4px;">
                  Nimi
                </div>
                <div style="background:${FIELD_BG};border:1px solid ${BORDER};border-radius:10px;padding:14px 16px;
                            font:400 15px/1.5 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${FIELD_TXT};">
                  ${escName}
                </div>
              </td>
            </tr>

            <!-- Email -->
            <tr>
              <td style="padding:14px 28px 0 28px;">
                <div style="font:600 14px/1.4 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${LABEL};margin:0 0 6px 4px;">
                  Sähköposti
                </div>
                <div style="background:${FIELD_BG};border:1px solid ${BORDER};border-radius:10px;padding:14px 16px;
                            font:400 15px/1.5 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${FIELD_TXT};">
                  <a href="mailto:${escEmail}" style="color:${FIELD_TXT};text-decoration:none;">${escEmail}</a>
                </div>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:14px 28px 0 28px;">
                <div style="font:600 14px/1.4 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${LABEL};margin:0 0 6px 4px;">
                  Viesti
                </div>
                <div style="background:${FIELD_BG};border:1px solid ${BORDER};border-radius:10px;padding:14px 16px;
                            font:400 15px/1.6 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:${FIELD_TXT};white-space:pre-wrap;">
                  ${escMsg}
                </div>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:20px 28px 24px 28px;">
                <a href="mailto:${escEmail}"
                   style="display:inline-block;background:${ACCENT};color:#FFFFFF;text-decoration:none;
                          font:700 14px/1 -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                          padding:12px 18px;border-radius:10px;">
                  Vastaa lähettäjälle
                </a>
              </td>
            </tr>

            <!-- Footer strip -->
            <tr>
              <td style="background:${CARD};padding:12px 28px 24px 28px;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;font:400 12px/1.5 -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:#C7CED6;">
                  Tämä viesti lähetettiin yhteydenottolomakkeestasi.
                </p>
              </td>
            </tr>
          </table>
          <!-- /Card -->
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function renderEmailText(name: string, email: string, message: string) {
  return `Uusi viesti saapunut

Nimi: ${name}
Sähköposti: ${email}

${message}`
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const name = ((form.get('name') as string) || '').trim()
    const email = ((form.get('email') as string) || '').trim()
    const message = ((form.get('message') as string) || '').trim()

    // Honeypot (_hp) — pretend success if filled
    const honey = ((form.get('_hp') as string) || '').trim()
    if (honey) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Honeypot filled; skipping send.')
      }
      return NextResponse.json({ok: true})
    }

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

    const html = renderEmailHTML(name, email, message)
    const text = renderEmailText(name, email, message)

    // Optional: confirm SMTP ready (skip if you want faster cold starts)
    await transporter.verify().catch(() => {})

    const info = await transporter.sendMail({
      to,
      from,
      subject: `Yhteydenotto: ${name}`,
      replyTo: email,
      text,
      html,
    })

    return NextResponse.json({
      ok: true,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
      response: info.response,
    })
  } catch (err) {
    console.error('contact error:', err)
    return NextResponse.json({ok: false, message: 'Palvelinvirhe.'}, {status: 500})
  }
}
