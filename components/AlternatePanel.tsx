import {LinkedInIcon} from '@/components/icons/LinkedIn'

export default function BlogEmptyPanel({
  heading = 'Tänne nostan kiinnostavia ilmiöitä, kun ehdin kirjoittaa.',
  sub = 'Sillä välin ota yhteyttä — vastaan mielelläni kysymyksiin.',
  linkedinUrl,
  email,
  phone,
}: {
  heading?: string
  sub?: string
  linkedinUrl?: string
  email?: string
  phone?: string
}) {
  const telHref = phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined

  return (
    <div className="p-0 sm:p-0">
      {/* Heading — same “feel” as earlier (display, bold, blue) */}
      <h3 className="font-display text-blue font-bold mb-2 text-4xl">{heading}</h3>

      {/* Subcopy */}
      <p className="text-[#11171C] text-base md:text-2xl">{sub}</p>

      {/* Contacts */}
      <div className="mt-5 space-y-3 text-[#11171C]">
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-6 inline-flex items-center gap-2 hover:opacity-90"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-7 w-7" />
            <span className="text-xl">Löydät minut myös LinkedIn-palvelusta.</span>
          </a>
        )}
      </div>
    </div>
  )
}
